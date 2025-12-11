import { searchRecipesByName, type Recipe } from '@api/api'
import { Card } from '@components/Card'
import { Dropdown, type DropdownOption } from '@components/Dropdown'
import {
  createRecipePreference,
  useError,
  usePreferences,
} from '@context/index'
import { useCallback, useMemo, useState } from 'react'
import styles from './Search.module.scss'

export function Search() {
  const { preferences, savePreference } = usePreferences()
  const [selectedRecipeId, setSelectedRecipeId] = useState('')
  const [options, setOptions] = useState<DropdownOption[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const { showError } = useError()
  const selectedRecipe = recipes.find(r => r.idMeal === selectedRecipeId)

  // Compute current preference reactively
  const currentPreference = useMemo(() => {
    if (!selectedRecipeId) return undefined
    return preferences.find(p => p.id === selectedRecipeId)
  }, [preferences, selectedRecipeId])

  const handleSearch = useCallback(
    async (searchTerm: string) => {
      if (!searchTerm.trim()) {
        setOptions([])
        setRecipes([])
        return
      }

      setIsLoading(true)
      try {
        const results = await searchRecipesByName(searchTerm)
        const limitedResults = results.slice(0, 5)
        setRecipes(limitedResults)

        const dropdownOptions: DropdownOption[] = limitedResults.map(
          recipe => ({
            value: recipe.idMeal,
            label: recipe.strMeal,
            meta: {
              category: recipe.strCategory,
              area: recipe.strArea,
              thumb: `${recipe.strMealThumb}/small`,
            },
          })
        )

        setOptions(dropdownOptions)
      } catch (_error) {
        showError('Oops! Something went wrong. Please try again.')
        setOptions([])
        setRecipes([])
      } finally {
        setIsLoading(false)
      }
    },
    [showError]
  )

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

  return (
    <div className={styles.search}>
      <h2 className={styles.search__title}>Search for a recipe by name</h2>
      <div className={styles.search__field}>
        <label htmlFor="recipe-search" className={styles.search__label}>
          Recipe name
        </label>
        <Dropdown
          id="recipe-search"
          value={selectedRecipeId}
          options={options}
          placeholder="Type to search recipes..."
          searchable={true}
          isLoading={isLoading}
          onSearch={handleSearch}
          onChange={setSelectedRecipeId}
          aria-label="Search for recipes by name"
        />
      </div>

      {selectedRecipe && (
        <div className={styles.search__result}>
          <Card
            recipe={selectedRecipe}
            ingredientName={null}
            onSaveRecipePreference={handleSavePreference}
            currentRecipePreference={currentPreference}
          />
        </div>
      )}
    </div>
  )
}
