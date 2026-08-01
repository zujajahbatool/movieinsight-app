import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Share2, Settings, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';
import { tmdb, getBackdropUrl } from '../api/tmdbClient';
import { useNavigationStore } from '../store/useNavigationStore';
import styles from './VideoPlayerPage.module.css';

// Curated stock movie trailers as fallbacks if no YouTube trailer is found
const STOCK_TRAILERS = {
  kids: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  standard: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
};

// custom SVG Icons matching Figma design
const Rewind10Icon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={styles.centerIcon}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <text x="12" y="15" fontSize="7" fontWeight="900" fill="currentColor" textAnchor="middle" stroke="none" fontFamily="system-ui, sans-serif">10</text>
  </svg>
);

const Forward10Icon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={styles.centerIcon}>
    <path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <text x="12" y="15" fontSize="7" fontWeight="900" fill="currentColor" textAnchor="middle" stroke="none" fontFamily="system-ui, sans-serif">10</text>
  </svg>
);

const CenterPlayIcon = () => (
  <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.playTriangleIcon}>
    <circle cx="36" cy="36" r="32" fill="#228EE5" fillOpacity="0.25" stroke="#228EE5" strokeWidth="2" />
    <path d="M48 36L28 48V24L48 36Z" fill="#228EE5" />
  </svg>
);

const CenterPauseIcon = () => (
  <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.playTriangleIcon}>
    <circle cx="36" cy="36" r="32" fill="#228EE5" fillOpacity="0.25" stroke="#228EE5" strokeWidth="2" />
    <rect x="27" y="24" width="5" height="24" rx="1" fill="#228EE5" />
    <rect x="40" y="24" width="5" height="24" rx="1" fill="#228EE5" />
  </svg>
);

const PiPIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.topRightIcon}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <rect x="13" y="12" width="7" height="6" rx="1" fill="currentColor" fillOpacity="0.3" />
  </svg>
);

const SlidersIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.topRightIcon}>
    <line x1="4" y1="21" x2="4" y2="14" />
    <line x1="4" y1="10" x2="4" y2="3" />
    <line x1="12" y1="21" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12" y2="3" />
    <line x1="20" y1="21" x2="20" y2="16" />
    <line x1="20" y1="12" x2="20" y2="3" />
    <line x1="2" y1="14" x2="6" y2="14" />
    <line x1="10" y1="8" x2="14" y2="8" />
    <line x1="18" y1="16" x2="22" y2="16" />
  </svg>
);

