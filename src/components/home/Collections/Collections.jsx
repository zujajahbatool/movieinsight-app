import { useState } from 'react';
import { useCollections } from '../../../hooks/useCollections';
import ScrollRow from '../../common/ScrollRow/ScrollRow';
import { ToggleButton } from '../../common/Button/Button';
import CollectionCard from './CollectionCard';
import styles from './Collections.module.css';

const MOVIE_COLLECTIONS = [
  { id: 'musicals', title: 'Musicals', type: 'genre', value: 10402 },
  { id: 'marvel', title: 'Marvel', type: 'search', value: 'Marvel' },
  { id: 'dc', title: 'DC', type: 'search', value: 'DC Comics' },
  { id: 'johnwick', title: 'John Wick', type: 'search', value: 'John Wick' },
  { id: 'godzilla', title: 'Godzilla', type: 'search', value: 'Godzilla' },
  { id: 'indianajones', title: 'Indiana Jones', type: 'search', value: 'Indiana Jones' },
];

const SERIES_COLLECTIONS = [
  { id: 'anime', title: 'Anime', type: 'search', value: 'Anime' },
  { id: 'marvel_tv', title: 'Marvel', type: 'search', value: 'Marvel' },
  { id: 'dc_tv', title: 'DC', type: 'search', value: 'DC Comics' },
  { id: 'scifi_tv', title: 'Sci-Fi', type: 'search', value: 'Star Trek' },
  { id: 'crime_tv', title: 'Crime', type: 'search', value: 'Sherlock' },
  { id: 'comedy_tv', title: 'Comedy', type: 'search', value: 'Comedy' },
];

function Collections() {
  const [isMoviesActive, setIsMoviesActive] = useState(true); // Default to Movies (right) active

  const mediaType = isMoviesActive ? 'movie' : 'tv';
  const activeList = isMoviesActive ? MOVIE_COLLECTIONS : SERIES_COLLECTIONS;

  const { data: collections, loading, error } = useCollections(mediaType, activeList);

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
          collections.map((col) => (
            <CollectionCard key={col.id} title={col.title} items={col.items} />
          ))
        )}
      </ScrollRow>
    </div>
  );
}

export default Collections;
