import { useEffect } from 'react';
import Navbar from './components/layout/Navbar/Navbar';
import Hero from './components/home/Hero/Hero';
import Trends from './components/home/Trends/Trends';
import Movies from './components/home/Movies/Movies';
import GoldenGlobeBanner from './components/home/GoldenGlobeBanner/GoldenGlobeBanner';
import Series from './components/home/Series/Series';
import Pricing from './components/home/Pricing/Pricing';
import Collections from './components/home/Collections/Collections';
import ContinueWatching from './components/home/ContinueWatching/ContinueWatching';
import Characters from './components/home/Characters/Characters';
import KidsBanner from './components/home/KidsBanner/KidsBanner';
import FrequentQueries from './components/home/FrequentQueries/FrequentQueries';
import Footer from './components/layout/Footer/Footer';
import KidsPage from './pages/KidsPage';
import MoviesPage from './pages/MoviesPage';
import SeriesPage from './pages/SeriesPage';
import AdvanceSearchPage from './pages/AdvanceSearchPage';
import CollectionListPage from './pages/CollectionListPage';
import SingleCollectionPage from './pages/SingleCollectionPage';
import WatchNowPage from './pages/WatchNowPage';
import LoginPage from './pages/LoginPage';
import VideoPlayerPage from './pages/VideoPlayerPage';
import { useThemeStore } from './store/useThemeStore';
import { useNavigationStore } from './store/useNavigationStore';
import './App.css';

function App() {
  const theme = useThemeStore((state) => state.theme);
  const page = useNavigationStore((state) => state.page);
  const isKidsWatch = useNavigationStore((state) => state.isKidsWatch);

  // data-theme drives every [data-theme='light'] override in tokens.css
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [page]);

  return (
    <div className="app">
      {page !== 'login' && page !== 'video-player' && <Navbar />}
      <main>
        {page === 'home' && (
          <>
            <Hero />
            <Trends />
            <Movies />
            <GoldenGlobeBanner />
            <Series />
            <Pricing />
            <Collections />
            <ContinueWatching />
            <Characters />
            <KidsBanner />
            <FrequentQueries />
          </>
        )}
        {page === 'kids' && <KidsPage />}
        {page === 'movies' && <MoviesPage />}
        {page === 'series' && <SeriesPage />}
        {page === 'advance-search' && <AdvanceSearchPage />}
        {page === 'collection-list' && <CollectionListPage />}
        {page === 'single-collection' && <SingleCollectionPage />}
        {page === 'watch-now' && <WatchNowPage />}
        {page === 'login' && <LoginPage />}
        {page === 'video-player' && <VideoPlayerPage />}
      </main>
      {page !== 'login' && page !== 'video-player' && <Footer isKidsPage={page === 'kids' || (page === 'watch-now' && isKidsWatch)} />}
    </div>
  );
}


export default App;