function VideoPlayerPage() {
  const { watchNowId, watchNowType, isKidsWatch, previousPage, setPage } = useNavigationStore();

  const [details, setDetails] = useState(null);
  const [ytKey, setYtKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Unified video playback states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(120); // Fallback total duration in seconds
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Controls UI visibility
  const [showControls, setShowControls] = useState(true);

  // Tooltip seek states
  const [showTooltip, setShowTooltip] = useState(false);
  const [hoverTime, setHoverTime] = useState(0);
  const [tooltipLeft, setTooltipLeft] = useState(0);

  // References
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const ytPlayerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const playerContainerId = 'yt-player-element';

  // Load YouTube Player API script helper
  const loadYoutubeAPI = (callback) => {
    if (window.YT && window.YT.Player) {
      callback();
      return;
    }
    if (!document.getElementById('yt-iframe-api-script')) {
      const tag = document.createElement('script');
      tag.id = 'yt-iframe-api-script';
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
    
    if (!window.onYouTubeIframeAPIReadyCallbacks) {
      window.onYouTubeIframeAPIReadyCallbacks = [];
      window.onYouTubeIframeAPIReady = () => {
        window.onYouTubeIframeAPIReadyCallbacks.forEach((cb) => cb());
      };
    }
    window.onYouTubeIframeAPIReadyCallbacks.push(callback);
  };

  // Fetch TMDB Movie/Show details and videos
  useEffect(() => {
    let active = true;

    async function fetchVideoData() {
      if (!watchNowId) return;
      setLoading(true);
      setError(null);
      setYtKey(null);

      try {
        const isMovie = watchNowType === 'movie';
        const [detailsData, videosData] = await Promise.all([
          isMovie ? tmdb.movieDetails(watchNowId) : tmdb.tvDetails(watchNowId),
          isMovie ? tmdb.movieVideos(watchNowId) : tmdb.tvVideos(watchNowId),
        ]);

        if (active) {
          setDetails(detailsData);
          
          // Try to find a YouTube trailer or clip
          const results = videosData.results || [];
          const trailer = results.find(
            (v) => v.site === 'YouTube' && v.type === 'Trailer' && v.key
          ) || results.find(
            (v) => v.site === 'YouTube' && v.key
          );

          if (trailer) {
            setYtKey(trailer.key);
          } else {
            console.log('No YouTube video trailer found, falling back to stock MP4.');
          }
          setLoading(false);
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Failed to fetch video details.');
          setLoading(false);
        }
      }
    }

    fetchVideoData();

    return () => {
      active = false;
    };
  }, [watchNowId, watchNowType]);

  // Instantiate YouTube player if ytKey is available
  useEffect(() => {
    if (loading || error || !ytKey) return;

    let playerInstance = null;

    loadYoutubeAPI(() => {
      // Small timeout to ensure DOM container is rendered
      setTimeout(() => {
        const container = document.getElementById(playerContainerId);
        if (!container) return;

        playerInstance = new window.YT.Player(playerContainerId, {
          videoId: ytKey,
          playerVars: {
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            iv_load_policy: 3,
            autoplay: 1,
            mute: isMuted ? 1 : 0,
          },
          events: {
            onReady: (event) => {
              ytPlayerRef.current = event.target;
              setDuration(event.target.getDuration() || 120);
              event.target.setVolume(isMuted ? 0 : volume);
              event.target.playVideo();
              setIsPlaying(true);
            },
            onStateChange: (event) => {
              const state = event.data;
              if (state === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true);
                // Sync total duration if available
                if (event.target.getDuration()) {
                  setDuration(event.target.getDuration());
                }
              } else if (state === window.YT.PlayerState.PAUSED) {
                setIsPlaying(false);
              } else if (state === window.YT.PlayerState.ENDED) {
                setIsPlaying(false);
                setCurrentTime(0);
              }
            },
          },
        });
      }, 50);
    });

    return () => {
      if (playerInstance && playerInstance.destroy) {
        playerInstance.destroy();
      }
      ytPlayerRef.current = null;
    };
  }, [ytKey, loading, error]);

  // Timer loop to track playback time for YouTube or HTML5 Video
  useEffect(() => {
    let timer = null;

    if (isPlaying) {
      timer = setInterval(() => {
        if (ytKey && ytPlayerRef.current) {
          setCurrentTime(ytPlayerRef.current.getCurrentTime() || 0);
        } else if (videoRef.current) {
          setCurrentTime(videoRef.current.currentTime || 0);
        }
      }, 250);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, ytKey]);

  // Synchronize mute/volume shifts to media elements
  useEffect(() => {
    if (ytKey && ytPlayerRef.current) {
      if (isMuted) {
        ytPlayerRef.current.mute();
      } else {
        ytPlayerRef.current.unMute();
        ytPlayerRef.current.setVolume(volume);
      }
    } else if (videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current.volume = volume / 100;
    }
  }, [volume, isMuted, ytKey]);

  // Idle timer to hide controls
  const resetControlsTimeout = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  useEffect(() => {
    resetControlsTimeout();
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlaying]);

  // Handle Play/Pause
  const handlePlayPause = () => {
    if (ytKey && ytPlayerRef.current) {
      if (isPlaying) {
        ytPlayerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        ytPlayerRef.current.playVideo();
        setIsPlaying(true);
      }
    } else if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  // Rewind 10 seconds
  const handleRewind = () => {
    const target = Math.max(0, currentTime - 10);
    setCurrentTime(target);
    if (ytKey && ytPlayerRef.current) {
      ytPlayerRef.current.seekTo(target, true);
    } else if (videoRef.current) {
      videoRef.current.currentTime = target;
    }
  };

  // Fast-forward 10 seconds
  const handleForward = () => {
    const target = Math.min(duration, currentTime + 10);
    setCurrentTime(target);
    if (ytKey && ytPlayerRef.current) {
      ytPlayerRef.current.seekTo(target, true);
    } else if (videoRef.current) {
      videoRef.current.currentTime = target;
    }
  };

  // Drag seek bar
  const handleSeek = (e) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (ytKey && ytPlayerRef.current) {
      ytPlayerRef.current.seekTo(val, true);
    } else if (videoRef.current) {
      videoRef.current.currentTime = val;
    }
  };

  // Hover seek bar (for floating preview)
  const handleTimelineMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const posX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, posX / rect.width));
    setHoverTime(pct * duration);
    setTooltipLeft(pct * 100);
  };

  // Volume bar drag
  const handleVolumeChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setVolume(val);
    if (val > 0) {
      setIsMuted(false);
    }
  };

  // Mute toggle
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Toggle Screen Fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(err => console.log('Fullscreen failed:', err));
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Update fullscreen state when triggered natively (e.g. Esc key)
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
    };
  }, []);

  // Format seconds to HH:MM:SS
  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) return '00:00:00';
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const remainder = Math.floor(secs % 60);
    
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(hrs)}:${pad(remainder)}:${pad(remainder)}`; // Wait! remainder is twice? Ah! Should be pad(mins) and pad(remainder)! Let's correct this.
  };

  // Let's fix formatTime implementation:
  const formatTimeFixed = (secs) => {
    if (isNaN(secs) || secs < 0) return '00:00:00';
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const remainder = Math.floor(secs % 60);
    
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(hrs)}:${pad(mins)}:${pad(remainder)}`;
  };

  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.spinner} />
        <p>Pre-buffering trailer content...</p>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className={styles.loadingScreen}>
        <p>Failed to load video content: {error || 'Content not found'}</p>
        <button
          type="button"
          onClick={() => setPage(previousPage || 'home')}
          className={styles.backLink}
        >
          <ArrowLeft size={16} /> Return to previous page
        </button>
      </div>
    );
  }

  const title = details.title || details.name || 'Cinematic Preview';
  const backdropUrl = getBackdropUrl(details.backdrop_path || details.poster_path, 'w780') || 
                      getBackdropUrl(details.backdrop_path || details.poster_path, 'original');

  const fallbackVideoSrc = isKidsWatch ? STOCK_TRAILERS.kids : STOCK_TRAILERS.standard;

  // Percentage for seek timeline track fill
  const playedPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className={styles.playerContainer}
      onMouseMove={resetControlsTimeout}
      onClick={resetControlsTimeout}
    >
      {/* ===== BADGE IN VERY TOP-LEFT ===== */}
      <div className={styles.playingBadge}>Playing</div>

      {/* ===== VIDEO ELEMENT ===== */}
      {ytKey ? (
        <div className={styles.iframeWrapper}>
          {/* Iframe target placeholder */}
          <div id={playerContainerId} className={styles.youtubeIframe} />
          {/* Invisible overlay so click controls work on player click */}
          <div className={styles.videoClickOverlay} onClick={handlePlayPause} />
        </div>
      ) : (
        <video
          ref={videoRef}
          src={fallbackVideoSrc}
          className={styles.htmlVideo}
          onClick={handlePlayPause}
          autoPlay
          playsInline
          onLoadedMetadata={() => setDuration(videoRef.current?.duration || 120)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => {
            setIsPlaying(false);
            setCurrentTime(0);
          }}
        />
      )}

      {/* ===== CONTROL OVERLAYS ===== */}
      <div
        className={[
          styles.controlsScrim,
          showControls ? styles.controlsShow : styles.controlsHide,
        ].join(' ')}
      >
        {/* TOP ACTION BAR */}
        <div className={styles.topBar}>
          <div className={styles.topBarLeft}>
            <button
              type="button"
              className={styles.backBtn}
              onClick={() => setPage(previousPage || 'home')}
              title="Go Back"
            >
              <ArrowLeft size={20} />
            </button>
            <span className={styles.movieTitle}>{title}</span>
          </div>

          <div className={styles.topBarRight}>
            <button type="button" className={styles.navIconBtn} title="Share">
              <Share2 size={20} />
            </button>
            <button type="button" className={styles.navIconBtn} title="Picture in Picture">
              <PiPIcon />
            </button>
            <button type="button" className={styles.navIconBtn} title="Equalizer Settings">
              <SlidersIcon />
            </button>
            <button type="button" className={styles.navIconBtn} title="Playback Settings">
              <Settings size={20} />
            </button>
          </div>
        </div>

        {/* CENTER PLAYER CONTROLS */}
        <div className={styles.centerControls}>
          <button
            type="button"
            className={styles.centerCtrlBtn}
            onClick={handleRewind}
            title="Rewind 10s"
          >
            <Rewind10Icon />
          </button>

          <button
            type="button"
            className={styles.centerPlayBtn}
            onClick={handlePlayPause}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <CenterPauseIcon /> : <CenterPlayIcon />}
          </button>

          <button
            type="button"
            className={styles.centerCtrlBtn}
            onClick={handleForward}
            title="Fast Forward 10s"
          >
            <Forward10Icon />
          </button>
        </div>

        {/* BOTTOM CONTROLS & TIMELINE */}
        <div className={styles.bottomBar}>
          {/* Timeline Range Container */}
          <div
            className={styles.timelineContainer}
            onMouseMove={handleTimelineMouseMove}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            {/* Custom hover tooltip */}
            {showTooltip && (
              <div
                className={styles.tooltip}
                style={{ left: `${tooltipLeft}%` }}
              >
                <div className={styles.tooltipThumbnail}>
                  {backdropUrl ? (
                    <img
                      src={backdropUrl}
                      alt="Preview"
                      className={styles.tooltipImg}
                    />
                  ) : (
                    <div className={styles.tooltipImgFallback} />
                  )}
                </div>
                <span className={styles.tooltipTime}>
                  {formatTimeFixed(hoverTime)}
                </span>
              </div>
            )}

            {/* Seeking track range input */}
            <input
              type="range"
              min="0"
              max={duration}
              step="0.1"
              value={currentTime}
              onChange={handleSeek}
              className={styles.timeline}
              style={{
                background: `linear-gradient(to right, var(--accent-blue) 0%, var(--accent-blue) ${playedPercentage}%, rgba(255, 255, 255, 0.25) ${playedPercentage}%, rgba(255, 255, 255, 0.25) 100%)`,
              }}
            />
          </div>

          {/* Bottom actions under timeline */}
          <div className={styles.bottomActions}>
            <div className={styles.bottomLeftActions}>
              {/* Speaker & volume row */}
              <div className={styles.volumeWrapper}>
                <button
                  type="button"
                  onClick={toggleMute}
                  className={styles.actionBtn}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className={styles.volumeSlider}
                  title={`Volume: ${isMuted ? 0 : volume}%`}
                />
              </div>

              {/* Playback time */}
              <span className={styles.timeLabel}>
                {formatTimeFixed(currentTime)}
              </span>
            </div>

            <div className={styles.bottomActionsCenter}>
              {/* A seek tooltip time placeholder in the middle or just keep standard layout */}
            </div>

            <div className={styles.bottomRightActions}>
              {/* Total Duration time */}
              <span className={styles.timeLabel}>
                {formatTimeFixed(duration)}
              </span>

              {/* Fullscreen Button */}
              <button
                type="button"
                onClick={toggleFullscreen}
                className={styles.actionBtn}
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoPlayerPage;
