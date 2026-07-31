import { create } from 'zustand';

export const useNavigationStore = create((set) => ({
  page: 'home', // 'home' | 'kids' | 'movies' | 'series' | 'advance-search'
  setPage: (page) => set({ page }),
}));

