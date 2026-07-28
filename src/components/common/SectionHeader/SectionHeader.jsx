import { ArrowRight } from 'lucide-react';
import styles from './SectionHeader.module.css';

function SectionHeader({ title, onSeeMore }) {
  return (
    <div className={styles['section-header']}>
      <h2 className={styles['section-header__title']}>{title}</h2>
      {onSeeMore && (
        <button type="button" className={styles['section-header__link']} onClick={onSeeMore}>
          See More <ArrowRight size={18} strokeWidth={2} />
        </button>
      )}
    </div>
  );
}

export default SectionHeader;