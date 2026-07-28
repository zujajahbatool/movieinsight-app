import { useRef } from 'react';
import SectionHeader from '../SectionHeader/SectionHeader';
import styles from './ScrollRow.module.css';

/**
 * ScrollRow
 *
 * Wraps any horizontally-scrolling section: title + "See More", an
 * optional filter row (genre pills), and a track of children with
 * left/right arrow buttons. It doesn't know what's inside the track —
 * Trends passes MovieCards, a future section could pass anything.
 */
function ScrollRow({ title, onSeeMore, filters, children }) {
  const trackRef = useRef(null);

  const scrollBy = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    const amount = track.clientWidth * 0.8 * direction;
    track.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <section className={styles['scroll-row']}>
      <SectionHeader title={title} onSeeMore={onSeeMore} />

      {filters && <div className={styles['scroll-row__filters']}>{filters}</div>}

      <div className={styles['scroll-row__viewport']}>
        <button
          type="button"
          className={`${styles['scroll-row__arrow']} ${styles['scroll-row__arrow--left']}`}
          onClick={() => scrollBy(-1)}
          aria-label={`Scroll ${title} left`}
        >
          ‹
        </button>

        <div className={styles['scroll-row__track']} ref={trackRef}>
          {children}
        </div>

        <button
          type="button"
          className={`${styles['scroll-row__arrow']} ${styles['scroll-row__arrow--right']}`}
          onClick={() => scrollBy(1)}
          aria-label={`Scroll ${title} right`}
        >
          ›
        </button>
      </div>
    </section>
  );
}

export default ScrollRow;