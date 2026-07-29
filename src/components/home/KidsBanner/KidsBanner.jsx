import kidsImg from '../../../assets/kids.png';
import styles from './KidsBanner.module.css';

function KidsBanner() {
  return (
    <section className={styles['kids-banner']}>
      <div className={styles['kids-banner__container']}>
        <img
          src={kidsImg}
          alt="Family Friendly Streaming - Children's Section"
          className={styles['kids-banner__image']}
          loading="lazy"
        />
      </div>
    </section>
  );
}

export default KidsBanner;
