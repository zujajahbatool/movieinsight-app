import { create } from 'zustand';

export const useNavigationStore = create((set) => ({
  page: 'home', // 'home' | 'kids' | 'movies' | 'series' | 'advance-search' | 'collection-list' | 'single-collection' | 'watch-now' | 'login'
  previousPage: 'home',
  selectedCollection: null,
  watchNowId: null,
  watchNowType: 'movie', // 'movie' | 'tv'
  isKidsWatch: false,
  setPage: (page) => set((state) => ({ previousPage: state.page, page })),
  setSelectedCollection: (selectedCollection) => set({ selectedCollection }),
  setWatchNow: (id, mediaType = 'movie', isKids = false) =>
    set((state) => ({
      previousPage: state.page,
      page: 'watch-now',
      watchNowId: id,
      watchNowType: mediaType,
      isKidsWatch: isKids,
    })),
  playVideo: (id, mediaType = 'movie', isKids = false) =>
    set((state) => ({
      previousPage: state.page,
      page: 'video-player',
      watchNowId: id,
      watchNowType: mediaType,
      isKidsWatch: isKids,
    })),
}));



