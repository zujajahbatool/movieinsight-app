import omniKidBannerImg from '../../../assets/omni-kid-banner.png';
import styles from './OmniKidsBanner.module.css';

function OmniKidsBanner() {
  const handleCreateKidsAccount = () => {
    console.log('Create Omni Kids Account clicked');
  };

  return (
    <section className={styles.banner}>
      <div className={styles.banner__container}>
        <img
          src={omniKidBannerImg}
          alt="Making an Omni Kid space allows you to create a safe space for your child."
          className={styles.banner__image}
          loading="lazy"
        />
        {/* Transparent interactive button overlay */}
        <button
          type="button"
          onClick={handleCreateKidsAccount}
          className={styles['banner__button-overlay']}
          aria-label="Create a kids space"
        />
      </div>
    </section>
  );
}

export default OmniKidsBanner;
