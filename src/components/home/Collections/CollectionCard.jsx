import { useState, useEffect } from 'react';
import { getPosterUrl } from '../../../api/tmdbClient';
import styles from './CollectionCard.module.css';

function CollectionCard({ title, items }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 3);
    }, 2000); // Cycle every 2 seconds

    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <div
      className={styles['collection-card']}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setActiveIndex(0);
      }}
    >
      <div className={styles['collection-card__stack']}>
        {items.map((item, i) => {
          // Calculate stack position relative to active index
          // diff: 0 = top, 1 = middle, 2 = back
          const diff = (i - activeIndex + 3) % 3;

          const cardStyleClass =
            diff === 0
              ? styles['collection-card__item--top']
              : diff === 1
              ? styles['collection-card__item--middle']
              : styles['collection-card__item--back'];

          return (
            <div
              key={item.id}
              className={`${styles['collection-card__item']} ${cardStyleClass}`}
            >

              {item.poster_path ? (
                <img
                  className={styles['collection-card__poster']}
                  src={getPosterUrl(item.poster_path)}
                  alt={item.title || item.name}
                  loading="lazy"
                />
              ) : (
                <div className={styles['collection-card__placeholder']}>
                  <span>{item.title || item.name}</span>
                </div>
              )}
              {/* Soft dark overlay for text contrast */}
              <div className={styles['collection-card__poster-overlay']} />
            </div>
          );
        })}
      </div>

      {/* Stable, centered collection title */}
      <div className={styles['collection-card__title-container']}>
        <h3 className={styles['collection-card__title']}>{title}</h3>
      </div>
    </div>
  );
}

export default CollectionCard;
