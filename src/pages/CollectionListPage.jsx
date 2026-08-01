import { useState, useEffect } from 'react';
import { useCollections } from '../hooks/useCollections';
import { MOVIE_COLLECTIONS, SERIES_COLLECTIONS } from '../constants/collectionsData';
import { useNavigationStore } from '../store/useNavigationStore';
import { getBackdropUrl, getPosterUrl } from '../api/tmdbClient';
import SectionHeader from '../components/common/SectionHeader/SectionHeader';
import { ToggleButton } from '../components/common/Button/Button';
import CollectionCard from '../components/home/Collections/CollectionCard';
import Button from '../components/common/Button/Button';
import starIcon from '../assets/star-five-stroke.png';
import netflixIcon from '../assets/netflix-icon.png';
import playIcon from '../assets/play-icon.png';
import styles from './CollectionListPage.module.css';

const HERO_FALLBACK = {
  id: 'dc',
  title: 'DC',
  heroTitle: 'The Dark Knight Collection',
  overview: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
  backdropSrc: 'https://image.tmdb.org/t/p/original/o7Gr59y37WzwvApe7812zs2n7JE.jpg',
  imageSrc: 'https://image.tmdb.org/t/p/w342/qJ2tWw751O12w9y37wZrkCo1il8.jpg',
  voteAverage: 8.5,
  items: [],
};

const HERO_FALLBACK_THUMBS = [
  { imageSrc: 'https://image.tmdb.org/t/p/w342/kCdaNqb5Ui6LsAIvT6tFd435t3T.jpg', title: 'Musicals' },
  { imageSrc: 'https://image.tmdb.org/t/p/w342/or0650h68GwmZlGheZsQCegXIyA.jpg', title: 'Marvel' },
  { imageSrc: 'https://image.tmdb.org/t/p/w342/qJ2tWw751O12w9y37wZrkCo1il8.jpg', title: 'DC' },
  { imageSrc: 'https://image.tmdb.org/t/p/w342/fqSRJ7t7v63Jj8p6e0o66cZgP6C.jpg', title: 'John Wick' },
];

