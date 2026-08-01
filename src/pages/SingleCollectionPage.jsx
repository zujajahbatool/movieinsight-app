import { getBackdropUrl, getPosterUrl } from '../api/tmdbClient';
import { useNavigationStore } from '../store/useNavigationStore';
import { useWatchlistStore } from '../store/useWatchlistStore';
import MovieCard from '../components/common/MovieCard/MovieCard';
import styles from './SingleCollectionPage.module.css';

const DEFAULT_COLLECTION = {
  id: 'dc',
  title: 'DC',
  heroTitle: 'The Dark Knight Collection',
  mediaType: 'movie',
  items: [
    {
      id: 272,
      title: 'Batman Begins',
      poster_path: '/854ss112cK8kgVamR38R33cwwrE.jpg',
      backdrop_path: '/zXJoz26s8mlnpG5sp26ZpYYbLI2.jpg',
      vote_average: 7.7,
      overview: 'Driven by tragedy, billionaire Bruce Wayne dedicates his life to fighting lawlessness in Gotham City as Batman.',
    },
    {
      id: 155,
      title: 'The Dark Knight',
      poster_path: '/qJ2tWw751O12w9y37wZrkCo1il8.jpg',
      backdrop_path: '/o7Gr59y37WzwvApe7812zs2n7JE.jpg',
      vote_average: 8.5,
      overview: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    },
    {
      id: 49026,
      title: 'The Dark Knight Rises',
      poster_path: '/hr0S0UwvNu6x2jWv5Q17M9sK4jV.jpg',
      backdrop_path: '/cu4u6v4n751M139G7864e292L.jpg',
      vote_average: 7.8,
      overview: 'Following the death of District Attorney Harvey Dent, Batman assumes responsibility for Dent\'s crimes.',
    },
  ],
};

function SingleCollectionPage() {
  const selectedCollection = useNavigationStore((state) => state.selectedCollection);
  const setWatchNow = useNavigationStore((state) => state.setWatchNow);
  const watchlist = useWatchlistStore((state) => state.watchlist);
  const toggleMovie = useWatchlistStore((state) => state.toggleMovie);

  const collection = selectedCollection || DEFAULT_COLLECTION;
  const items = collection.items || [];
  const topItem = items[0] || null;

  const backdropSrc = topItem?.backdrop_path
    ? getBackdropUrl(topItem.backdrop_path, 'original')
    : null;

  const renderStars = (voteAverage) => {
    const filledStarsCount = Math.round(voteAverage / 2);
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={[
            styles.hero__star,
            i <= filledStarsCount ? styles['hero__star--filled'] : '',
          ].join(' ')}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className={styles.page}>
      {/* ===== HERO SECTION ===== */}
      <section className={styles.hero}>
        {/* Backdrop Image Container */}
        {backdropSrc ? (
          <div
            className={styles.hero__backdrop}
            style={{ backgroundImage: `url('${backdropSrc}')` }}
          >
            <div className={styles['hero__desktop-scrim-left']} />
            <div className={styles['hero__desktop-scrim-bottom']} />
          </div>
        ) : (
          <div className={styles.hero__backdrop_placeholder}>
            <div className={styles['hero__desktop-scrim-left']} />
            <div className={styles['hero__desktop-scrim-bottom']} />
          </div>
        )}

        {/* Hero content area */}
        <div className={styles.hero__content}>
          <h1 className={styles.hero__title}>
            {collection.heroTitle || `${collection.title} Collection`}
          </h1>

          <p className={styles.hero__description}>
            {topItem?.overview || 'No overview available for this collection.'}
          </p>

          {/* Metadata Row */}
          {topItem && (
            <div className={styles.hero__meta}>
              <div className={styles.hero__imdb_wrap}>
                <div className={styles.hero__imdb_badge}>IMDb</div>
                <span className={styles.hero__imdb_text}>
                  {(topItem.vote_average || 7.5).toFixed(1)}
                </span>
              </div>
              <div className={styles.hero__stars}>
                {renderStars(topItem.vote_average || 7.5)}
              </div>
              <span className={styles.hero__badge_rating}>PG-13</span>
            </div>
          )}
        </div>
      </section>

      {/* ===== SINGLE POSTERS ROW ===== */}
      <div className={styles.mainContent}>
        <div className={styles.postersContainer}>
          {items.map((item) => (
            <MovieCard
              key={item.id}
              title={item.title || item.name}
              posterUrl={getPosterUrl(item.poster_path, 'w342')}
              rating={item.vote_average}
              genreIds={item.genre_ids}
              isAdded={watchlist.includes(item.id)}
              onAddToggle={() => toggleMovie(item.id)}
              onClick={() => setWatchNow(item.id, collection.mediaType || 'movie', false)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default SingleCollectionPage;
