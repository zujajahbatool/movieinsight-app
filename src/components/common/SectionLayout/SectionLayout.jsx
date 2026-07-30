import styles from './SectionLayout.module.css';

function SectionLayout({ title, children }) {
  return (
    <section className={styles['section-layout']}>
      <h2 className={styles['section-layout__heading']}>{title}</h2>
      <div className={styles['section-layout__content']}>
        {children}
      </div>
    </section>
  );
}

export default SectionLayout;
