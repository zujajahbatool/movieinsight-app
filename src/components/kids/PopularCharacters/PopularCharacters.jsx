import ScrollRow from '../../common/ScrollRow/ScrollRow';
import MovieCard from '../../common/MovieCard/MovieCard';
import styles from './PopularCharacters.module.css';

// Predefined character-centric poster paths from TMDB
const POPULAR_CHARACTERS = [
  {
    id: 'char-tomjerry',
    name: 'Tom & Jerry',
    posterUrl: 'https://www.themoviedb.org/t/p/w600_and_h900_face/pApniCXhegDnhxQda7RcpG8gFP0.jpg', 
    rating: 8.5,
    genre: 'Tom & Jerry',

  },
  {
    id: 'char-anger',
    name: 'Anger',
    posterUrl: 'https://image.tmdb.org/t/p/w342/2H1TmgdfNtsKlU9jKdeNyYL5y8T.jpg', // Inside Out
    rating: 8.9,
    genre: 'Inside Out',
  },
  {
    id: 'char-elsa',
    name: 'Elsa',
    posterUrl: 'https://image.tmdb.org/t/p/w342/mINJaa34MtknCYl5AjtNJzWj8cD.jpg', // Frozen II
    rating: 9.0,
    genre: 'Frozen II',
  },
  {
    id: 'char-moana',
    name: 'Moana',
    posterUrl: 'https://image.tmdb.org/t/p/w342/zKVgiv5qHCvCLT4A2ymJi5QeXDH.jpg', // Moana
    rating: 8.8,
    genre: 'Moana',
  },
  {
    id: 'char-vanellope',
    name: 'Vanellope',
    posterUrl: 'https://image.tmdb.org/t/p/w342/ihfvxPh5C4rV2WSKWs7k7rzxzzO.jpg', // Wreck-It Ralph
    rating: 8.6,
    genre: 'Wreck-It Ralph',
  },
  {
    id: 'char-boss-baby',
    name: 'Boss Baby',
    posterUrl: 'https://image.tmdb.org/t/p/w342/9MsQJKe4cUAGxc7R2NGaFQLqOPc.jpg', // The Boss Baby
    rating: 8.2,
    genre: 'The Boss Baby',
  },
];

import { useNavigationStore } from '../../../store/useNavigationStore';

const CHARACTER_MOVIE_MAP = {
  'char-tomjerry': 587807, // Tom & Jerry (2021)
  'char-anger': 150540,    // Inside Out
  'char-elsa': 490132,     // Frozen II
  'char-moana': 277834,    // Moana
  'char-vanellope': 82690, // Wreck-It Ralph
  'char-boss-baby': 295693, // The Boss Baby
};

function PopularCharacters() {
  const setWatchNow = useNavigationStore((state) => state.setWatchNow);

  const handleSeeMore = () => {
    console.log('Navigate to Popular Characters See More');
  };

  return (
    <div className={styles.characters}>
      <ScrollRow title="Popular Character" onSeeMore={handleSeeMore}>
        {POPULAR_CHARACTERS.map((char) => (
          <MovieCard
            key={char.id}
            title={char.name}
            posterUrl={char.posterUrl}
            rating={char.rating}
            genre={char.genre}
            variant="simple"
            onClick={() => {
              const movieId = CHARACTER_MOVIE_MAP[char.id];
              if (movieId) {
                setWatchNow(movieId, 'movie', true);
              }
            }}
          />
        ))}
      </ScrollRow>
    </div>
  );
}

export default PopularCharacters;
