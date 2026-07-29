import goldenGlobeImg from '../../../assets/golden-globe.png';
import styles from './GoldenGlobeBanner.module.css';

function GoldenGlobeBanner() {
  return (
    <section className={styles['golden-globe']}>
      <div className={styles['golden-globe__container']}>
        <img
          src={goldenGlobeImg}
          alt="Golden Globe Awards Promo"
          className={styles['golden-globe__image']}
          loading="lazy"
        />
        <div className={styles['golden-globe__overlay']} />
      </div>
    </section>
  );
}

export default GoldenGlobeBanner;
