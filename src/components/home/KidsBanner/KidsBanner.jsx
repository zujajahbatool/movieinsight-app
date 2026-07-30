import { useNavigationStore } from '../../../store/useNavigationStore';
import kidsImg from '../../../assets/kids.png';
import styles from './KidsBanner.module.css';

function KidsBanner() {
  const setPage = useNavigationStore((state) => state.setPage);

  return (
    <section className={styles['kids-banner']}>
      <div
        className={styles['kids-banner__container']}
        onClick={() => setPage('kids')}
      >
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
