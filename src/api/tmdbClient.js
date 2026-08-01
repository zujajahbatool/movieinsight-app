const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p';
const API_KEY = import.meta.env.VITE_MOVIE_API_KEY;

async function tmdbFetch(path, params = {}) {
  if (!API_KEY) {
    throw new Error(
      'Missing VITE_MOVIE_API_KEY — check that .env.local is set and you restarted the Vite dev server.'
    );
  }

  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('language', 'en-US');

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, value);
    }
  });

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`TMDB request failed (${response.status}): ${path}`);
  }
  return response.json();
}

/** e.g. getBackdropUrl(item.backdrop_path, 'original') */
export function getBackdropUrl(path, size = 'original') {
  return path ? `${IMAGE_BASE}/${size}${path}` : null;
}

/** e.g. getPosterUrl(item.poster_path, 'w342') */
export function getPosterUrl(path, size = 'w342') {
  return path ? `${IMAGE_BASE}/${size}${path}` : null;
}

export const tmdb = {
  trendingAll: (window = 'day') => tmdbFetch(`/trending/all/${window}`),
  movieDetails: (id) => tmdbFetch(`/movie/${id}`),
  tvDetails: (id) => tmdbFetch(`/tv/${id}`),
  discoverByGenre: (genreId, mediaType = 'movie') =>
    tmdbFetch(`/discover/${mediaType}`, { with_genres: genreId }),
  search: (mediaType, query) => tmdbFetch(`/search/${mediaType}`, { query }),
  discover: (mediaType, params) => tmdbFetch(`/discover/${mediaType}`, params),
  personDetails: (id) => tmdbFetch(`/person/${id}`),
  movieCredits: (id) => tmdbFetch(`/movie/${id}/credits`),
  tvCredits: (id) => tmdbFetch(`/tv/${id}/credits`),
  movieImages: (id) => tmdbFetch(`/movie/${id}/images`),
  tvImages: (id) => tmdbFetch(`/tv/${id}/images`),
  movieRecommendations: (id) => tmdbFetch(`/movie/${id}/recommendations`),
  tvRecommendations: (id) => tmdbFetch(`/tv/${id}/recommendations`),
  movieVideos: (id) => tmdbFetch(`/movie/${id}/videos`),
  tvVideos: (id) => tmdbFetch(`/tv/${id}/videos`),
};

