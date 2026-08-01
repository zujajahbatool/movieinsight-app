import { useState, useEffect } from 'react';
import AdvanceSearch from '../../common/AdvanceSearch/AdvanceSearch';
import MovieCard from '../../common/MovieCard/MovieCard';
import { tmdb, getPosterUrl } from '../../../api/tmdbClient';
import { useWatchlistStore } from '../../../store/useWatchlistStore';
import { useNavigationStore } from '../../../store/useNavigationStore';
import styles from './MediaPageLayout.module.css';

function MediaPageLayout({ title, mediaType = 'movie' }) {
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

  useEffect(() => {
    let active = true;

    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        let results = [];
        const hasSearchQuery = !!filters.query;

        if (hasSearchQuery) {
          // Search API call
          const response = await tmdb.search(mediaType, filters.query);
          results = response.results || [];

          // Frontend filter by secondary attributes
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
        } else {
          // Discover API call (advanced search filtering)
          const params = {};
          if (filters.year) {
            if (mediaType === 'movie') {
              params.primary_release_year = filters.year;
            } else {
              params.first_air_date_year = filters.year;
            }
          }
          if (filters.country) {
            params.with_origin_country = filters.country;
          }
          if (filters.actor) {
            params.with_cast = filters.actor;
          }
          if (filters.director) {
            params.with_crew = filters.director;
          }
          if (filters.genre) {
            params.with_genres = filters.genre;
          }

          const response = await tmdb.discover(mediaType, params);
          results = response.results || [];
        }

        if (active) {
          // Filter out items without posters
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
        <h1 className={styles.title}>{title}</h1>

        <AdvanceSearch mediaType={mediaType} onSearch={setFilters} />

        {loading ? (
          <div className={styles.status}>Loading {title.toLowerCase()}...</div>
        ) : error ? (
          <div className={styles.error}>Error: {error}</div>
        ) : items.length === 0 ? (
          <div className={styles.status}>
            No {title.toLowerCase()} found matching the search criteria.
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

export default MediaPageLayout;
