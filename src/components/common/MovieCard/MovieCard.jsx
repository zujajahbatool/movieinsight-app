import { useId, useState, useEffect } from 'react';
import { Plus, Check } from 'lucide-react';
import styles from './MovieCard.module.css';

/**
 * MovieCard
 *
 * Reused across Trends, Movies, Series, Collection, and (with the
 * `progress` prop) Continue Watching. Matches Figma design using
 * SVG clip-path corner notch.
 *
 * @param {string} title
 * @param {string} posterUrl
 * @param {number} [rating]         - 0-10, TMDB style.
 * @param {number} [progress]       - 0-100. Passed by Continue Watching.
 * @param {boolean} [isAdded]       - whether this title is already in the user's list
 * @param {() => void} [onAddToggle]
 */
const TMDB_GENRES = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
  // TV specific
  10759: 'Action & Adventure',
  10762: 'Kids',
  10763: 'News',
  10764: 'Reality',
  10765: 'Sci-Fi & Fantasy',
  10766: 'Soap',
  10767: 'Talk',
  10768: 'War & Politics',
};

/**
 * MovieCard
 *
 * Reused across Trends, Movies, Series, Collection, and (with the
 * `progress` prop) Continue Watching. Matches Figma design using
 * SVG clip-path corner notch.
 *
 * @param {string} title
 * @param {string} posterUrl
 * @param {number} [rating]         - 0-10, TMDB style.
 * @param {number[]} [genreIds]     - array of TMDB genre IDs.
 * @param {string} [genre]          - explicit genre string override.
 * @param {number} [progress]       - 0-100. Passed by Continue Watching.
 * @param {boolean} [isAdded]       - whether this title is already in the user's list
 * @param {() => void} [onAddToggle]
 */
function MovieCard({
  title,
  posterUrl,
  rating,
  genreIds,
  genre,
  progress,
  isAdded = false,
  onAddToggle,
  variant,
}) {
  const maskId = useId().replace(/:/g, '');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const isSimple = variant === 'simple';

  const cardW = isMobile ? 112 : 208;
  const cardH = isMobile ? 160 : 296;
  const outerR = isMobile ? 8 : 16;
  const btnR = isMobile ? 6 : 12;
  const innerR = isMobile ? 6 : 12;
  const btnS = isMobile ? 24 : 56;
  const gap = isMobile ? 4 : 8;
  const cutout = btnS + gap;

  // Resolve primary genre string
  const displayGenre = genre || (genreIds && genreIds.length > 0 ? (TMDB_GENRES[genreIds[0]] || '') : '');

  // Render 5-star rating system based on TMDB rating (out of 10)
  const renderStars = (voteAverage) => {
    const filledStarsCount = Math.round(voteAverage / 2);
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={[
            styles['movie-card__star'],
            i <= filledStarsCount ? styles['movie-card__star--filled'] : '',
          ].join(' ')}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className={styles['movie-card']}>
      {/* SVG ClipPath Mask Definition */}
      {!isSimple && (
        <svg width="0" height="0" style={{ position: 'absolute', width: 0, height: 0 }}>
          <defs>
            <clipPath id={maskId} clipPathUnits="userSpaceOnUse">
              {/* 1. THE ISLAND */}
              <path d={`
                M ${outerR},0 
                H ${btnS - btnR} 
                A ${btnR} ${btnR} 0 0 1 ${btnS} ${btnR} 
                V ${btnS - btnR} 
                A ${btnR} ${btnR} 0 0 1 ${btnS - btnR} ${btnS} 
                H ${btnR} 
                A ${btnR} ${btnR} 0 0 1 0 ${btnS - btnR} 
                V ${outerR} 
                A ${outerR} ${outerR} 0 0 1 ${outerR} 0 
                Z
              `} />
              {/* 2. MAIN POSTER BODY */}
              <path d={`
                M ${cutout + innerR}, 0 
                H ${cardW - outerR} 
                A ${outerR} ${outerR} 0 0 1 ${cardW} ${outerR} 
                V ${cardH - outerR} 
                A ${outerR} ${outerR} 0 0 1 ${cardW - outerR} ${cardH} 
                H ${outerR} 
                A ${outerR} ${outerR} 0 0 1 0 ${cardH - outerR} 
                V ${cutout + innerR} 
                A ${innerR} ${innerR} 0 0 1 ${innerR} ${cutout} 
                H ${cutout - innerR} 
                A ${innerR} ${innerR} 0 0 0 ${cutout} ${cutout - innerR} 
                V ${innerR} 
                A ${innerR} ${innerR} 0 0 1 ${cutout + innerR} 0 
                Z
              `} />
            </clipPath>
          </defs>
        </svg>
      )}

      {/* Main Masked Container */}
      <div
        className={[
          styles['movie-card__poster-wrap'],
          isSimple ? styles['movie-card__poster-wrap--simple'] : '',
        ].join(' ')}
        style={isSimple ? {} : { clipPath: `url(#${maskId})` }}
      >
        {posterUrl ? (
          <img
            className={styles['movie-card__poster']}
            src={posterUrl}
            alt={title}
            loading="lazy"
          />
        ) : (
          <div className={styles['movie-card__placeholder']}>
            <span className={styles['movie-card__placeholder-text']}>
              {title}
            </span>
          </div>
        )}

        {/* Hover info overlay */}
        <div className={styles['movie-card__overlay']}>
          <div className={styles['movie-card__info']}>
            <h4 className={styles['movie-card__title']}>{title}</h4>
            {displayGenre && (
              <span className={styles['movie-card__genre']}>{displayGenre}</span>
            )}
            {typeof rating === 'number' && rating > 0 && (
              <div className={styles['movie-card__stars']} title={`Rating: ${rating}/10`}>
                {renderStars(rating)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Glassmorphic Add Button */}
      {!isSimple && (
        <button
          type="button"
          className={[
            styles['movie-card__add-btn'],
            isAdded ? styles['movie-card__add-btn--active'] : '',
          ].join(' ')}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAddToggle?.();
          }}
          aria-label={isAdded ? `Remove ${title} from list` : `Add ${title} to list`}
        >
          {isAdded ? (
            <Check size={isMobile ? 12 : 28} strokeWidth={3} />
          ) : (
            <Plus size={isMobile ? 12 : 28} strokeWidth={3} />
          )}
        </button>
      )}

      {/* Progress bar overlay (e.g. for Continue Watching) */}
      {typeof progress === 'number' && (
        <div className={styles['movie-card__progress-track']}>
          <div
            className={styles['movie-card__progress-fill']}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

export default MovieCard;