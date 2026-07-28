import { create } from 'zustand';

const STORAGE_KEY = 'omni-watchlist';

function getInitialWatchlist() {
  if (typeof window === 'undefined') return [];
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export const useWatchlistStore = create((set, get) => ({
  watchlist: getInitialWatchlist(),

  toggleMovie: (id) => {
    const current = get().watchlist;
    const isAdded = current.includes(id);
    const next = isAdded
      ? current.filter((item) => item !== id)
      : [...current, id];
    
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    set({ watchlist: next });
  },
}));
