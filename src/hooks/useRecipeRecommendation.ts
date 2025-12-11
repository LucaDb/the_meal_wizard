import { useCallback, useEffect, useRef, useState } from 'react'
import type { Recipe } from '../api/api'
import { getRecipeRecommendation } from '../api/api'
import type { FormData } from '../components/Form'
import { useError } from '../context'

export function useRecipeRecommendation(formData: FormData) {
  const { showError } = useError()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shownRecipeIds, setShownRecipeIds] = useState<string[]>([])
  const lastFetchedParamsRef = useRef<string>('')
  const isLoadingRef = useRef<boolean>(false)

  const parseIngredientOrCategory = (
    value: string,
    selectedTypeStr?: string
  ) => {
    if (!value) return { ingredient: undefined, category: undefined }

    const selectedType = selectedTypeStr as
      | 'ingredient'
      | 'category'
      | undefined

    if (selectedType === 'ingredient') {
      return { ingredient: value, category: undefined }
    }
    if (selectedType === 'category') {
      return { ingredient: undefined, category: value }
    }

    return { ingredient: undefined, category: undefined }
  }

  const fetchRecipe = useCallback(async () => {
    if (isLoadingRef.current) return
    if (!formData.cuisine || !formData.ingredientOrCategory) return

    isLoadingRef.current = true
    setIsLoading(true)
    setError(null)

    const recipeKey = `${formData.cuisine}:${formData.ingredientOrCategory}`

    // Reset shown recipes if this is a new search
    if (recipeKey !== lastFetchedParamsRef.current) {
      setShownRecipeIds([])
      lastFetchedParamsRef.current = recipeKey
    }

    try {
      const selectedTypeMeta = formData.ingredientOrCategory_meta
        ? JSON.parse(formData.ingredientOrCategory_meta).type
        : undefined

      const { ingredient, category } = parseIngredientOrCategory(
        formData.ingredientOrCategory,
        selectedTypeMeta
      )

      const fetchedRecipe = await getRecipeRecommendation(
        {
          area: formData.cuisine,
          ingredient,
          category,
        },
        shownRecipeIds
      )

      if (fetchedRecipe) {
        setRecipe(fetchedRecipe)
        setShownRecipeIds(prev => [...prev, fetchedRecipe.idMeal])
      } else {
        const errorMsg = 'No recipe found. Please try again.'
        setError(errorMsg)
        showError(errorMsg)
      }
    } catch (_err) {
      const errorMsg = 'Failed to load recipe. Please try again.'
      setError(errorMsg)
      showError(errorMsg)
    } finally {
      isLoadingRef.current = false
      setIsLoading(false)
    }
  }, [formData, shownRecipeIds, showError])

  const handleNewRecipe = useCallback(async () => {
    await fetchRecipe()
  }, [fetchRecipe])

  // Auto-fetch when component mounts or formData changes
  useEffect(() => {
    if (formData.cuisine && formData.ingredientOrCategory) {
      fetchRecipe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only on mount

  return {
    recipe,
    isLoading,
    error,
    handleNewRecipe,
  }
}
