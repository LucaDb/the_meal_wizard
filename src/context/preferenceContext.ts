import { createContext, useContext } from 'react'
import type { DropdownOption } from '../components/Dropdown'

export interface RecipePreference {
  id: string
  title: string
  preference: 1 | -1
  timestamp: number
  imageUrl?: string
  category?: string
  area?: string
  ingredients?: string[]
}

export interface PreferenceContextValue {
  preferences: RecipePreference[]
  savePreference: (preference: RecipePreference) => void
  removePreference: (id: string) => void
  getPreferenceForRecipe: (id: string) => RecipePreference | undefined
  getPreferenceScore: (
    value: string,
    type: 'area' | 'ingredient' | 'category'
  ) => number
  sortOptionsByPreference: (
    options: DropdownOption[],
    type: 'area' | 'ingredient' | 'category'
  ) => DropdownOption[]
}

export const PreferenceContext = createContext<
  PreferenceContextValue | undefined
>(undefined)

export function usePreferences(): PreferenceContextValue {
  const context = useContext(PreferenceContext)
  if (!context) {
    throw new Error('usePreferences must be used within a PreferenceProvider')
  }
  return context
}
