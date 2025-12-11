import type { Recipe } from '@api/api'
import { Button } from '@components/Button/Button'
import type { RecipePreference } from '@context/preferenceContext'
import styles from './Card.module.scss'

export function Card({
  recipe,
  ingredientName,
  currentRecipePreference,
  onSaveRecipePreference,
}: {
  recipe: Recipe
  ingredientName: string | null
  onSaveRecipePreference: (recipe: Recipe, preference: 1 | -1) => void
  currentRecipePreference: RecipePreference | undefined
}) {
  return (
    <div className={styles.card}>
      {recipe.strYoutube || recipe.strSource ? (
        <a
          href={recipe.strYoutube || recipe.strSource}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.card__imageLink}
        >
          <div className={styles.card__image}>
            <img
              src={`${recipe.strMealThumb}/medium`}
              srcSet={`${recipe.strMealThumb}/medium 350w, ${recipe.strMealThumb}/large 500w`}
              sizes="(max-width: 600px) 150px, (max-width: 1024px) 350px, 500px"
              alt={recipe.strMeal}
            />
          </div>
        </a>
      ) : (
        <div className={styles.card__image}>
          <img src={recipe.strMealThumb} alt={recipe.strMeal} />
        </div>
      )}
      <h3 className={styles.card__title}>{recipe.strMeal}</h3>
      <div className={styles.card__meta}>
        <span>{recipe.strCategory}</span>
        <span>{recipe.strArea}</span>
        {ingredientName && <span>{ingredientName}</span>}
      </div>

      {recipe.strYoutube ? (
        <a
          href={recipe.strYoutube}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.card__link}
        >
          Watch on YouTube
        </a>
      ) : recipe.strSource ? (
        <a
          href={recipe.strSource}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.card__link}
        >
          View Recipe
        </a>
      ) : null}

      <div className={styles.card__preference}>
        <h4 className={styles.card__preferenceTitle}>
          Did it match your preference?
        </h4>
        <div className={styles.card__preferenceButtons}>
          <Button
            variant={
              currentRecipePreference?.preference === 1
                ? 'primary'
                : 'secondary'
            }
            onClick={() => onSaveRecipePreference(recipe, 1)}
            className={styles.card__preferenceButton}
          >
            {currentRecipePreference?.preference === 1 ? '👍 Liked' : '👍 Like'}
          </Button>
          <Button
            variant={
              currentRecipePreference?.preference === -1
                ? 'primary'
                : 'secondary'
            }
            onClick={() => onSaveRecipePreference(recipe, -1)}
            className={styles.card__preferenceButton}
          >
            {currentRecipePreference?.preference === -1
              ? '👎 Disliked'
              : '👎 Dislike'}
          </Button>
        </div>
      </div>
    </div>
  )
}
