import { useKidsContent } from '../../../hooks/useKidsContent';
import ScrollRow from '../../common/ScrollRow/ScrollRow';
import MovieCard from '../../common/MovieCard/MovieCard';
import { getPosterUrl } from '../../../api/tmdbClient';
import { useWatchlistStore } from '../../../store/useWatchlistStore';
import { useNavigationStore } from '../../../store/useNavigationStore';
import styles from './KidsSuggestions.module.css';

function KidsSuggestions() {
  const { data: items, loading, error } = useKidsContent('suggestions', 12);
  const watchlist = useWatchlistStore((state) => state.watchlist);
  const toggleMovie = useWatchlistStore((state) => state.toggleMovie);
  const setWatchNow = useNavigationStore((state) => state.setWatchNow);

  const handleSeeMore = () => {
    console.log('Navigate to Kids Suggestions See More');
  };

  return (
    <div className={styles.suggestions}>
      {loading ? (
        <div className={styles.suggestions__status}>Loading suggestions...</div>
      ) : error ? (
        <div className={styles.suggestions__error}>
          Error loading suggestions: {error}
        </div>
      ) : (
        <ScrollRow title="Suggestion" onSeeMore={handleSeeMore}>
          {items.map((item) => (
            <MovieCard
              key={item.id}
              title={item.title || item.name}
              posterUrl={getPosterUrl(item.poster_path)}
              rating={item.vote_average}
              genreIds={item.genre_ids}
              isAdded={watchlist.includes(item.id)}
              onAddToggle={() => toggleMovie(item.id)}
              onClick={() => setWatchNow(item.id, 'movie', true)}
            />
          ))}
        </ScrollRow>
      )}
    </div>
  );
}

export default KidsSuggestions;
