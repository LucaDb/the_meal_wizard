import type { RecipePreference } from '@context/preferenceContext'
import { formatTimestamp } from '@utils/utils'
import styles from './History.module.scss'

export function HistoryItem({ preference }: { preference: RecipePreference }) {
  return (
    <div className={styles.history__item}>
      <div className={styles.history__content}>
        <h3 className={styles.history__recipeTitle}>{preference.title}</h3>
        <div className={styles.history__meta}>
          {preference.category && (
            <span className={styles.history__badge}>{preference.category}</span>
          )}
          {preference.area && (
            <span className={styles.history__badge}>{preference.area}</span>
          )}
        </div>
        {preference.ingredients && preference.ingredients.length > 0 && (
          <div className={styles.history__ingredients}>
            <span className={styles.history__ingredientsLabel}>
              Ingredients:
            </span>
            <span className={styles.history__ingredientsList}>
              {preference.ingredients.join(', ')}
            </span>
          </div>
        )}
        <div className={styles.history__footer}>
          <span className={styles.history__preference}>
            {preference.preference === 1 ? '👍 Liked' : '👎 Disliked'}
          </span>
          <span className={styles.history__timestamp}>
            {formatTimestamp(preference.timestamp)}
          </span>
        </div>
      </div>
    </div>
  )
}
