const API_BASE = 'https://www.themealdb.com/api/json/v1/1'

export interface MealListItem {
  strArea?: string
  strCategory?: string
  strIngredient?: string
  idMeal?: string
  strMeal?: string
  strMealThumb?: string
}

export interface Recipe {
  idMeal: string
  strMeal: string
  strDrinkAlternate?: string
  strCategory: string
  strArea: string
  strInstructions: string
  strMealThumb: string
  strTags?: string
  strYoutube?: string
  strIngredient1?: string
  strIngredient2?: string
  strIngredient3?: string
  strIngredient4?: string
  strIngredient5?: string
  strIngredient6?: string
  strIngredient7?: string
  strIngredient8?: string
  strIngredient9?: string
  strIngredient10?: string
  strIngredient11?: string
  strIngredient12?: string
  strIngredient13?: string
  strIngredient14?: string
  strIngredient15?: string
  strIngredient16?: string
  strIngredient17?: string
  strIngredient18?: string
  strIngredient19?: string
  strIngredient20?: string
  strMeasure1?: string
  strMeasure2?: string
  strMeasure3?: string
  strMeasure4?: string
  strMeasure5?: string
  strMeasure6?: string
  strMeasure7?: string
  strMeasure8?: string
  strMeasure9?: string
  strMeasure10?: string
  strMeasure11?: string
  strMeasure12?: string
  strMeasure13?: string
  strMeasure14?: string
  strMeasure15?: string
  strMeasure16?: string
  strMeasure17?: string
  strMeasure18?: string
  strMeasure19?: string
  strMeasure20?: string
  strSource?: string
  strImageSource?: string
  strCreativeCommonsConfirmed?: string
  dateModified?: string
}

export interface RecipeFilters {
  area?: string
  category?: string
  ingredient?: string
}

/**
 * Fetch all available areas (cuisines)
 */
export async function fetchAreas(): Promise<MealListItem[]> {
  try {
    const response = await fetch(`${API_BASE}/list.php?a=list`)
    const data = await response.json()
    return data.meals || []
  } catch (error) {
    console.error('Error fetching areas:', error)
    throw error
  }
}

/**
 * Fetch all available categories
 */
export async function fetchCategories(): Promise<MealListItem[]> {
  try {
    const response = await fetch(`${API_BASE}/list.php?c=list`)
    const data = await response.json()
    return data.meals || []
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw error
  }
}

/**
 * Fetch all available ingredients
 */
export async function fetchIngredients(): Promise<MealListItem[]> {
  try {
    const response = await fetch(`${API_BASE}/list.php?i=list`)
    const data = await response.json()
    return data.meals || []
  } catch (error) {
    console.error('Error fetching ingredients:', error)
    throw error
  }
}

/**
 * Search recipes by area
 */
export async function searchByArea(area: string): Promise<MealListItem[]> {
  try {
    const response = await fetch(
      `${API_BASE}/filter.php?a=${encodeURIComponent(area)}`
    )
    const data = await response.json()
    return data.meals || []
  } catch (error) {
    console.error('Error searching by area:', error)
    throw error
  }
}

/**
 * Search recipes by category
 */
export async function searchByCategory(
  category: string
): Promise<MealListItem[]> {
  try {
    const response = await fetch(
      `${API_BASE}/filter.php?c=${encodeURIComponent(category)}`
    )
    const data = await response.json()
    return data.meals || []
  } catch (error) {
    console.error('Error searching by category:', error)
    throw error
  }
}

/**
 * Search recipes by ingredient
 */
export async function searchByIngredient(
  ingredient: string
): Promise<MealListItem[]> {
  try {
    const response = await fetch(
      `${API_BASE}/filter.php?i=${encodeURIComponent(ingredient)}`
    )
    const data = await response.json()
    return data.meals || []
  } catch (error) {
    console.error('Error searching by ingredient:', error)
    throw error
  }
}

/**
 * Get full recipe details by ID
 */
export async function getRecipeById(id: string): Promise<Recipe | null> {
  try {
    const response = await fetch(`${API_BASE}/lookup.php?i=${id}`)
    const data = await response.json()
    return data.meals && data.meals.length > 0 ? data.meals[0] : null
  } catch (error) {
    console.error('Error fetching recipe:', error)
    throw error
  }
}

/**
 * Search recipes by name (for dynamic search)
 */
