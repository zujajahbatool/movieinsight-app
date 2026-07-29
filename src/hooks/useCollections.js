import { useEffect, useState } from 'react';
import { tmdb } from '../api/tmdbClient';

const MOCK_FALLBACKS = {
  movie: [
    {
      id: 'musicals',
      title: 'Musicals',
      items: [
        { id: 1, title: 'La La Land', poster_path: '/uDO8zWDhfNsNJeStJoi76ui3uSA.jpg' },
        { id: 2, title: 'The Greatest Showman', poster_path: '/o9oEbrliB4vj7n3fhfs06j76H5R.jpg' },
        { id: 3, title: 'Les Misérables', poster_path: '/3e4aU3C8aZ8dGq390x10Zco28V2.jpg' },
      ],
    },
    {
      id: 'marvel',
      title: 'Marvel',
      items: [
        { id: 4, title: 'Avengers: Endgame', poster_path: '/or0650h68GwmZlGheZsQCegXIyA.jpg' },
        { id: 5, title: 'Iron Man', poster_path: '/78lPOhuCjxy6tU36Uv5nhnV4v72.jpg' },
        { id: 6, title: 'Spider-Man: No Way Home', poster_path: '/1g0dhIEaZ0BLFY7ehV26Vv14Vw2.jpg' },
      ],
    },
    {
      id: 'dc',
      title: 'DC',
      items: [
        { id: 7, title: 'The Dark Knight', poster_path: '/qJ2tWw751O12w9y37wZrkCo1il8.jpg' },
        { id: 8, title: 'The Batman', poster_path: '/74xTEgt7R36Fpooo50j6oR29yqi.jpg' },
        { id: 9, title: 'Man of Steel', poster_path: '/7760tUBRQC7424v54aG772U5g3M.jpg' },
      ],
    },
    {
      id: 'johnwick',
      title: 'John Wick',
      items: [
        { id: 10, title: 'John Wick', poster_path: '/fqSRJ7t7v63Jj8p6e0o66cZgP6C.jpg' },
        { id: 11, title: 'John Wick: Chapter 2', poster_path: '/k50d9G4E22Sre7mD908lB2C79r7.jpg' },
        { id: 12, title: 'John Wick: Chapter 3 - Parabellum', poster_path: '/ziEu0f6lh242ZkiBcES1VwIBEsG.jpg' },
      ],
    },
    {
      id: 'godzilla',
      title: 'Godzilla',
      items: [
        { id: 13, title: 'Godzilla Minus One', poster_path: '/hkxxMIGaiC6v64oIMoIB074t0qq.jpg' },
        { id: 14, title: 'Godzilla x Kong: The New Empire', poster_path: '/b4ebYg48CMjw4OS7TY4t687a46e.jpg' },
        { id: 15, title: 'Godzilla', poster_path: '/lZ2YC87WvRP449ISKYgQzwbN04N.jpg' },
      ],
    },
    {
      id: 'indianajones',
      title: 'Indiana Jones',
      items: [
        { id: 16, title: 'Raiders of the Lost Ark', poster_path: '/ceG7V8G1kFo29iIv2siC4Z7qj2F.jpg' },
        { id: 17, title: 'Indiana Jones and the Dial of Destiny', poster_path: '/34nO0Pz4Vw0xfi5V11CgDrq2j4n.jpg' },
        { id: 18, title: 'Indiana Jones and the Last Crusade', poster_path: '/4p15uR57UiMMQpqerCoIuJe8i9r.jpg' },
      ],
    },
  ],
  tv: [
    {
      id: 'anime',
      title: 'Anime',
      items: [
        { id: 101, name: 'Attack on Titan', poster_path: '/hTP1mN14L5tHnR190224aJ752hF.jpg' },
        { id: 102, name: 'Demon Slayer', poster_path: '/h8Rb9gBr48g5guw2wep4OXYTSIg.jpg' },
        { id: 103, name: 'Death Note', poster_path: '/iigTJJskR1Pc20n8z54J4jNu4cE.jpg' },
      ],
    },
    {
      id: 'marvel_tv',
      title: 'Marvel',
      items: [
        { id: 104, name: 'Loki', poster_path: '/voHUml2f5Zm2kBHiICy3646l8jV.jpg' },
        { id: 105, name: 'WandaVision', poster_path: '/glKDfE6btIRXlU0V20iohgU2WvO.jpg' },
        { id: 106, name: 'Daredevil', poster_path: '/Qp7QeeG7uCs2w1g8XZ4nS8szmH.jpg' },
      ],
    },
    {
      id: 'dc_tv',
      title: 'DC',
      items: [
        { id: 107, name: 'The Flash', poster_path: '/lJA2R2m7tC3w0g0aljK2k0GE0Ty.jpg' },
        { id: 108, name: 'Arrow', poster_path: '/rh6618OthdoxC9x4aWw9n9P5V6L.jpg' },
        { id: 109, name: 'Peacemaker', poster_path: '/hE3AhC4rjpgA9pj4O7iOPfgKN60.jpg' },
      ],
    },
    {
      id: 'scifi_tv',
      title: 'Sci-Fi',
      items: [
        { id: 110, name: 'Star Trek: Strange New Worlds', poster_path: '/95tLg4nEQ58u7vBf5FqE25xN66G.jpg' },
        { id: 111, name: 'Stranger Things', poster_path: '/49yOC3vV5w7j8H6n4wQQ4mc5qfS.jpg' },
        { id: 112, name: 'The Mandalorian', poster_path: '/e3Ns97sn486Mkx1j77EdGrlA3v3.jpg' },
      ],
    },
    {
      id: 'crime_tv',
      title: 'Crime',
      items: [
        { id: 113, name: 'Sherlock', poster_path: '/7rIPj7mlF1XqpocYEvp4LMJZZCc.jpg' },
        { id: 114, name: 'Breaking Bad', poster_path: '/ztkUQVk6e932GOhmA753a2D56ns.jpg' },
        { id: 115, name: 'Better Call Saul', poster_path: '/fuf2w6v9eMIYsa0j262RztA1ilC.jpg' },
      ],
    },
    {
      id: 'comedy_tv',
      title: 'Comedy',
      items: [
        { id: 116, name: 'Friends', poster_path: '/fqa5kLe4v6mZl18n3i7t5J53j2m.jpg' },
        { id: 117, name: 'The Office', poster_path: '/7Nu48BTJM6LV2hB687mVA7077as.jpg' },
        { id: 118, name: 'Brooklyn Nine-Nine', poster_path: '/hg9W3fV8b70V3J3o6Y7e6xZ2oB2.jpg' },
      ],
    },
  ],
};

