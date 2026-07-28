import styles from './SectionHeader.module.css';

function SectionHeader({ title, onSeeMore }) {
  return (
    <div className={styles['section-header']}>
      <h2 className={styles['section-header__title']}>{title}</h2>
      {onSeeMore && (
        <button type="button" className={styles['section-header__link']} onClick={onSeeMore}>
          See More <span aria-hidden="true">→</span>
        </button>
      )}
    </div>
  );
}

export default SectionHeader;