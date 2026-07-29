import { useEffect, useState } from 'react';
import { tmdb } from '../api/tmdbClient';

const MOCK_ACTORS = [
  { id: 117642, name: 'Jason Momoa', profile_path: '/6ttdgQI0hU6n3IQ3ZpaS8g74Z6H.jpg' },
  { id: 18918, name: 'Dwayne Johnson', profile_path: '/cgKZ6aOIwR1C172153L3gX9999a.jpg' },
  { id: 10990, name: 'Emma Watson', profile_path: '/7byABYxvd5j2wb7LL1KYj79a6eb.jpg' },
  { id: 1136406, name: 'Tom Holland', profile_path: '/bNz4w59y7pM0hP0eD73Lg3y5S2w.jpg' },
  { id: 224513, name: 'Ana de Armas', profile_path: '/14uxtk7n9Oc8biuLIav2aA9bLpM.jpg' },
  { id: 6384, name: 'Keanu Reeves', profile_path: '/4U01g4751p9P6h3Z54J4jNu4cE.jpg' },
  { id: 1813, name: 'Anne Hathaway', profile_path: '/6tbSJyC4f0v3I1C52qYtZg74Z6H.jpg' },
  { id: 505710, name: 'Zendaya', profile_path: '/7U8G1kFo29iIv2siC4Z7qj2F.jpg' },
];

const MOCK_DIRECTORS = [
  { id: 525, name: 'Christopher Nolan', profile_path: '/xuAIu3RhO7t5jpmciv4d9IhOaA5.jpg' },
  { id: 488, name: 'Steven Spielberg', profile_path: '/5zCh34nO0Pz4Vw0xfi5V11CgDrq.jpg' },
  { id: 138, name: 'Quentin Tarantino', profile_path: '/99u7rIPj7mlF1XqpocYEvp4LMJZ.jpg' },
  { id: 1032, name: 'Martin Scorsese', profile_path: '/9hZ262RztA1ilCfuf2w6v9eMIYs.jpg' },
  { id: 2710, name: 'James Cameron', profile_path: '/lhz2YC87WvRP449ISKYgQzwbN04.jpg' },
  { id: 137427, name: 'Denis Villeneuve', profile_path: '/34nO0Pz4Vw0xfi5V11CgDrq2j4n.jpg' },
  { id: 95345, name: 'Greta Gerwig', profile_path: '/ztkUQVk6e932GOhmA753a2D56ns.jpg' },
];

export function useCharacters(type = 'actors') {
  const [state, setState] = useState({ data: [], loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ data: [], loading: true, error: null });

    const activeList = type === 'actors' ? MOCK_ACTORS : MOCK_DIRECTORS;

    async function load() {
      try {
        const promises = activeList.map(async (person) => {
          try {
            const details = await tmdb.personDetails(person.id);
            return {
              id: details.id,
              name: details.name,
              profile_path: details.profile_path,
            };
          } catch (err) {
            console.warn(`TMDB personDetails failed for ID ${person.id}, using fallback:`, err);
            return person;
          }
        });

        const results = await Promise.all(promises);
        if (cancelled) return;
        setState({ data: results, loading: false, error: null });
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        if (cancelled) return;
        setState({ data: activeList, loading: false, error: null });
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [type]);

  return state;
}
