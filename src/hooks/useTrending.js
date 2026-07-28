import { useEffect, useState } from 'react';
import { tmdb } from '../api/tmdbClient';

/**
 * Fetches today's trending movies/series for the hero banner + poster rail.
 * Only keeps items that actually have a backdrop (needed for the banner)
 * and a poster (needed for the poster carousel).
 */
export function useTrending(limit = 4) {
  const [state, setState] = useState({ data: [], loading: true, error: null });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const json = await tmdb.trendingAll('day');
        if (cancelled) return;

        const results = (json.results || [])
          .filter((item) => item.backdrop_path && item.poster_path)
          .slice(0, limit);

        setState({ data: results, loading: false, error: null });
      } catch (err) {
        if (cancelled) return;
        setState({ data: [], loading: false, error: err.message });
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [limit]);

  return state;
}
