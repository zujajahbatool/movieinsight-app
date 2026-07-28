import { useState, useEffect } from 'react';
import { useTrending } from '../../../hooks/useTrending';
import { getBackdropUrl, getPosterUrl } from '../../../api/tmdbClient';
import starIcon from '../../../assets/star-five-stroke.png';
import netflixIcon from '../../../assets/netflix-icon.png';
import playIcon from '../../../assets/play-icon.png';
import styles from './Hero.module.css';

const FALLBACK = {
  id: null,
  title: 'The Witcher',
  overview:
    'Geralt of Rivia, a mutated monster-hunter for hire, journeys toward his destiny in a turbulent world where people often prove more wicked than beasts.',
  backdropSrc: 'https://image.tmdb.org/t/p/original/jBJWZ0mUEhV74N5fH6w0t39B57C.jpg',
  imageSrc: 'https://image.tmdb.org/t/p/w342/7vjaOZuR7j5wH136OmvEE76j151.jpg',
  voteAverage: 8.1,
};

const FALLBACK_THUMBS = [
  { imageSrc: 'https://image.tmdb.org/t/p/w342/ii0mGoGk7HeDMwmdbXjZYSM5QvT.jpg', title: 'Spider-Man' },
  { imageSrc: 'https://image.tmdb.org/t/p/w342/gEU2QniE6E7vNIvxeKG6v6Ur464.jpg', title: 'Interstellar' },
  { imageSrc: 'https://image.tmdb.org/t/p/w342/qJ2tWw751O12zs2n7JEtOFiJBE5.jpg', title: 'The Dark Knight' },
  { imageSrc: 'https://image.tmdb.org/t/p/w342/edv5CZv0jVdHnxQDwz9262X82vR.jpg', title: 'Inception' },
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

function Hero() {
  const { data: items } = useTrending(4);
  const [current, setCurrent] = useState(0);

  const features = (items || []).slice(0, 4).map((item) => ({
    id: item.id,
    title: item.title || item.name,
    overview: item.overview,
    backdropSrc: getBackdropUrl(item.backdrop_path, 'original'),
    imageSrc: getPosterUrl(item.poster_path, 'w342'),
    voteAverage: item.vote_average,
  }));

  const hasData = features.length >= 4;

  useEffect(() => {
    if (!hasData) return undefined;
    
    // Auto-advance every 5 seconds
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % features.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [hasData, features.length]);

  const active = hasData ? features[current] : FALLBACK;
  const order = hasData ? features : FALLBACK_THUMBS;

  const goTo = (idx) => {
    if (!hasData) return;
    setCurrent(idx);
  };

  const handleWatchNow = () => {
    if (!active?.id) return;
    console.log('Watch now:', active.id);
  };

  return (
    <section className={styles.hero}>
      {/* ===== MOBILE: image block (fully visible, in normal flow) ===== */}
      <div className={styles['hero__mobile-backdrop']}>
        <img
          src={active.backdropSrc || active.imageSrc}
          className={styles['hero__mobile-backdrop-img']}
          alt={active.title}
        />
        <div className={styles['hero__mobile-scrim']} />
      </div>

      {/* ===== DESKTOP: absolute background image ===== */}
      <div
        className={styles['hero__backdrop']}
        style={{ backgroundImage: `url('${active.backdropSrc || active.imageSrc}')` }}
      >
        <div className={styles['hero__desktop-scrim-left']} />
        <div className={styles['hero__desktop-scrim-bottom']} />
      </div>

      {/* Hero content area */}
      <div className={styles['hero__content']}>
        {/* Mobile Stacking Cards — static order, only the current index pops up */}
        <div className={styles['hero__mobile-posters']}>
          {order.map((item, idx) => {
            const isMain = idx === current;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => goTo(idx)}
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

        {/* Heading */}
        <h1 className={styles['hero__title']}>{active.title}</h1>

        {/* Paragraph description */}
        <p className={styles['hero__description']}>
          {active.overview || FALLBACK.overview}
        </p>

        {/* Info Row (Stars + IMDb + Netflix) */}
        <div className={styles['hero__meta']}>
          <StarRow rating={active.voteAverage} />
          
          <div className={styles['hero__imdb-wrap']}>
            <div className={styles['hero__imdb-badge']}>IMDb</div>
            <span className={styles['hero__imdb-text']}>
              {active.voteAverage ? active.voteAverage.toFixed(1) : FALLBACK.voteAverage}
            </span>
          </div>

          <img src={netflixIcon} alt="Netflix" className={styles['hero__netflix-icon']} />
        </div>

        {/* Action Row */}
        <div className={styles['hero__actions']}>
          <button
            type="button"
            onClick={handleWatchNow}
            className={styles['hero__btn-primary']}
          >
            <img src={playIcon} className={styles['hero__btn-play-icon']} alt="" />
            <span>Watch Movie</span>
          </button>
          
          <button type="button" className={styles['hero__btn-secondary']}>
            <span>More Info</span>
            <span className={styles['hero__btn-arrow']}>→</span>
          </button>
        </div>
      </div>

      {/* Desktop Stacking Cards — static order, only the current index pops up */}
      <div className={styles['hero__posters']}>
        {order.map((item, idx) => {
          const isMain = idx === current;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => goTo(idx)}
              className={[
                styles['hero__poster'],
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
  );
}

export default Hero;
