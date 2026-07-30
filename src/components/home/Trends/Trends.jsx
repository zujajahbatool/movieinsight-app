import { useTrending } from '../../../hooks/useTrending';
import ScrollRow from '../../common/ScrollRow/ScrollRow';
import MovieCard from '../../common/MovieCard/MovieCard';
import { getPosterUrl } from '../../../api/tmdbClient';
import { useWatchlistStore } from '../../../store/useWatchlistStore';
import styles from './Trends.module.css';

function Trends() {
  const { data: items, loading, error } = useTrending(12);
  const watchlist = useWatchlistStore((state) => state.watchlist);
  const toggleMovie = useWatchlistStore((state) => state.toggleMovie);

  const handleSeeMore = () => {
    // Will be wired up to react-router-dom later
    console.log('Navigate to Trends See More');
  };

  return (
    <div id="trends" className={styles.trends}>
      {loading ? (
        <div className={styles.trends__status}>Loading trends...</div>
      ) : error ? (
        <div className={styles.trends__error}>Error loading trends: {error}</div>
      ) : (
        <ScrollRow title="Trends" onSeeMore={handleSeeMore}>
          {items.map((item) => (
            <MovieCard
              key={item.id}
              title={item.title || item.name}
              posterUrl={getPosterUrl(item.poster_path)}
              rating={item.vote_average}
              genreIds={item.genre_ids}
              isAdded={watchlist.includes(item.id)}
              onAddToggle={() => toggleMovie(item.id)}
            />
          ))}
        </ScrollRow>
      )}
    </div>
  );
}

export default Trends;
