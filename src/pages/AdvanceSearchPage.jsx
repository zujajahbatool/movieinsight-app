import { useState, useEffect } from 'react';
import AdvanceSearch from '../components/common/AdvanceSearch/AdvanceSearch';
import MovieCard from '../components/common/MovieCard/MovieCard';
import Button from '../components/common/Button/Button';
import { tmdb, getPosterUrl } from '../api/tmdbClient';
import { useWatchlistStore } from '../store/useWatchlistStore';
import { useNavigationStore } from '../store/useNavigationStore';
import styles from './AdvanceSearchPage.module.css';

function AdvanceSearchPage() {
  const [isMoviesActive, setIsMoviesActive] = useState(true);
  const [filters, setFilters] = useState({
    year: '',
    country: '',
    actor: '',
    director: '',
    query: '',
    genre: '',
  });

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const watchlist = useWatchlistStore((state) => state.watchlist);
  const toggleMovie = useWatchlistStore((state) => state.toggleMovie);
  const setWatchNow = useNavigationStore((state) => state.setWatchNow);

  const mediaType = isMoviesActive ? 'movie' : 'tv';

  useEffect(() => {
    let active = true;

    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const response = await (filters.query
          ? tmdb.search(mediaType, filters.query)
          : tmdb.discover(mediaType, {
              ...(filters.year && {
                [mediaType === 'movie' ? 'primary_release_year' : 'first_air_date_year']: filters.year,
              }),
              ...(filters.country && { with_origin_country: filters.country }),
              ...(filters.actor && { with_cast: filters.actor }),
              ...(filters.director && { with_crew: filters.director }),
              ...(filters.genre && { with_genres: filters.genre }),
            }));

        let results = response.results || [];

        if (filters.query) {
          if (filters.genre) {
            results = results.filter((item) =>
              item.genre_ids?.includes(Number(filters.genre))
            );
          }
          if (filters.year) {
            results = results.filter((item) => {
              const dateStr = item.release_date || item.first_air_date || '';
              return dateStr.startsWith(filters.year);
            });
          }
          if (filters.country) {
            results = results.filter((item) =>
              item.origin_country?.includes(filters.country)
            );
          }
        }

        if (active) {
          setItems(results.filter((item) => item.poster_path));
          setLoading(false);
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Failed to fetch items');
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, [filters, mediaType]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header container with title and Movies/Series Toggle */}
        <div className={styles.header}>
          <h1 className={styles.title}>Advance Search</h1>
          <Button.Toggle
            leftLabel="Series"
            rightLabel="Movies"
            isRightActive={isMoviesActive}
            onChange={(val) => setIsMoviesActive(val)}
            className={styles.toggle}
          />
        </div>

        <AdvanceSearch mediaType={mediaType} onSearch={setFilters} />

        {loading ? (
          <div className={styles.status}>Loading results...</div>
        ) : error ? (
          <div className={styles.error}>Error: {error}</div>
        ) : items.length === 0 ? (
          <div className={styles.status}>
            No titles found matching the search criteria.
          </div>
        ) : (
          <div className={styles.grid}>
            {items.map((item) => (
              <MovieCard
                key={item.id}
                title={item.title || item.name}
                posterUrl={getPosterUrl(item.poster_path)}
                rating={item.vote_average}
                genreIds={item.genre_ids}
                isAdded={watchlist.includes(item.id)}
                onAddToggle={() => toggleMovie(item.id)}
                onClick={() => setWatchNow(item.id, mediaType, false)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdvanceSearchPage;
