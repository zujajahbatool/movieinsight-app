import { useState, useEffect } from 'react';
import { Bookmark, ThumbsUp, ThumbsDown, Play, ArrowRight } from 'lucide-react';
import { tmdb, getBackdropUrl, getPosterUrl } from '../api/tmdbClient';
import { useNavigationStore } from '../store/useNavigationStore';
import { useWatchlistStore } from '../store/useWatchlistStore';
import MovieCard from '../components/common/MovieCard/MovieCard';
import ScrollRow from '../components/common/ScrollRow/ScrollRow';
import Button from '../components/common/Button/Button';
import ProfileCard from '../components/home/Characters/ProfileCard';
import styles from './WatchNowPage.module.css';

const MOCK_AVATARS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&h=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=80&h=80',
  'https://images.unsplash.com/photo-1489980508314-941910ded1f4?auto=format&fit=crop&w=80&h=80',
];

const INITIAL_MOCK_COMMENTS = [
  {
    id: 1,
    author: 'Noah2145',
    avatar: MOCK_AVATARS[0],
    content: 'that was perfect',
    likes: 3,
    dislikes: 0,
    userLiked: false,
    userDisliked: false,
  },
  {
    id: 2,
    author: 'William',
    avatar: MOCK_AVATARS[1],
    content: 'that was perfect',
    likes: 2,
    dislikes: 1,
    userLiked: false,
    userDisliked: false,
  },
  {
    id: 3,
    author: 'Arashzarei109',
    avatar: MOCK_AVATARS[2],
    content: 'that was perfect',
    likes: 0,
    dislikes: 1,
    userLiked: false,
    userDisliked: false,
  },
  {
    id: 4,
    author: 'Arashzarei109',
    avatar: MOCK_AVATARS[3],
    content: 'that was perfect',
    likes: 0,
    dislikes: 0,
    userLiked: false,
    userDisliked: false,
  },
  {
    id: 5,
    author: 'Arashzarei109',
    avatar: MOCK_AVATARS[4],
    content: 'that was perfect',
    likes: 0,
    dislikes: 1,
    userLiked: false,
    userDisliked: false,
  },
];

