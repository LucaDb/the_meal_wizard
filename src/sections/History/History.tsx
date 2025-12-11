import type { RecipePreference } from '@context/preferenceContext'
import { formatTimestamp } from '@utils/utils'
import { usePreferences } from '../../context'
import styles from './History.module.scss'

const HistoryItem = ({ preference }: { preference: RecipePreference }) => {
  return (
    <div
      key={preference.id}
      className={`${styles.history__item} ${
        preference.preference === 1
          ? styles['history__item--liked']
          : styles['history__item--disliked']
      }`}
    >
      {preference.imageUrl && (
        <div className={styles.history__image}>
          <img src={`${preference.imageUrl}/medium`} alt={preference.title} />
        </div>
      )}
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

export function History() {
  const { preferences } = usePreferences()
  if (preferences.length === 0) {
    return (
      <div className={styles.history}>
        <h2 className={styles.history__title}>History</h2>
        <p className={styles.history__empty}>
          No preferences saved yet.
          <br />
          Start liking or disliking recipes to build your history!
        </p>
      </div>
    )
  }

  return (
    <div className={styles.history}>
      <h2 className={styles.history__title}>History</h2>
      <div className={styles.history__list}>
        {preferences.map(preference => (
          <HistoryItem key={preference.id} preference={preference} />
        ))}
      </div>
    </div>
  )
}
