import { getPosterUrl } from '../../../api/tmdbClient';
import styles from './ProfileCard.module.css';

function ProfileCard({ name, profilePath }) {
  const profileUrl = getPosterUrl(profilePath, 'w185');

  return (
    <div className={styles['profile-card']}>
      {profileUrl ? (
        <img
          className={styles['profile-card__image']}
          src={profileUrl}
          alt={name}
          loading="lazy"
        />
      ) : (
        <div className={styles['profile-card__placeholder']}>
          <span className={styles['profile-card__initial']}>
            {name ? name.charAt(0) : '?'}
          </span>
        </div>
      )}
    </div>
  );
}

export default ProfileCard;
