import { ArrowRight } from 'lucide-react';
import Button from '../Button/Button';
import styles from './SectionHeader.module.css';

function SectionHeader({ title, onSeeMore }) {
  return (
    <div className={styles['section-header']}>
      <h2 className={styles['section-header__title']}>{title}</h2>
      {onSeeMore && (
        <Button
          variant="link"
          onClick={onSeeMore}
          rightIcon={<ArrowRight size={18} strokeWidth={2} />}
        >
          See More
        </Button>
      )}
    </div>
  );
}

export default SectionHeader;