import SectionLayout from '../../common/SectionLayout/SectionLayout';
import styles from './Studios.module.css';

// Import all studio logos
import studio1 from '../../../assets/studios/1.png';
import studio2 from '../../../assets/studios/2.png';
import studio3 from '../../../assets/studios/3.png';
import studio4 from '../../../assets/studios/4.png';
import studio5 from '../../../assets/studios/5.png';
import studio6 from '../../../assets/studios/6.png';
import studio7 from '../../../assets/studios/7.png';
import studio8 from '../../../assets/studios/8.png';
import studio9 from '../../../assets/studios/9.png';
import studio10 from '../../../assets/studios/10.png';

const STUDIOS_DATA = [
  { id: 1, logo: studio1, name: 'HBO' },
  { id: 2, logo: studio2, name: 'Warner Bros.' },
  { id: 3, logo: studio3, name: 'Disney+' },
  { id: 4, logo: studio4, name: 'Marvel' },
  { id: 5, logo: studio5, name: 'DC' },
  { id: 6, logo: studio6, name: 'AMC' },
  { id: 7, logo: studio7, name: 'Netflix' },
  { id: 8, logo: studio8, name: 'Paramount' },
  { id: 9, logo: studio9, name: 'Sony' },
  { id: 10, logo: studio10, name: 'Apple TV+' },
];

function Studios() {
  return (
    <div className={styles['studios-section']}>
      <SectionLayout title="Studios">
        <div className={styles['studios-grid']}>
          {STUDIOS_DATA.map((studio) => (
            <div key={studio.id} className={styles['studio-card']} title={studio.name}>
              <img
                src={studio.logo}
                alt={`${studio.name} Logo`}
                className={styles['studio-card__logo']}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </SectionLayout>
    </div>
  );
}

export default Studios;
