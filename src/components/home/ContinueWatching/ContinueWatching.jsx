import { useContinueWatching } from '../../../hooks/useContinueWatching';
import ScrollRow from '../../common/ScrollRow/ScrollRow';
import ContinueWatchingCard from './ContinueWatchingCard';
import { useNavigationStore } from '../../../store/useNavigationStore';
import styles from './ContinueWatching.module.css';

function ContinueWatching() {
  const { data: items, loading, error } = useContinueWatching();
  const setPage = useNavigationStore((state) => state.setPage);
  const setWatchNow = useNavigationStore((state) => state.setWatchNow);

  const handleSeeMore = () => {
    setPage('advance-search');
  };

  return (
    <div id="continue-watching" className={styles['continue-watching']}>
      {loading ? (
        <div className={styles['continue-watching__status']}>
          Loading in-progress items...
        </div>
      ) : error ? (
        <div className={styles['continue-watching__error']}>
          Error loading continue watching: {error}
        </div>
      ) : (
        <ScrollRow title="Continue Watching" onSeeMore={handleSeeMore}>
          {items.map((item) => (
            <ContinueWatchingCard
              key={item.id}
              title={item.title}
              backdropPath={item.backdrop_path}
              progress={item.progress}
              onClick={() => setWatchNow(item.id, 'movie', false)}
            />
          ))}
        </ScrollRow>
      )}
    </div>
  );
}

export default ContinueWatching;
