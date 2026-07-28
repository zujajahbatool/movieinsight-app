import { useState } from 'react';
import { useThemeStore } from '../../../store/useThemeStore';
import logoDark from '../../../assets/logo-dark-theme.png';
import logoLight from '../../../assets/logo-light-theme.png';
import searchIconDark from '../../../assets/magnifying-glass-dark-theme.png';
import searchIconLight from '../../../assets/magnifying-glass-light-theme.png';
import bellIconDark from '../../../assets/bell-dark-theme.png';
import bellIconLight from '../../../assets/bell-light-theme.png';
import userIconDark from '../../../assets/user-dark-theme.png';
import userIconLight from '../../../assets/user-light-theme.png';
import sunIcon from '../../../assets/sun-dark-theme.png';
import moonIcon from '../../../assets/moon-light-theme.png';
import styles from './Navbar.module.css';

// target = the id of the <section> each link should scroll to.
// Home/Movies/Series/Collection sections come later — id="home" already
// exists on Hero, the rest are safe no-ops until those sections are built.
const NAV_LINKS = [
  { label: 'Home', target: 'home' },
  { label: 'Pricing', target: 'price' },
  { label: 'Movies', target: 'movies' },
  { label: 'Series', target: 'series' },
  { label: 'Collection', target: 'collections' },
  { label: 'FAQ', target: 'faq' },
];

function Navbar() {
  const { theme, toggleTheme } = useThemeStore();
  const [activeLabel, setActiveLabel] = useState('Home');

  const handleNavClick = (link) => {
    setActiveLabel(link.label);
    document.getElementById(link.target)?.scrollIntoView({ behavior: 'smooth' });
  };

  const logoSrc = theme === 'dark' ? logoDark : logoLight;
  const searchSrc = theme === 'dark' ? searchIconDark : searchIconLight;
  const bellSrc = theme === 'dark' ? bellIconDark : bellIconLight;
  const userSrc = theme === 'dark' ? userIconDark : userIconLight;
  const themeIconSrc = theme === 'dark' ? sunIcon : moonIcon;

  return (
    <header className={styles.navbar}>
      <div className={styles['navbar__glass']}>
        <img className={styles['navbar__logo']} src={logoSrc} alt="Omni logo" />

        <nav className={styles['navbar__links']} aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              type="button"
              className={[
                styles['navbar__link'],
                activeLabel === link.label ? styles['navbar__link--active'] : '',
              ].join(' ')}
              onClick={() => handleNavClick(link)}
            >
              {link.label}
              {activeLabel === link.label && <span className={styles['navbar__indicator']} />}
            </button>
          ))}
        </nav>

        <div className={styles['navbar__actions']}>
          <button type="button" className={styles['navbar__icon-btn']} aria-label="Search">
            <img className={styles['navbar__icon']} src={searchSrc} alt="Search" />
          </button>
          <button type="button" className={styles['navbar__icon-btn']} aria-label="Notifications">
            <img className={styles['navbar__icon']} src={bellSrc} alt="Notifications" />
          </button>
          <button type="button" className={styles['navbar__icon-btn']} aria-label="Account">
            <img className={styles['navbar__icon']} src={userSrc} alt="Account" />
          </button>
          <button
            type="button"
            className={styles['navbar__icon-btn']}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            onClick={toggleTheme}
          >
            <img className={styles['navbar__icon']} src={themeIconSrc} alt={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
