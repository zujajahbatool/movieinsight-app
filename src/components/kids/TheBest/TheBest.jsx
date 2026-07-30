import { useKidsContent } from '../../../hooks/useKidsContent';
import ScrollRow from '../../common/ScrollRow/ScrollRow';
import MovieCard from '../../common/MovieCard/MovieCard';
import { getPosterUrl } from '../../../api/tmdbClient';
import styles from './TheBest.module.css';

function TheBest() {
  const { data: items, loading, error } = useKidsContent('thebest', 12);

  const handleSeeMore = () => {
    console.log('Navigate to The Best See More');
  };

  return (
    <div className={styles.thebest}>
      {loading ? (
        <div className={styles.thebest__status}>Loading classics...</div>
      ) : error ? (
        <div className={styles.thebest__error}>Error loading classics: {error}</div>
      ) : (
        <ScrollRow title="The Best" onSeeMore={handleSeeMore}>
          {items.map((item) => (
            <MovieCard
              key={item.id}
              title={item.title || item.name}
              posterUrl={getPosterUrl(item.poster_path)}
              rating={item.vote_average}
              genreIds={item.genre_ids}
              variant="simple"
            />
          ))}
        </ScrollRow>
      )}
    </div>
  );
}

export default TheBest;