export async function searchRecipesByName(
  searchTerm: string
): Promise<Recipe[]> {
  try {
    const response = await fetch(
      `${API_BASE}/search.php?s=${encodeURIComponent(searchTerm)}`
    )
    const data = await response.json()
    return data.meals || []
  } catch (error) {
    console.error('Error searching recipes:', error)
    throw error
  }
}

/**
 * Get a random recipe
 */
export async function getRandomRecipe(): Promise<Recipe | null> {
  try {
    const response = await fetch(`${API_BASE}/random.php`)
    const data = await response.json()
    return data.meals && data.meals.length > 0 ? data.meals[0] : null
  } catch (error) {
    console.error('Error fetching random recipe:', error)
    throw error
  }
}

/**
 * Get a recipe recommendation based on filters with priority-based logic
 * Priority 1: Recipes matching area AND (category OR ingredient)
 * Priority 2: Recipes matching ONLY category OR ingredient (not area)
 * Priority 3: Recipes matching ONLY area
 * Priority 4: Random recipe
 *
 * @param filters - The filters to apply
 * @param excludeIds - Array of recipe IDs to exclude (already shown recipes)
 */
export async function getRecipeRecommendation(
  filters: RecipeFilters,
  excludeIds: string[] = []
): Promise<Recipe | null> {
  try {
    const excludeSet = new Set(excludeIds)

    // Fetch all recipes for each filter
    let areaRecipes: MealListItem[] = []
    let categoryRecipes: MealListItem[] = []
    let ingredientRecipes: MealListItem[] = []

    if (filters.area) {
      areaRecipes = await searchByArea(filters.area)
    }

    if (filters.category) {
      categoryRecipes = await searchByCategory(filters.category)
    }

    if (filters.ingredient) {
      ingredientRecipes = await searchByIngredient(filters.ingredient)
    }

    // Priority 1: Recipes matching area AND (category OR ingredient)
    if (filters.area && (filters.category || filters.ingredient)) {
      const areaIds = new Set(areaRecipes.map(r => r.idMeal))
      const categoryOrIngredientRecipes = [
        ...categoryRecipes,
        ...ingredientRecipes,
      ]

      const priority1Recipes = categoryOrIngredientRecipes.filter(
        r => r.idMeal && areaIds.has(r.idMeal) && !excludeSet.has(r.idMeal)
      )

      // Remove duplicates
      const uniquePriority1 = Array.from(
        new Map(priority1Recipes.map(r => [r.idMeal, r])).values()
      )

      if (uniquePriority1.length > 0) {
        const randomIndex = Math.floor(Math.random() * uniquePriority1.length)
        const selectedRecipe = uniquePriority1[randomIndex]
        if (selectedRecipe.idMeal) {
          return await getRecipeById(selectedRecipe.idMeal)
        }
      }
    }

    // Priority 2: Recipes matching ONLY category OR ingredient (not area)
    if (filters.category || filters.ingredient) {
      const areaIds = new Set(areaRecipes.map(r => r.idMeal))
      const categoryOrIngredientRecipes = [
        ...categoryRecipes,
        ...ingredientRecipes,
      ]

      const priority2Recipes = categoryOrIngredientRecipes.filter(
        r => r.idMeal && !areaIds.has(r.idMeal) && !excludeSet.has(r.idMeal)
      )

      // Remove duplicates
      const uniquePriority2 = Array.from(
        new Map(priority2Recipes.map(r => [r.idMeal, r])).values()
      )

      if (uniquePriority2.length > 0) {
        const randomIndex = Math.floor(Math.random() * uniquePriority2.length)
        const selectedRecipe = uniquePriority2[randomIndex]
        if (selectedRecipe.idMeal) {
          return await getRecipeById(selectedRecipe.idMeal)
        }
      }
    }

    // Priority 3: Recipes matching ONLY area
    if (filters.area) {
      const priority3Recipes = areaRecipes.filter(
        r => r.idMeal && !excludeSet.has(r.idMeal)
      )

      if (priority3Recipes.length > 0) {
        const randomIndex = Math.floor(Math.random() * priority3Recipes.length)
        const selectedRecipe = priority3Recipes[randomIndex]
        if (selectedRecipe.idMeal) {
          return await getRecipeById(selectedRecipe.idMeal)
        }
      }
    }

    // Priority 4: Random recipe (always as last resort)
    const randomRecipe = await getRandomRecipe()
    return randomRecipe
  } catch (error) {
    console.error('Error getting recommendation:', error)
    throw error
  }
}
