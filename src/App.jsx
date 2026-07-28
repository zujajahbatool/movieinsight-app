import { useEffect } from 'react';
import Navbar from './components/layout/Navbar/Navbar';
import Hero from './components/home/Hero/Hero';
import Trends from './components/home/Trends/Trends';
import Movies from './components/home/Movies/Movies';
import { useThemeStore } from './store/useThemeStore';
import './App.css';

function App() {
  const theme = useThemeStore((state) => state.theme);

  // data-theme drives every [data-theme='light'] override in tokens.css
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="app">
      <Navbar />
      <main>
        <Hero />
        <Trends />
        <Movies />
      </main>
    </div>
  );
}

export default App;
