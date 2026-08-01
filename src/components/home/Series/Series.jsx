import { useState } from 'react';
import { useDiscoverByGenre } from '../../../hooks/useDiscoverByGenre';
import ScrollRow from '../../common/ScrollRow/ScrollRow';
import MovieCard from '../../common/MovieCard/MovieCard';
import GenrePills from '../../common/GenrePills/GenrePills';
import { getPosterUrl } from '../../../api/tmdbClient';
import { useWatchlistStore } from '../../../store/useWatchlistStore';
import { useNavigationStore } from '../../../store/useNavigationStore';
import styles from './Series.module.css';

const SERIES_GENRES = [
  { id: 16, label: 'Animation' },
  { id: 35, label: 'Comedy' },
  { id: 18, label: 'Drama' },
  { id: 10759, label: 'Action & Adventure' },
  { id: 10765, label: 'Sci-Fi & Fantasy' },
  { id: 80, label: 'Crime' },
  { id: 9648, label: 'Mystery' },
  { id: 10751, label: 'Family' },
  { id: 10762, label: 'Kids' },
  { id: 99, label: 'Documentary' },
];

function Series() {
  const [activeGenre, setActiveGenre] = useState(16); // Default to Animation (16)
  const { data: items, loading, error } = useDiscoverByGenre(activeGenre, 'tv', 12);
  const watchlist = useWatchlistStore((state) => state.watchlist);
  const toggleMovie = useWatchlistStore((state) => state.toggleMovie);
  const setPage = useNavigationStore((state) => state.setPage);
  const setWatchNow = useNavigationStore((state) => state.setWatchNow);

  const handleSeeMore = () => {
    setPage('series');
  };

  return (
    <div id="series" className={styles.series}>
      <ScrollRow
        title="Series"
        onSeeMore={handleSeeMore}
        filters={
          <GenrePills
            genres={SERIES_GENRES}
            activeGenre={activeGenre}
            onSelect={setActiveGenre}
          />
        }
      >
        {loading ? (
          <div className={styles.series__status}>Loading series...</div>
        ) : error ? (
          <div className={styles.series__error}>Error loading series: {error}</div>
        ) : (
          items.map((item) => (
            <MovieCard
              key={item.id}
              title={item.name || item.title}
              posterUrl={getPosterUrl(item.poster_path)}
              rating={item.vote_average}
              genreIds={item.genre_ids}
              isAdded={watchlist.includes(item.id)}
              onAddToggle={() => toggleMovie(item.id)}
              onClick={() => setWatchNow(item.id, 'tv', false)}
            />
          ))
        )}
      </ScrollRow>
    </div>
  );
}

export default Series;
