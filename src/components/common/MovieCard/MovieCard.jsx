import styles from './MovieCard.module.css';

/**
 * MovieCard
 *
 * Reused across Trends, Movies, Series, Collection, and (with the
 * `progress` prop) Continue Watching. Keep TMDB-shaped data in, keep
 * markup dumb — this component doesn't know or care where `posterUrl`
 * came from.
 *
 * @param {string} title
 * @param {string} posterUrl        - placeholder for now, real TMDB image path later
 * @param {number} [rating]         - 0-10, TMDB style. Omit to hide the badge.
 * @param {number} [progress]       - 0-100. Only passed by Continue Watching.
 * @param {boolean} [isAdded]       - whether this title is already in the user's list
 * @param {() => void} [onAddToggle]
 */
function MovieCard({
  title,
  posterUrl,
  rating,
  progress,
  isAdded = false,
  onAddToggle,
}) {
  return (
    <div className={styles['movie-card']}>
      <div className={styles['movie-card__poster-wrap']}>
        <img
          className={styles['movie-card__poster']}
          src={posterUrl}
          alt={title}
          loading="lazy"
        />

        <button
          type="button"
          className={`${styles['movie-card__add-btn']} ${
            isAdded ? styles['movie-card__add-btn--active'] : ''
          }`}
          onClick={onAddToggle}
          aria-label={isAdded ? `Remove ${title} from list` : `Add ${title} to list`}
        >
          {isAdded ? '✓' : '+'}
        </button>

        {typeof progress === 'number' && (
          <div className={styles['movie-card__progress-track']}>
            <div
              className={styles['movie-card__progress-fill']}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      <div className={styles['movie-card__meta']}>
        <p className={styles['movie-card__title']}>{title}</p>
        {typeof rating === 'number' && (
          <span className={styles['movie-card__rating']}>★ {rating.toFixed(1)}</span>
        )}
      </div>
    </div>
  );
}

export default MovieCard;