function StarRow({ rating = 0 }) {
  const stars = rating / 2;
  return (
    <div className={styles['star-row']}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, stars - i)) * 100;
        return (
          <div key={i} className={styles['star-row__star']}>
            <div
              className={styles['star-row__mask-bg']}
              style={{
                WebkitMaskImage: `url(${starIcon})`,
                maskImage: `url(${starIcon})`,
              }}
            />
            <div
              className={styles['star-row__mask-fill']}
              style={{
                WebkitMaskImage: `url(${starIcon})`,
                maskImage: `url(${starIcon})`,
                clipPath: `inset(0 ${100 - fill}% 0 0)`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

function CollectionListPage() {
  const [isMoviesActive, setIsMoviesActive] = useState(true);
  const [current, setCurrent] = useState(0);
  const { setPage, setSelectedCollection } = useNavigationStore();

  const mediaType = isMoviesActive ? 'movie' : 'tv';
  const activeList = isMoviesActive ? MOVIE_COLLECTIONS : SERIES_COLLECTIONS;

  const { data: collections, loading, error } = useCollections(mediaType, activeList);

  // Reset slider index when changing Movies/Series toggle
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrent(0);
  }, [isMoviesActive]);

  // Extract first 4 collections for the hero banner cycle
  const heroCollections = (collections || []).slice(0, 4);
  const hasHeroData = heroCollections.length >= 4;

  useEffect(() => {
    if (!hasHeroData) return undefined;

    // Auto-advance every 5 seconds
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroCollections.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [hasHeroData, heroCollections.length]);

  // Map active collection for the hero section
  let activeHero = HERO_FALLBACK;
  let orderThumbs = HERO_FALLBACK_THUMBS;

  if (hasHeroData) {
    orderThumbs = heroCollections.map((col) => {
      const firstItem = col.items[0];
      return {
        title: col.title,
        imageSrc: getPosterUrl(firstItem?.poster_path, 'w342'),
      };
    });

    const activeCol = heroCollections[current];
    const firstItem = activeCol.items[0];
    const metaCol = activeList.find((c) => c.id === activeCol.id);

    activeHero = {
      id: activeCol.id,
      title: activeCol.title,
      heroTitle: metaCol?.heroTitle || `${activeCol.title} Collection`,
      overview: firstItem?.overview || 'Collection description is unavailable.',
      backdropSrc: getBackdropUrl(firstItem?.backdrop_path, 'original'),
      imageSrc: getPosterUrl(firstItem?.poster_path, 'w342'),
      voteAverage: firstItem?.vote_average || 7.5,
      items: activeCol.items,
    };
  }

  const handleHeroGoTo = (idx) => {
    if (!hasHeroData) return;
    setCurrent(idx);
  };

  const handleCollectionClick = (col) => {
    const metaCol = activeList.find((c) => c.id === col.id);
    setSelectedCollection({
      id: col.id,
      title: col.title,
      heroTitle: metaCol?.heroTitle || `${col.title} Collection`,
      mediaType: mediaType,
      items: col.items,
    });
    setPage('single-collection');
  };

  const handleWatchHeroCollection = () => {
    if (!hasHeroData) {
      // Default fallback collection navigate
      setSelectedCollection({
        id: 'dc',
        title: 'DC',
        heroTitle: 'The Dark Knight Collection',
        mediaType: 'movie',
        items: MOCK_FALLBACKS_DC, // Fallback placeholder if not loaded
      });
      setPage('single-collection');
      return;
    }
    const activeCol = heroCollections[current];
    handleCollectionClick(activeCol);
  };

  return (
    <div className={styles.page}>
      {/* ===== HERO BANNER SECTION ===== */}
      <section className={styles.hero}>
        {/* Mobile Backdrop */}
        <div className={styles['hero__mobile-backdrop']}>
          {activeHero.backdropSrc ? (
            <img
              src={activeHero.backdropSrc}
              className={styles['hero__mobile-backdrop-img']}
              alt={activeHero.heroTitle}
            />
          ) : (
            <div className={styles['hero__mobile-backdrop-placeholder']} />
          )}
          <div className={styles['hero__mobile-scrim']} />
        </div>

        {/* Desktop Backdrop */}
        <div
          className={styles.hero__backdrop}
          style={
            activeHero.backdropSrc
              ? { backgroundImage: `url('${activeHero.backdropSrc}')` }
              : { background: 'var(--bg-page)' }
          }
        >
          <div className={styles['hero__desktop-scrim-left']} />
          <div className={styles['hero__desktop-scrim-bottom']} />
        </div>

        {/* Hero Content Area */}
        <div className={styles.hero__content}>
          {/* Mobile Stacking Cards */}
          <div className={styles['hero__mobile-posters']}>
            {orderThumbs.map((item, idx) => {
              const isMain = idx === current;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleHeroGoTo(idx)}
                  className={[
                    styles['hero__mobile-poster'],
                    isMain ? styles['hero__mobile-poster--active'] : '',
                    idx > 0 ? styles['hero__mobile-poster--overlap'] : '',
                  ].join(' ')}
                >
                  <img src={item.imageSrc} className={styles['hero__mobile-poster-img']} alt="" />
                </button>
              );
            })}
          </div>

          <h1 className={styles.hero__title}>{activeHero.heroTitle}</h1>

          <p className={styles.hero__description}>{activeHero.overview}</p>

          {/* Info Row (IMDb + Stars) */}
          <div className={styles.hero__meta}>
            <StarRow rating={activeHero.voteAverage} />

            <div className={styles['hero__imdb-wrap']}>
              <div className={styles['hero__imdb-badge']}>IMDb</div>
              <span className={styles['hero__imdb-text']}>
                {activeHero.voteAverage ? activeHero.voteAverage.toFixed(1) : '7.5'}
              </span>
            </div>

            <img src={netflixIcon} alt="Netflix" className={styles['hero__netflix-icon']} />
          </div>

          {/* Actions */}
          <div className={styles.hero__actions}>
            <Button
              variant="primary"
              onClick={handleWatchHeroCollection}
              className={styles['hero__btn-primary']}
              leftIcon={<img src={playIcon} className={styles['hero__btn-play-icon']} alt="" />}
            >
              Watch Collection
            </Button>

            <Button
              variant="secondary"
              onClick={handleWatchHeroCollection}
              className={styles['hero__btn-secondary']}
              rightIcon={<span className={styles['hero__btn-arrow']}>→</span>}
            >
              More Info
            </Button>
          </div>
        </div>

        {/* Desktop Stacking Cards */}
        <div className={styles.hero__posters}>
          {orderThumbs.map((item, idx) => {
            const isMain = idx === current;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleHeroGoTo(idx)}
                className={[
                  styles.hero__poster,
                  isMain ? styles['hero__poster--active'] : '',
                  idx > 1 ? styles['hero__poster--overlap-large'] : '',
                ].join(' ')}
              >
                <img src={item.imageSrc} className={styles['hero__poster-img']} alt="" />
              </button>
            );
          })}
        </div>
      </section>

      {/* ===== GRID SECTION ===== */}
      <div className={styles.mainContent}>
        <SectionHeader
          title="Collections"
          rightContent={
            <ToggleButton
              leftLabel="Series"
              rightLabel="Movies"
              isRightActive={isMoviesActive}
              onChange={setIsMoviesActive}
            />
          }
        />

        {loading ? (
          <div className={styles.status}>Loading collections...</div>
        ) : error ? (
          <div className={styles.error}>Error loading collections: {error}</div>
        ) : (
          <div className={styles.grid}>
            {collections.map((col) => (
              <CollectionCard
                key={col.id}
                title={col.title}
                items={col.items}
                onClick={() => handleCollectionClick(col)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Fallback items for DC Comics if not loaded yet
const MOCK_FALLBACKS_DC = [
  { id: 7, title: 'Batman Begins', poster_path: '/854ss112cK8kgVamR38R33cwwrE.jpg', backdrop_path: '/zXJoz26s8mlnpG5sp26ZpYYbLI2.jpg', vote_average: 7.7 },
  { id: 8, title: 'The Dark Knight', poster_path: '/qJ2tWw751O12w9y37wZrkCo1il8.jpg', backdrop_path: '/o7Gr59y37WzwvApe7812zs2n7JE.jpg', vote_average: 8.5 },
  { id: 9, title: 'The Dark Knight Rises', poster_path: '/hr0S0UwvNu6x2jWv5Q17M9sK4jV.jpg', backdrop_path: '/cu4u6v4n751M139G7864e292L.jpg', vote_average: 7.8 }
];

export default CollectionListPage;
