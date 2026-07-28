import { useEffect, useState } from 'react';
import { Play, ArrowRight, Star } from 'lucide-react';
import { useTrending } from '../../../hooks/useTrending';
import { getBackdropUrl, getPosterUrl } from '../../../api/tmdbClient';
import styles from './Hero.module.css';

function Hero() {
  const { data: items, loading, error } = useTrending(4);
  const [activeIndex, setActiveIndex] = useState(0);

  // If the trending list refetches, reset activeIndex only when the list length changes.
  // This avoids unnecessary state updates and any cascading render warnings.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveIndex(0);
  }, [items]);

  useEffect(() => {
    if (items.length === 0) return undefined;

    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % items.length);
    }, 2500);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [items.length]);

  if (loading) {
    return (
      <section id="home" className={styles.hero}>
        <p className={styles['hero__status']}>Loading featured titles…</p>
      </section>
    );
  }

  if (error || items.length === 0) {
    return (
      <section id="home" className={styles.hero}>
        <p className={styles['hero__status']}>
          Couldn't load featured titles right now{error ? `: ${error}` : '.'}
        </p>
      </section>
    );
  }

  const active = items[activeIndex];
  const title = active.title || active.name;
  const rating = active.vote_average ? active.vote_average.toFixed(1) : '—';

  return (
    <section id="home" className={styles.hero}>
      {/* key={active.id} forces a remount on change, which re-triggers the
          fade-in keyframe below -> that's the "smooth transition" between banners */}
      <div
        key={active.id}
        className={styles['hero__backdrop']}
        style={{ backgroundImage: `url(${getBackdropUrl(active.backdrop_path)})` }}
      />
      <div className={styles['hero__scrim']} />

      <div className={styles['hero__content']}>
        <h1 className={styles['hero__title']}>{title}</h1>
        <p className={styles['hero__description']}>{active.overview}</p>

        <div className={styles['hero__meta']}>
          <span className={styles['hero__stars']} aria-label={`Rated ${rating} out of 10`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
            ))}
          </span>
          {/* Swap for your exported mask-group.png / netflix-icon.png when ready —
              using plain text here since those are trademarked brand logos. */}
          <span className={styles['hero__badge']}>IMDb {rating}</span>
          <span className={`${styles['hero__badge']} ${styles['hero__badge--brand']}`}>NETFLIX</span>
        </div>

        <div className={styles['hero__actions']}>
          <button type="button" className={styles['hero__btn-primary']}>
            <Play size={16} fill="currentColor" strokeWidth={0} />
            Watch Movie
          </button>
          <button type="button" className={styles['hero__btn-secondary']}>
            More Info
            <ArrowRight size={16} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className={styles['hero__posters']} role="tablist" aria-label="Featured titles">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={`Show ${item.title || item.name}`}
            className={[
              styles['hero__poster'],
              index === activeIndex ? styles['hero__poster--active'] : '',
            ].join(' ')}
            onClick={() => setActiveIndex(index)}
          >
            <img src={getPosterUrl(item.poster_path)} alt="" />
          </button>
        ))}
      </div>
    </section>
  );
}

export default Hero;
