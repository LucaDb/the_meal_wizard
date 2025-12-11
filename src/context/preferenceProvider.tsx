import React, { useCallback, useState, type ReactNode } from 'react'
import type { DropdownOption } from '../components/Dropdown'
import { useError } from './errorContext'
import { PreferenceContext, type RecipePreference } from './preferenceContext'

// ============================================================================
// localStorage Operations
// ============================================================================

const STORAGE_KEY = 'recipe_preferences'

const getPreferencesFromStorage = (): RecipePreference[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    return JSON.parse(stored)
  } catch (error) {
    console.error('Failed to load preferences:', error)
    return []
  }
}

const savePreferenceToStorage = (preference: RecipePreference): void => {
  try {
    const existing = getPreferencesFromStorage()
    const existingIndex = existing.findIndex(p => p.id === preference.id)

    let updated: RecipePreference[]
    if (existingIndex >= 0) {
      updated = [...existing]
      updated[existingIndex] = preference
    } else {
      updated = [preference, ...existing]
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch (error) {
    console.error('Failed to save preference:', error)
  }
}

const removePreferenceFromStorage = (id: string): void => {
  try {
    const existing = getPreferencesFromStorage()
    const updated = existing.filter(p => p.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch (error) {
    console.error('Failed to remove preference:', error)
  }
}

// ============================================================================
// Preference Provider
// ============================================================================

interface PreferenceProviderProps {
  children: ReactNode
}

export const PreferenceProvider: React.FC<PreferenceProviderProps> = ({
  children,
}) => {
  const { showError } = useError()
  const [preferences, setPreferences] = useState<RecipePreference[]>(() =>
    getPreferencesFromStorage()
  )

  const savePreference = useCallback(
    (preference: RecipePreference) => {
      try {
        savePreferenceToStorage(preference)
        setPreferences(getPreferencesFromStorage())
      } catch (_e) {
        showError('Failed to save preference. Please try again.')
      }
    },
    [showError]
  )

  const removePreference = useCallback((id: string) => {
    removePreferenceFromStorage(id)
    setPreferences(getPreferencesFromStorage())
  }, [])

  // Get preference for a specific recipe
  const getPreferenceForRecipe = useCallback(
    (id: string): RecipePreference | undefined => {
      return preferences.find(p => p.id === id)
    },
    [preferences]
  )

  // Calculate preference score for sorting
  const getPreferenceScore = useCallback(
    (value: string, type: 'area' | 'ingredient' | 'category'): number => {
      let score = 0

      preferences.forEach(pref => {
        if (
          type === 'area' &&
          pref.area?.toLowerCase() === value.toLowerCase()
        ) {
          score += pref.preference
        } else if (
          type === 'category' &&
          pref.category?.toLowerCase() === value.toLowerCase()
        ) {
          score += pref.preference
        } else if (
          type === 'ingredient' &&
          pref.ingredients?.some(
            ing => ing.toLowerCase() === value.toLowerCase()
          )
        ) {
          score += pref.preference
        }
      })

      return score
    },
    [preferences]
  )

  // Sort options based on preferences
  const sortOptionsByPreference = useCallback(
    (
      options: DropdownOption[],
      type: 'area' | 'ingredient' | 'category'
    ): DropdownOption[] => {
      return [...options].sort((a, b) => {
        const aScore = getPreferenceScore(a.value, type)
        const bScore = getPreferenceScore(b.value, type)

        // First sort by score (highest first)
        if (aScore !== bScore) {
          return bScore - aScore
        }
        // Then alphabetically for items with same score
        return a.label.localeCompare(b.label)
      })
    },
    [getPreferenceScore]
  )

  return (
    <PreferenceContext.Provider
      value={{
        preferences,
        savePreference,
        removePreference,
        getPreferenceForRecipe,
        getPreferenceScore,
        sortOptionsByPreference,
      }}
    >
      {children}
    </PreferenceContext.Provider>
  )
}
