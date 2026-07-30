import { useEffect, useState } from 'react';
import { tmdb } from '../api/tmdbClient';

/**
 * Custom hook to fetch kids/animation content from TMDB.
 * Supports different criteria like suggestions (popularity),
 * thebest (highest rated), and mostviewed (popular).
 */
export function useKidsContent(type = 'suggestions', limit = 12) {
  const [state, setState] = useState({ data: [], loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ data: [], loading: true, error: null });


    async function load() {
      try {
        let json;
        if (type === 'thebest') {
          // Fetch highly-rated kids/animation movies
          json = await tmdb.discover('movie', {
            with_genres: '16|10751',
            sort_by: 'vote_average.desc',
            'vote_count.gte': 1000,
            page: 1,
          });
        } else if (type === 'suggestions') {
          // Fetch featured kids/family movies
          json = await tmdb.discover('movie', {
            with_genres: '16|10751|10762',
            sort_by: 'popularity.desc',
            page: 1,
          });
        } else {
          // Most viewed (defaults to popular animation movies)
          json = await tmdb.discover('movie', {
            with_genres: '16|10751|10762',
            sort_by: 'popularity.desc',
            page: 2, // load a different page for variety
          });
        }


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
  }, [type, limit]);

  return state;
}
