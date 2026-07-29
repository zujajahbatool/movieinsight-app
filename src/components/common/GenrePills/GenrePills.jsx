import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../Button/Button';
import styles from './GenrePills.module.css';

/**
 * GenrePills
 *
 * Single-select row of pill filters with left/right scroll chevrons,
 * reused wherever genre filtering shows up (Movies now, Series later).
 * Doesn't know or care what "genres" represent beyond {id, label}.
 *
 * @param {{id: string|number, label: string}[]} genres
 * @param {string|number} activeGenre
 * @param {(id: string|number) => void} onSelect
 */
function GenrePills({ genres, activeGenre, onSelect }) {
  const trackRef = useRef(null);

  const scrollBy = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: track.clientWidth * 0.6 * direction, behavior: 'smooth' });
  };

  return (
    <div className={styles['genre-pills']}>
      <button
        type="button"
        className={styles['genre-pills__arrow']}
        onClick={() => scrollBy(-1)}
        aria-label="Scroll genres left"
      >
        <ChevronLeft size={16} strokeWidth={2.5} />
      </button>

      <div className={styles['genre-pills__track']} ref={trackRef}>
        {genres.map((genre) => {
          const isSelected = genre.id === activeGenre;
          return (
            <Button
              key={genre.id}
              variant="pill"
              isSelected={isSelected}
              aria-pressed={isSelected}
              onClick={() => onSelect(genre.id)}
            >
              {genre.label}
            </Button>
          );
        })}
      </div>

      <button
        type="button"
        className={styles['genre-pills__arrow']}
        onClick={() => scrollBy(1)}
        aria-label="Scroll genres right"
      >
        <ChevronRight size={16} strokeWidth={2.5} />
      </button>
    </div>
  );
}

export default GenrePills;