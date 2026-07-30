import { useKidsContent } from '../../../hooks/useKidsContent';
import SectionHeader from '../../common/SectionHeader/SectionHeader';
import MovieCard from '../../common/MovieCard/MovieCard';
import { getPosterUrl } from '../../../api/tmdbClient';
import styles from './MostViewed.module.css';

function MostViewed() {
  const { data: items, loading, error } = useKidsContent('mostviewed', 20);

  return (
    <section className={styles.mostviewed} id="most-viewed">
      <SectionHeader title="Most View" />

      {loading ? (
        <div className={styles.mostviewed__status}>Loading popular titles...</div>
      ) : error ? (
        <div className={styles.mostviewed__error}>
          Error loading popular titles: {error}
        </div>
      ) : (
        <div className={styles.mostviewed__grid}>
          {items.map((item) => (
            <MovieCard
              key={item.id}
              title={item.title || item.name}
              posterUrl={getPosterUrl(item.poster_path)}
              rating={item.vote_average}
              genreIds={item.genre_ids}
              variant="simple"
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default MostViewed;
