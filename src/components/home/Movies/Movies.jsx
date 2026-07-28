import { useState } from 'react';
import { useDiscoverByGenre } from '../../../hooks/useDiscoverByGenre';
import ScrollRow from '../../common/ScrollRow/ScrollRow';
import MovieCard from '../../common/MovieCard/MovieCard';
import GenrePills from '../../common/GenrePills/GenrePills';
import { getPosterUrl } from '../../../api/tmdbClient';
import { useWatchlistStore } from '../../../store/useWatchlistStore';
import styles from './Movies.module.css';

const GENRES = [
  { id: 18, label: 'Drama' },
  { id: 28, label: 'Action' },
  { id: 12, label: 'Adventure' },
  { id: 10749, label: 'Romance' },
  { id: 14, label: 'Fantasy' },
  { id: 35, label: 'Comedy' },
  { id: 16, label: 'Animation' },
  { id: 53, label: 'Thriller' },
  { id: 9648, label: 'Mystery' },
  { id: 36, label: 'History' },
  { id: 27, label: 'Horror' },
];

function Movies() {
  const [activeGenre, setActiveGenre] = useState(18); // Default to Drama (18)
  const { data: items, loading, error } = useDiscoverByGenre(activeGenre, 'movie', 12);
  const watchlist = useWatchlistStore((state) => state.watchlist);
  const toggleMovie = useWatchlistStore((state) => state.toggleMovie);

  const handleSeeMore = () => {
    // Will be wired up to react-router-dom later
    console.log('Navigate to Movies See More for genre:', activeGenre);
  };

  return (
    <div id="movies" className={styles.movies}>
      <ScrollRow
        title="Movies"
        onSeeMore={handleSeeMore}
        filters={
          <GenrePills
            genres={GENRES}
            activeGenre={activeGenre}
            onSelect={setActiveGenre}
          />
        }
      >
        {loading ? (
          <div className={styles.movies__status}>Loading movies...</div>
        ) : error ? (
          <div className={styles.movies__error}>Error loading movies: {error}</div>
        ) : (
          items.map((item) => (
            <MovieCard
              key={item.id}
              title={item.title || item.name}
              posterUrl={getPosterUrl(item.poster_path)}
              rating={item.vote_average}
              isAdded={watchlist.includes(item.id)}
              onAddToggle={() => toggleMovie(item.id)}
            />
          ))
        )}
      </ScrollRow>
    </div>
  );
}

export default Movies;
