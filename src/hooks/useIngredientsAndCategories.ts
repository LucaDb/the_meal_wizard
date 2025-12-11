import { useEffect, useState } from 'react'
import type { MealListItem } from '../api/api'
import { fetchCategories, fetchIngredients } from '../api/api'
import { useError } from '../context'

interface IngredientsAndCategories {
  ingredients: MealListItem[]
  categories: MealListItem[]
}

// Module-level cache
let cachedData: IngredientsAndCategories | null = null
let cacheError: string | null = null

export function useIngredientsAndCategories() {
  const { showError } = useError()
  const [data, setData] = useState<IngredientsAndCategories>(
    cachedData || { ingredients: [], categories: [] }
  )
  const [isLoading, setIsLoading] = useState(!cachedData)
  const [error, setError] = useState<string | null>(cacheError)

  useEffect(() => {
    // Skip if already cached
    if (cachedData) return

    const loadData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const [ingredients, categories] = await Promise.all([
          fetchIngredients(),
          fetchCategories(),
        ])

        const result = { ingredients, categories }
        cachedData = result // Cache the data
        setData(result)
      } catch (err) {
        console.error('Failed to load options:', err)
        const errorMsg = 'Failed to load ingredients and categories'
        cacheError = errorMsg
        setError(errorMsg)
        showError(errorMsg)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [showError])

  return { data, isLoading, error }
}
