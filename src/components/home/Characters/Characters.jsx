import { useState } from 'react';
import { useCharacters } from '../../../hooks/useCharacters';
import ScrollRow from '../../common/ScrollRow/ScrollRow';
import { ToggleButton } from '../../common/Button/Button';
import ProfileCard from './ProfileCard';
import styles from './Characters.module.css';

function Characters() {
  const [isActorsActive, setIsActorsActive] = useState(true); // Default to Actors (right) active

  const type = isActorsActive ? 'actors' : 'directors';
  const { data: items, loading, error } = useCharacters(type);

  return (
    <div id="characters" className={styles.characters}>
      <ScrollRow
        title="Charactors"
        rightContent={
          <ToggleButton
            leftLabel="Directors"
            rightLabel="Actors"
            isRightActive={isActorsActive}
            onChange={setIsActorsActive}
          />
        }
      >
        {loading ? (
          <div className={styles.characters__status}>Loading profiles...</div>
        ) : error ? (
          <div className={styles.characters__error}>
            Error loading profiles: {error}
          </div>
        ) : (
          items.map((person) => (
            <ProfileCard
              key={person.id}
              name={person.name}
              profilePath={person.profile_path}
            />
          ))
        )}
      </ScrollRow>
    </div>
  );
}

export default Characters;
