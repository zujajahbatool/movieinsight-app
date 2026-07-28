import { create } from 'zustand';

const STORAGE_KEY = 'omni-theme';

function getInitialTheme() {
  if (typeof window === 'undefined') return 'dark';

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'dark' || stored === 'light') return stored;

  const prefersLight = window.matchMedia?.('(prefers-color-scheme: light)').matches;
  return prefersLight ? 'light' : 'dark';
}

export const useThemeStore = create((set, get) => ({
  theme: getInitialTheme(),

  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    window.localStorage.setItem(STORAGE_KEY, next);
    set({ theme: next });
  },

  setTheme: (theme) => {
    window.localStorage.setItem(STORAGE_KEY, theme);
    set({ theme });
  },
}));
