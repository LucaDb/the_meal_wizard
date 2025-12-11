import { useEffect, useState } from 'react'
import type { MealListItem } from '../api/api'
import { fetchAreas } from '../api/api'
import { useError } from '../context'

// Module-level cache
let cachedAreas: MealListItem[] | null = null
let cacheError: string | null = null

export function useAreas() {
  const { showError } = useError()
  const [areas, setAreas] = useState<MealListItem[]>(cachedAreas || [])
  const [isLoading, setIsLoading] = useState(!cachedAreas)
  const [error, setError] = useState<string | null>(cacheError)

  useEffect(() => {
    // Skip if already cached
    if (cachedAreas) return

    const loadAreas = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await fetchAreas()
        cachedAreas = data // Cache the data
        setAreas(data)
      } catch (err) {
        console.error('Failed to load areas:', err)
        const errorMsg = 'Failed to load areas'
        cacheError = errorMsg
        setError(errorMsg)
        showError(errorMsg)
      } finally {
        setIsLoading(false)
      }
    }
    loadAreas()
  }, [showError])

  return { areas, isLoading, error }
}