export function useCollections(mediaType, collectionsList) {
  const [state, setState] = useState({ data: [], loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ data: [], loading: true, error: null });

    async function load() {
      try {
        const promises = collectionsList.map(async (col) => {
          let results = [];
          try {
            if (col.type === 'genre') {
              const res = await tmdb.discover(mediaType, { with_genres: col.value });
              results = res.results || [];
            } else if (col.type === 'search') {
              const res = await tmdb.search(mediaType, col.value);
              results = res.results || [];
            }
          } catch (apiErr) {
            console.warn(`TMDB collection API fetch failed for ${col.title}:`, apiErr);
          }

          // Filter out items without posters
          let filtered = results.filter((item) => item.poster_path).slice(0, 3);

          // If fetch returned no results or failed, fall back to our local fallback for this collection
          if (filtered.length < 3) {
            const fallbackCol = MOCK_FALLBACKS[mediaType]?.find((f) => f.id === col.id);
            if (fallbackCol) {
              filtered = fallbackCol.items;
            }
          }

          return {
            id: col.id,
            title: col.title,
            items: filtered,
          };
        });

        const fetched = await Promise.all(promises);
        if (cancelled) return;
        setState({ data: fetched, loading: false, error: null });
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        if (cancelled) return;
        // Global error: load all fallbacks for the selected mediaType as complete fallback
        const fallbackData = MOCK_FALLBACKS[mediaType] || [];
        setState({ data: fallbackData, loading: false, error: null });
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [mediaType, collectionsList]);

  return state;
}
