import type { RecipePreference } from './preferenceContext'

/**
 * Convert a Recipe to RecipePreference
 */
export const createRecipePreference = (
  recipe: Record<string, string | undefined> & {
    idMeal: string
    strMeal: string
    strMealThumb?: string
    strCategory?: string
    strArea?: string
  },
  preference: 1 | -1
): RecipePreference => {
  const ingredients: string[] = []
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`]
    if (ingredient && typeof ingredient === 'string' && ingredient.trim()) {
      ingredients.push(ingredient.trim())
    }
  }

  return {
    id: recipe.idMeal,
    title: recipe.strMeal,
    preference,
    timestamp: Date.now(),
    imageUrl: recipe.strMealThumb,
    category: recipe.strCategory,
    area: recipe.strArea,
    ingredients,
  }
}
