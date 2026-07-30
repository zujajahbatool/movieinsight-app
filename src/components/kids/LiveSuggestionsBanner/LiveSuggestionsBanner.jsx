import { useState } from 'react';
import { getBackdropUrl, getPosterUrl } from '../../../api/tmdbClient';
import playIcon from '../../../assets/play-icon.png';
import styles from './LiveSuggestionsBanner.module.css';

const LIVE_MOVIES = [
  {
    id: 976573,
    title: 'Elemental',
    posterPath: '/4Y1WNkd88JXmGfhtWR7dmDAo1T2.jpg',
    backdropPath: '/4fLZUr1e65hKPPVw0R3PmKFKxj1.jpg',
    genre: 'Romance/Fantasy',
    duration: '1h 42m',
    year: '2023',
    country: 'USA',
    rating: 7.6,
  },
  {
    id: 508442,
    title: 'Soul',
    posterPath: '/6jmppcaubzLF8wkXM36ganVISCo.jpg',
    backdropPath: '/rQaHA74pevnGsxcKGaoZVGWe9TC.jpg',
    genre: 'Drama/Fantasy/Music',
    duration: '1h 41m',
    year: '2020',
    country: 'USA',
    rating: 8.1,
  },
  {
    id: 508943,
    title: 'Luca',
    posterPath: '/9x4i9uKGXt8IiiIF5Ey0DIoY738.jpg',
    backdropPath: '/620hnMVLu6RSZW6a5rwO8gqpt0t.jpg',
    genre: 'Family/Comedy/Fantasy',
    duration: '1h 35m',
    year: '2021',
    country: 'USA',
    rating: 7.8,
  },
  {
    id: 1022789,
    title: 'Inside Out 2',
    posterPath: '/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg',
    backdropPath: '/p5ozvmdgsmbWe0H8Xk7Rc8SCwAB.jpg',
    genre: 'Adventure/Comedy/Family',
    duration: '1h 37m',
    year: '2024',
    country: 'USA',
    rating: 7.5,
  },
];

function LiveSuggestionsBanner() {
  const [index, setIndex] = useState(0);

  const current = LIVE_MOVIES[index];

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % LIVE_MOVIES.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + LIVE_MOVIES.length) % LIVE_MOVIES.length);
  };

  const handleWatch = () => {
    console.log('Watch Live Movie:', current.title);
  };

  // Convert 0-10 rating to 0-5 stars
  const renderStars = (voteAverage) => {
    const filledStarsCount = Math.round(voteAverage / 2);
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={[
            styles.banner__star,
            i <= filledStarsCount ? styles['banner__star--filled'] : '',
          ].join(' ')}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <section className={styles.banner}>
      <div className={styles.banner__container}>
        {/* Blurry reflective background backdrop image */}
        <div
          className={styles.banner__backdrop}
          style={{ backgroundImage: `url('${getBackdropUrl(current.backdropPath, 'w780')}')` }}
        />
        <div className={styles.banner__scrim} />

        {/* Content Wrapper */}
        <div className={styles.banner__content}>
          {/* Left Block: Movie Poster Card */}
          <div className={styles.banner__poster_card}>
            <img
              src={getPosterUrl(current.posterPath, 'w342')}
              alt={current.title}
              className={styles.banner__poster_img}
            />
          </div>

          {/* Middle Block: Details */}
          <div className={styles.banner__details}>
            <h2 className={styles.banner__title}>{current.title}</h2>
            <div className={styles.banner__genre}>{current.genre}</div>
            <div className={styles.banner__meta}>
              {current.duration} &bull; {current.year} &bull; {current.country}
            </div>
            <div className={styles.banner__stars}>
              {renderStars(current.rating)}
            </div>

            {/* Play Button */}
            <button
              type="button"
              onClick={handleWatch}
              className={styles.banner__watch_btn}
            >
              <img src={playIcon} alt="" className={styles.banner__play_icon} />
              Watch Now
            </button>
          </div>
        </div>

        {/* Right Block: Navigation Chevrons */}
        <div className={styles.banner__nav}>
          <button
            type="button"
            onClick={handlePrev}
            className={styles.banner__nav_btn}
            aria-label="Previous Slide"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={handleNext}
            className={styles.banner__nav_btn}
            aria-label="Next Slide"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}

export default LiveSuggestionsBanner;
