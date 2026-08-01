import { useState, useMemo } from 'react';
import { useCollections } from '../../../hooks/useCollections';
import ScrollRow from '../../common/ScrollRow/ScrollRow';
import { ToggleButton } from '../../common/Button/Button';
import CollectionCard from './CollectionCard';
import { MOVIE_COLLECTIONS, SERIES_COLLECTIONS } from '../../../constants/collectionsData';
import { useNavigationStore } from '../../../store/useNavigationStore';
import styles from './Collections.module.css';

function Collections() {
  const [isMoviesActive, setIsMoviesActive] = useState(true); // Default to Movies (right) active
  const { setPage, setSelectedCollection } = useNavigationStore();

  const mediaType = isMoviesActive ? 'movie' : 'tv';
  
  // Homepage Collections section displays the first 6 collections in a ScrollRow
  const activeList = useMemo(() => {
    const fullList = isMoviesActive ? MOVIE_COLLECTIONS : SERIES_COLLECTIONS;
    return fullList.slice(0, 6);
  }, [isMoviesActive]);

  const { data: collections, loading, error } = useCollections(mediaType, activeList);


  const handleCollectionClick = (col) => {
    setSelectedCollection({
      id: col.id,
      title: col.title,
      heroTitle: col.heroTitle || `${col.title} Collection`,
      mediaType: mediaType,
      items: col.items,
    });
    setPage('single-collection');
  };

  return (
    <div id="collections" className={styles.collections}>
      <ScrollRow
        title="Collection"
        rightContent={
          <ToggleButton
            leftLabel="Series"
            rightLabel="Movies"
            isRightActive={isMoviesActive}
            onChange={setIsMoviesActive}
          />
        }
      >
        {loading ? (
          <div className={styles.collections__status}>Loading collections...</div>
        ) : error ? (
          <div className={styles.collections__error}>
            Error loading collections: {error}
          </div>
        ) : (
          collections.map((col) => {
            // Find metadata corresponding to this collection item
            const metaCol = activeList.find((c) => c.id === col.id);
            return (
              <CollectionCard
                key={col.id}
                title={col.title}
                items={col.items}
                onClick={() => handleCollectionClick({ ...col, heroTitle: metaCol?.heroTitle })}
              />
            );
          })
        )}
      </ScrollRow>
    </div>
  );
}

export default Collections;

