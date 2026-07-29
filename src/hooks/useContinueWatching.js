/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { tmdb } from '../api/tmdbClient';

const MOCK_FALLBACKS = [
  {
    id: 940721,
    title: 'Godzilla Minus One',
    backdrop_path: '/hkxxMIGaiC6v64oIMoIB074t0qq.jpg',
    progress: 65,
  },
  {
    id: 1011985,
    title: 'Kung Fu Panda 4',
    backdrop_path: '/kDp1vUBUP5wbWKQQa9jTEz5rR2F.jpg',
    progress: 42,
  },
  {
    id: 466420,
    title: 'Killers of the Flower Moon',
    backdrop_path: '/r291gL7qqIOCB51Z7YVnW7ZdEvT.jpg',
    progress: 88,
  },
  {
    id: 693134,
    title: 'Dune: Part Two',
    backdrop_path: '/xOMo8BRK7PQt6vRA4hV6o0nbvTL.jpg',
    progress: 15,
  },
  {
    id: 872585,
    title: 'Oppenheimer',
    backdrop_path: '/nbj0vJUE5V3w7v5wL25iR467zcu.jpg',
    progress: 50,
  },
  {
    id: 76600,
    title: 'Avatar: The Way of Water',
    backdrop_path: '/8rpD7w2FeqvN6glkg2g8v26R2K1.jpg',
    progress: 75,
  },
];

export function useContinueWatching() {
  const [state, setState] = useState({ data: [], loading: true, error: null });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const items = [
          { id: 940721, progress: 65 }, // Godzilla Minus One
          { id: 1011985, progress: 42 }, // Kung Fu Panda 4
          { id: 466420, progress: 88 }, // Killers of the Flower Moon
          { id: 693134, progress: 15 }, // Dune: Part Two
          { id: 872585, progress: 50 }, // Oppenheimer
          { id: 76600, progress: 75 },  // Avatar: The Way of Water
        ];

        const promises = items.map(async (item) => {
          try {
            const details = await tmdb.movieDetails(item.id);
            return {
              id: details.id,
              title: details.title || details.name,
              backdrop_path: details.backdrop_path,
              progress: item.progress,
            };
          } catch (err) {
            console.warn(`TMDB fetch failed for movie ID ${item.id}, using fallback details:`, err);
            const fallback = MOCK_FALLBACKS.find((f) => f.id === item.id);
            return fallback || {
              id: item.id,
              title: `Movie ${item.id}`,
              backdrop_path: null,
              progress: item.progress,
            };
          }
        });

        const results = await Promise.all(promises);
        if (cancelled) return;
        setState({ data: results, loading: false, error: null });
      } catch (err) {
        if (cancelled) return;
        setState({ data: MOCK_FALLBACKS, loading: false, error: null });
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
