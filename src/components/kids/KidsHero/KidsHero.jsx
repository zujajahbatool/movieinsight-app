import { getBackdropUrl } from '../../../api/tmdbClient';
import Button from '../../common/Button/Button';
import styles from './KidsHero.module.css';

// Using Disney/Pixar's "Soul" backdrop from TMDB
const KIDS_BACKDROP_PATH = '/rQaHA74pevnGsxcKGaoZVGWe9TC.jpg';

function KidsHero() {
  const backdropSrc = getBackdropUrl(KIDS_BACKDROP_PATH, 'original');

  const handleAboutKids = () => {
    console.log('About Omni Kids clicked');
  };

  return (
    <section className={styles.hero} id="kids-hero">
      {/* Background Image Container */}
      <div
        className={styles.hero__backdrop}
        style={{ backgroundImage: `url('${backdropSrc}')` }}
      >
        <div className={styles['hero__desktop-scrim-left']} />
        <div className={styles['hero__desktop-scrim-bottom']} />
      </div>

      {/* Hero content area */}
      <div className={styles.hero__content}>
        {/* Heading/Message */}
        <h1 className={styles.hero__title}>
          Enjoy the magic of storytelling with us.
        </h1>

        {/* Action Button */}
        <div className={styles.hero__actions}>
          <Button
            variant="primary"
            onClick={handleAboutKids}
            className={styles['hero__btn-primary']}
          >
            About omni kid
          </Button>
        </div>
      </div>
    </section>
  );
}

export default KidsHero;
