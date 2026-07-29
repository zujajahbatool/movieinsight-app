import { useEffect } from 'react';
import Navbar from './components/layout/Navbar/Navbar';
import Hero from './components/home/Hero/Hero';
import Trends from './components/home/Trends/Trends';
import Movies from './components/home/Movies/Movies';
import GoldenGlobeBanner from './components/home/GoldenGlobeBanner/GoldenGlobeBanner';
import Series from './components/home/Series/Series';
import Pricing from './components/home/Pricing/Pricing';
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
        <GoldenGlobeBanner />
        <Series />
        <Pricing />
      </main>
    </div>
  );
}

export default App;
