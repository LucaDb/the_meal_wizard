import type { Recipe } from '@api/api'
import { Button } from '@components/Button/Button'
import { Card } from '@components/Card'
import { useForm } from '@components/Form'
import { createRecipePreference, usePreferences } from '@context/index'
import { useRecipeRecommendation } from '@hooks/useRecipeRecommendation'
import { useCallback, useMemo } from 'react'
import styles from './RecipeRecommendation.module.scss'

interface RecipeRecommendationProps {
  onBack: () => void
}

export function RecipeRecommendation({ onBack }: RecipeRecommendationProps) {
  const { formData } = useForm()
  const { recipe, isLoading, error, handleNewRecipe } =
    useRecipeRecommendation(formData)

  const { preferences, savePreference } = usePreferences()

  // Get current recipe preference - recompute when preferences change
  const currentRecipePreference = useMemo(() => {
    if (!recipe) return undefined
    return preferences.find(p => p.id === recipe.idMeal)
  }, [preferences, recipe])

  // Helper to save recipe preference - memoized to prevent recreating on every render
  const handleSavePreference = useCallback(
    (recipe: Recipe, preference: 1 | -1) => {
      const recipePreference = createRecipePreference(
        recipe as unknown as Parameters<typeof createRecipePreference>[0],
        preference
      )
      savePreference(recipePreference)
    },
    [savePreference]
  )

  // Get ingredient name if user selected an ingredient (not category)
  const getSelectedIngredientName = () => {
    if (!formData.ingredientOrCategory) return null

    // Check meta to see if it's an ingredient
    const meta = formData.ingredientOrCategory_meta
    if (meta) {
      try {
        const parsedMeta = JSON.parse(meta)
        if (parsedMeta.type === 'ingredient') {
          return formData.ingredientOrCategory
        }
      } catch {
        // If meta parsing fails, return null
      }
    }
    return null
  }

  return (
    <div className={styles.recipeContainer}>
      {isLoading ? (
        <div className={styles.recipe__loading}>Loading recipe...</div>
      ) : error ? (
        <div className={styles.recipe__error}>{error}</div>
      ) : recipe ? (
        <>
          <Card
            recipe={recipe}
            ingredientName={getSelectedIngredientName() || ''}
            onSaveRecipePreference={handleSavePreference}
            currentRecipePreference={currentRecipePreference}
          />

          <div className={styles.recipe__actions}>
            <Button variant="secondary" onClick={onBack}>
              Go Back
            </Button>
            <Button variant="primary" onClick={handleNewRecipe}>
              New Idea
            </Button>
          </div>
        </>
      ) : null}
    </div>
  )
}