function WatchNowPage() {
  const { watchNowId, watchNowType, isKidsWatch, setWatchNow, setPage, playVideo } = useNavigationStore();
  const { watchlist, toggleMovie } = useWatchlistStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [details, setDetails] = useState(null);
  const [credits, setCredits] = useState(null);
  const [images, setImages] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  
  // Likes and dislikes states
  const [pageLiked, setPageLiked] = useState(false);
  const [pageDisliked, setPageDisliked] = useState(false);
  const [comments, setComments] = useState(INITIAL_MOCK_COMMENTS);

  useEffect(() => {
    let active = true;

    async function loadWatchNowData() {
      if (!watchNowId) return;
      setLoading(true);
      setError(null);
      
      try {
        const isMovie = watchNowType === 'movie';
        
        // Parallel requests
        const [detailsData, creditsData, imagesData, suggestionsData] = await Promise.all([
          isMovie ? tmdb.movieDetails(watchNowId) : tmdb.tvDetails(watchNowId),
          isMovie ? tmdb.movieCredits(watchNowId) : tmdb.tvCredits(watchNowId),
          isMovie ? tmdb.movieImages(watchNowId) : tmdb.tvImages(watchNowId),
          isMovie ? tmdb.movieRecommendations(watchNowId) : tmdb.tvRecommendations(watchNowId),
        ]);

        if (active) {
          setDetails(detailsData);
          setCredits(creditsData);
          setImages(imagesData);
          setSuggestions(suggestionsData.results || []);
          setLoading(false);
          // reset local like/dislike states on title change
          setPageLiked(false);
          setPageDisliked(false);
          setComments(INITIAL_MOCK_COMMENTS.map((c) => ({
            ...c,
            // make comments slightly dynamic by using actual keywords if available
            content: detailsData.title || detailsData.name 
              ? `that was perfect. I loved how they did the ending!` 
              : 'that was perfect',
          })));
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Failed to load details');
          setLoading(false);
        }
      }
    }

    loadWatchNowData();

    return () => {
      active = false;
    };
  }, [watchNowId, watchNowType]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Fetching content details...</p>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className={styles.loadingContainer}>
        <p>Something went wrong: {error || 'Title not found'}</p>
      </div>
    );
  }

  const title = details.title || details.name || '';
  const backdropUrl = getBackdropUrl(details.backdrop_path || details.poster_path, 'original');
  const isSaved = watchlist.includes(watchNowId);

  // Meta information
  const releaseDate = details.release_date || details.first_air_date || '';
  const releaseYear = releaseDate ? releaseDate.substring(0, 4) : '';
  const country = details.production_countries?.[0]?.name || details.production_countries?.[0]?.iso_3166_1 || details.origin_country?.[0] || 'USA';
  
  const formatRuntime = (mins) => {
    if (!mins) return '';
    const hrs = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return hrs > 0 ? `${hrs}h ${remainingMins}m` : `${remainingMins}m`;
  };

  const durationText = watchNowType === 'movie' 
    ? formatRuntime(details.runtime) 
    : details.number_of_seasons 
      ? `${details.number_of_seasons} Season${details.number_of_seasons > 1 ? 's' : ''}` 
      : '';

  const rating = details.vote_average || 7.0;

  // Star calculation
  const renderStars = (voteAverage) => {
    const filledStarsCount = Math.round(voteAverage / 2);
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={[
            styles.hero__star,
            i <= filledStarsCount ? styles['hero__star--filled'] : '',
          ].join(' ')}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  // Screen captures (Movie & TV images)
  const getScreenCaptures = () => {
    let list = (images?.backdrops || []).slice(0, 5).map(img => getBackdropUrl(img.file_path, 'w780'));
    // Fallbacks if not enough screenshots
    if (list.length < 5) {
      if (details.backdrop_path) {
        const fullB = getBackdropUrl(details.backdrop_path, 'w780');
        if (!list.includes(fullB)) list.push(fullB);
      }
      const posterB = getPosterUrl(details.poster_path, 'w780');
      while (list.length < 5 && posterB) {
        list.push(posterB);
      }
    }
    return list.slice(0, 5);
  };

  const screenshotsList = getScreenCaptures();

  // Cast & Director
  const castList = (credits?.cast || []).slice(0, 8);
  const directorPerson = (credits?.crew || []).find(c => c.job === 'Director') || 
                         (credits?.crew || []).find(c => c.department === 'Directing') || 
                         (details?.created_by?.[0]) || null;

  // Handle page like/dislike clicks
  const handlePageLike = () => {
    if (pageLiked) {
      setPageLiked(false);
    } else {
      setPageLiked(true);
      setPageDisliked(false);
    }
  };

  const handlePageDislike = () => {
    if (pageDisliked) {
      setPageDisliked(false);
    } else {
      setPageDisliked(true);
      setPageLiked(false);
    }
  };

  // Comment Likes / Dislikes Handlers
  const handleCommentLike = (id) => {
    setComments(prev => prev.map(c => {
      if (c.id === id) {
        const active = c.userLiked;
        return {
          ...c,
          userLiked: !active,
          likes: active ? c.likes - 1 : c.likes + 1,
          userDisliked: false,
          dislikes: c.userDisliked ? c.dislikes - 1 : c.dislikes
        };
      }
      return c;
    }));
  };

  const handleCommentDislike = (id) => {
    setComments(prev => prev.map(c => {
      if (c.id === id) {
        const active = c.userDisliked;
        return {
          ...c,
          userDisliked: !active,
          dislikes: active ? c.dislikes - 1 : c.dislikes + 1,
          userLiked: false,
          likes: c.userLiked ? c.likes - 1 : c.likes
        };
      }
      return c;
    }));
  };

  return (
    <div className={styles.page}>
      {/* ===== HERO BANNER SECTION ===== */}
      <section className={styles.hero}>
        {backdropUrl && (
          <div
            className={styles.hero__backdrop}
            style={{ backgroundImage: `url('${backdropUrl}')` }}
          />
        )}
        <div className={styles.hero__scrim} />
        
        <div className={[
          styles.hero__content,
          isKidsWatch ? styles['hero__content--kids'] : styles['hero__content--standard']
        ].join(' ')}>
          <div className={styles.hero__details}>
            <h1 className={styles.hero__title}>{title}</h1>
            
            <div className={styles.hero__meta}>
              {durationText && <span>{durationText}</span>}
              {durationText && releaseYear && <span>-</span>}
              {releaseYear && <span>{releaseYear}</span>}
              {country && <span>-</span>}
              {country && <span>{country}</span>}
              
              <div className={styles.hero__stars}>
                {renderStars(rating)}
              </div>
            </div>

            {/* Kids layout shows genre pills on hero */}
            {isKidsWatch && details.genres && (
              <div className={styles.hero__genrePills}>
                {details.genres.slice(0, 2).map((g) => (
                  <span key={g.id} className={styles.hero__genrePill}>
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            {/* Normal Movie/Series: Save/Like/Dislike Action Buttons nested in Hero */}
            {!isKidsWatch && (
              <div className={styles.hero__actions}>
                <Button
                  type="button"
                  variant="unstyled"
                  size="none"
                  className={[
                    styles.actionButton,
                    isSaved ? styles['actionButton--active'] : '',
                  ].join(' ')}
                  onClick={() => toggleMovie(watchNowId)}
                  title={isSaved ? 'Remove from Watchlist' : 'Save to Watchlist'}
                >
                  <Bookmark size={20} fill={isSaved ? 'currentColor' : 'none'} />
                </Button>
                
                <Button
                  type="button"
                  variant="unstyled"
                  size="none"
                  className={[
                    styles.actionButton,
                    pageLiked ? styles['actionButton--liked'] : '',
                  ].join(' ')}
                  onClick={handlePageLike}
                  title="Like"
                >
                  <ThumbsUp size={20} fill={pageLiked ? 'currentColor' : 'none'} />
                </Button>
                
                <Button
                  type="button"
                  variant="unstyled"
                  size="none"
                  className={[
                    styles.actionButton,
                    pageDisliked ? styles['actionButton--disliked'] : '',
                  ].join(' ')}
                  onClick={handlePageDislike}
                  title="Dislike"
                >
                  <ThumbsDown size={20} fill={pageDisliked ? 'currentColor' : 'none'} />
                </Button>
              </div>
            )}
          </div>

          {/* Normal Movie/Series Hero Buttons: Watch Now & Preview */}
          {!isKidsWatch && (
            <div className={styles.hero__buttons}>
              <Button
                type="button"
                variant="primary"
                className={styles.btnPlay}
                onClick={() => playVideo(watchNowId, watchNowType, isKidsWatch)}
                leftIcon={<Play size={20} fill="currentColor" />}
              >
                Watch Now
              </Button>
              <Button
                type="button"
                variant="secondary"
                className={styles.btnPreview}
              >
                Preview
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* ===== KIDS ACTION ROW ===== */}
      {isKidsWatch && (
        <div className={styles.kidsActionBar}>
          <div className={styles.hero__actions}>
            <Button
              type="button"
              variant="unstyled"
              size="none"
              className={[
                styles.actionButton,
                isSaved ? styles['actionButton--active'] : '',
              ].join(' ')}
              onClick={() => toggleMovie(watchNowId)}
              title={isSaved ? 'Remove from Watchlist' : 'Save to Watchlist'}
            >
              <Bookmark size={20} fill={isSaved ? 'currentColor' : 'none'} />
            </Button>
            
            <Button
              type="button"
              variant="unstyled"
              size="none"
              className={[
                styles.actionButton,
                pageLiked ? styles['actionButton--liked'] : '',
              ].join(' ')}
              onClick={handlePageLike}
              title="Like"
            >
              <ThumbsUp size={20} fill={pageLiked ? 'currentColor' : 'none'} />
            </Button>
            
            <Button
              type="button"
              variant="unstyled"
              size="none"
              className={[
                styles.actionButton,
                pageDisliked ? styles['actionButton--disliked'] : '',
              ].join(' ')}
              onClick={handlePageDislike}
              title="Dislike"
            >
              <ThumbsDown size={20} fill={pageDisliked ? 'currentColor' : 'none'} />
            </Button>
          </div>
          
          <Button
            type="button"
            variant="primary"
            className={styles.btnPlay}
            onClick={() => playVideo(watchNowId, watchNowType, isKidsWatch)}
          >
            Watch Now
          </Button>
        </div>
      )}

      {/* ===== SCREENSHOTS (MOVIE/SERIES ONLY) ===== */}
      {!isKidsWatch && screenshotsList.length > 0 && (
        <div className={styles.screenshotsSection}>
          <div className={styles.screenshotsRow}>
            {screenshotsList.map((src, index) => (
              <div key={index} className={styles.screenshotCard}>
                <img
                  className={styles.screenshotImg}
                  src={src}
                  alt={`Screenshot ${index + 1}`}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== MAIN BODY CONTENT ===== */}
      <div className={styles.content}>
        
        {/* About Section */}
        <section className={styles.section}>
          <h2 className={isKidsWatch ? styles.sectionTitleKids : styles.sectionTitle}>
            {isKidsWatch ? `About ${title}` : `about ${title}`}
          </h2>
          <p className={styles.description}>
            {details.overview || 'No overview description available at this moment.'}
          </p>
        </section>

        {/* Normal Movie/Series: Genres section */}
        {!isKidsWatch && details.genres && details.genres.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Genres</h2>
            <div className={styles.genreGrid}>
              {details.genres.map((g) => (
                <span key={g.id} className={styles.genrePill}>
                  {g.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Normal Movie/Series: Characters (Cast) grid */}
        {!isKidsWatch && castList.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Characters</h2>
            <div className={styles.profileGrid}>
              {castList.map((person) => (
                <ProfileCard
                  key={person.id}
                  name={person.name}
                  profilePath={person.profile_path}
                />
              ))}
            </div>
          </section>
        )}

        {/* Normal Movie/Series: Director details */}
        {!isKidsWatch && directorPerson && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Director</h2>
            <div className={styles.profileGrid}>
              <ProfileCard
                key={directorPerson.id || directorPerson.name}
                name={directorPerson.name}
                profilePath={directorPerson.profile_path}
              />
            </div>
          </section>
        )}

        {/* Suggestions Row */}
        {suggestions.length > 0 && (
          <div className={styles.section}>
            <ScrollRow
              title={isKidsWatch ? "Suggestion" : `Suggestion like "${title}"`}
              onSeeMore={() => {}}
            >
              {suggestions.slice(0, 12).map((item) => (
                <MovieCard
                  key={item.id}
                  title={item.title || item.name}
                  posterUrl={getPosterUrl(item.poster_path)}
                  rating={item.vote_average}
                  genreIds={item.genre_ids}
                  isAdded={watchlist.includes(item.id)}
                  onAddToggle={() => toggleMovie(item.id)}
                  onClick={() => setWatchNow(item.id, watchNowType, isKidsWatch)}
                />
              ))}
            </ScrollRow>
          </div>
        )}

        {/* Comments Section */}
        <section className={styles.section}>
          <div className={styles.commentsHeader}>
            <h2 className={isKidsWatch ? styles.sectionTitleKids : styles.sectionTitle}>
              Comments
            </h2>
            <a href="#" className={styles.seeMoreLink} onClick={(e) => e.preventDefault()}>
              See More
              <ArrowRight size={14} />
            </a>
          </div>

          <div className={styles.commentsRow}>
            {comments.map((comment) => (
              <div key={comment.id} className={styles.commentCard}>
                <div className={styles.commentUser}>
                  {comment.avatar ? (
                    <img
                      className={styles.commentAvatar}
                      src={comment.avatar}
                      alt={comment.author}
                    />
                  ) : (
                    <div className={styles.commentAvatar} style={{ background: 'var(--color-surface)' }} />
                  )}
                  
                  <div className={styles.commentDetails}>
                    <span className={styles.commentName}>{comment.author}</span>
                  </div>
                </div>

                <p className={styles.commentText}>{comment.content}</p>

                <div className={styles.commentFooter}>
                  <Button
                    type="button"
                    variant="unstyled"
                    size="none"
                    className={[
                      styles.commentLikeBtn,
                      comment.userLiked ? styles['commentLikeBtn--active'] : '',
                    ].join(' ')}
                    onClick={() => handleCommentLike(comment.id)}
                  >
                    👍 {comment.likes}
                  </Button>
                  <Button
                    type="button"
                    variant="unstyled"
                    size="none"
                    className={[
                      styles.commentDislikeBtn,
                      comment.userDisliked ? styles['commentDislikeBtn--active'] : '',
                    ].join(' ')}
                    onClick={() => handleCommentDislike(comment.id)}
                  >
                    👎 {comment.dislikes}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

export default WatchNowPage;
