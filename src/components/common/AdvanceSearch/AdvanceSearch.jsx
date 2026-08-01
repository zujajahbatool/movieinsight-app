import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import GenrePills from '../GenrePills/GenrePills';
import CustomSelect from '../CustomSelect/CustomSelect';
import searchLogo from '../../../assets/search-logo.png';
import styles from './AdvanceSearch.module.css';

const YEARS = [
  { value: '', label: 'All Years' },
  ...Array.from({ length: 17 }, (_, i) => {
    const y = 2026 - i;
    return { value: String(y), label: String(y) };
  })
];

const COUNTRIES = [
  { value: '', label: 'All Countries' },
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'JP', label: 'Japan' },
  { value: 'IN', label: 'India' },
  { value: 'CA', label: 'Canada' },
];

const ACTORS = [
  { value: '', label: 'All Actors' },
  { value: '2524', label: 'Tom Hardy' },
  { value: '6193', label: 'Leonardo DiCaprio' },
  { value: '3223', label: 'Robert Downey Jr.' },
  { value: '1245', label: 'Scarlett Johansson' },
  { value: '287', label: 'Brad Pitt' },
  { value: '234352', label: 'Margot Robbie' },
  { value: '30614', label: 'Ryan Gosling' },
  { value: '2037', label: 'Cillian Murphy' },
];

const DIRECTORS = [
  { value: '', label: 'All Directors' },
  { value: '525', label: 'Christopher Nolan' },
  { value: '138', label: 'Quentin Tarantino' },
  { value: '488', label: 'Steven Spielberg' },
  { value: '1032', label: 'Martin Scorsese' },
  { value: '13742', label: 'Denis Villeneuve' },
  { value: '2710', label: 'James Cameron' },
  { value: '578', label: 'Ridley Scott' },
];

const MOVIE_GENRES = [
  { id: 'all', label: 'All' },
  { id: 16, label: 'Animation' },
  { id: 28, label: 'Action' },
  { id: 12, label: 'Adventure' },
  { id: 10749, label: 'Romance' },
  { id: 14, label: 'Fantasy' },
  { id: 35, label: 'Comedy' },
  { id: 18, label: 'Drama' },
  { id: 53, label: 'Thriller' },
  { id: 9648, label: 'Mystery' },
  { id: 36, label: 'History' },
  { id: 27, label: 'Horror' },
];

const TV_GENRES = [
  { id: 'all', label: 'All' },
  { id: 16, label: 'Animation' },
  { id: 35, label: 'Comedy' },
  { id: 18, label: 'Drama' },
  { id: 10759, label: 'Action & Adventure' },
  { id: 10765, label: 'Sci-Fi & Fantasy' },
  { id: 80, label: 'Crime' },
  { id: 9648, label: 'Mystery' },
  { id: 10751, label: 'Family' },
  { id: 10762, label: 'Kids' },
  { id: 99, label: 'Documentary' },
];

function AdvanceSearch({ mediaType = 'movie', onSearch }) {
  const [year, setYear] = useState('');
  const [country, setCountry] = useState('');
  const [actor, setActor] = useState('');
  const [director, setDirector] = useState('');
  const [query, setQuery] = useState('');
  const [activeGenre, setActiveGenre] = useState('all');

  // Trigger search whenever any filter changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch?.({
        year,
        country,
        actor,
        director,
        query,
        genre: activeGenre === 'all' ? '' : activeGenre,
      });
    }, 300); // 300ms debounce to prevent spamming API on keypress

    return () => clearTimeout(timeoutId);
  }, [year, country, actor, director, query, activeGenre, onSearch]);

  // Reset genre filter if media type changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveGenre('all');
  }, [mediaType]);

  const genres = mediaType === 'movie' ? MOVIE_GENRES : TV_GENRES;

  return (
    <div className={styles.container}>
      {/* Badge Tab */}
      <div className={styles.badge}>Advance Search</div>

      {/* Main card inner grid */}
      <div className={styles.card}>
        {/* Left Side: Camera Illustration */}
        <div className={styles.illustration}>
          <img src={searchLogo} alt="Camera Illustration" className={styles.cameraImg} />
        </div>

        {/* Right Side: Filters & Inputs */}
        <div className={styles.formContainer}>
          {/* Dropdown filters grid */}
          <div className={styles.dropdownsGrid}>
            <div className={styles.selectGroup}>
              <span className={styles.label}>Year</span>
              <CustomSelect value={year} options={YEARS} onChange={setYear} />
            </div>

            <div className={styles.selectGroup}>
              <span className={styles.label}>Country</span>
              <CustomSelect value={country} options={COUNTRIES} onChange={setCountry} />
            </div>

            <div className={styles.selectGroup}>
              <span className={styles.label}>Actor</span>
              <CustomSelect value={actor} options={ACTORS} onChange={setActor} />
            </div>

            <div className={styles.selectGroup}>
              <span className={styles.label}>Director</span>
              <CustomSelect value={director} options={DIRECTORS} onChange={setDirector} />
            </div>
          </div>

          {/* Search bar input field */}
          <div className={styles.searchbarContainer}>
            <input
              type="text"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={styles.searchInput}
            />
            <div className={styles.searchIconWrapper}>
              <Search className={styles.searchIcon} size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Genre Pills list at the bottom */}
      <div className={styles.pillsContainer}>
        <GenrePills genres={genres} activeGenre={activeGenre} onSelect={setActiveGenre} />
      </div>
    </div>
  );
}

export default AdvanceSearch;
