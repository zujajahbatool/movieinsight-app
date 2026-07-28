import { useEffect, useState } from 'react';
import { tmdb } from '../api/tmdbClient';

/**
 * Fetches titles for a single genre — powers the Movies (and later Series)
 * scroll row once a genre pill is selected. Refetches whenever genreId or
 * mediaType changes.
 */
export function useDiscoverByGenre(genreId, mediaType = 'movie', limit = 12) {
  const [state, setState] = useState({ data: [], loading: true, error: null });

  useEffect(() => {
    if (!genreId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState({ data: [], loading: false, error: null });
      return undefined;
    }

    let cancelled = false;
    setState((prev) => ({ ...prev, loading: true, error: null }));

    async function load() {
      try {
        const json = await tmdb.discoverByGenre(genreId, mediaType);
        if (cancelled) return;

        const results = (json.results || [])
          .filter((item) => item.poster_path)
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
  }, [genreId, mediaType, limit]);

  return state;
}