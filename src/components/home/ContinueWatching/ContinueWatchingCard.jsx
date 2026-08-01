import { Play } from 'lucide-react';
import { getBackdropUrl } from '../../../api/tmdbClient';
import styles from './ContinueWatchingCard.module.css';

function ContinueWatchingCard({ title, backdropPath, progress, onClick }) {
  // Use w780 size for backdrops on cards
  const backdropUrl = getBackdropUrl(backdropPath, 'w780');

  return (
    <div className={styles['cw-card']} onClick={onClick}>
      {backdropUrl ? (
        <img
          className={styles['cw-card__backdrop']}
          src={backdropUrl}
          alt={title}
          loading="lazy"
        />
      ) : (
        <div className={styles['cw-card__placeholder']}>
          <span className={styles['cw-card__placeholder-text']}>{title}</span>
        </div>
      )}

      {/* Card Content Overlay */}
      <div className={styles['cw-card__overlay']}>
        {/* Centered Play Button */}
        <button
          type="button"
          className={styles['cw-card__play-btn']}
          aria-label={`Play ${title}`}
        >
          <Play className={styles['cw-card__play-icon']} fill="currentColor" strokeWidth={0} />
        </button>

        {/* Title at the bottom left */}
        <h3 className={styles['cw-card__title']}>{title}</h3>

        {/* Progress Line just above the bottom */}
        <div className={styles['cw-card__progress-container']}>
          <div
            className={styles['cw-card__progress-bar']}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default ContinueWatchingCard;
