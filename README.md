# Omni — Movie & Series Discovery App

Omni is a React-based movie and TV series discovery web app built with Vite. It pulls live data from the TMDB (The Movie Database) API to let users browse trending titles, explore movies and series by genre, view curated collections, and manage a personal watchlist, all wrapped in a custom UI translated from a Figma design.

## Features

- **Home feed** with a hero banner, trending titles, movie and series rows, curated collections, a "Continue Watching" section, cast/character highlights, and a kids-friendly banner
- **Genre-based discovery** for both movies and TV series using TMDB's discover endpoint
- **Advance search** page for filtering titles by custom criteria
- **Collections** browsing, including a full collection list page and a single collection detail page
- **Kids mode** with its own hero, suggestions, most-viewed titles, and popular characters, separated from the main experience
- **Watch Now / Video Player pages** for viewing details before playback and a dedicated player view
- **Persistent watchlist** stored in `localStorage`, so saved titles remain after a page refresh
- **Light/dark theme toggle**, persisted in `localStorage` and applied through a `data-theme` attribute driven by a CSS design token system
- **Login page** UI
- Custom in-house components (no UI library): buttons, custom select, genre pills, movie cards, scrollable rows, section headers/layouts, etc.

## Tech Stack

| Layer | Technology |
|---|---|
| UI library | React 19 |
| Build tool | Vite |
| State management | Zustand |
| Styling | CSS Modules with a shared design token file (`src/styles/tokens.css`) |
| Icons | lucide-react |
| Data source | TMDB API (The Movie Database) |
| Linting | ESLint |

Note on routing: navigation is currently handled through a Zustand store (`useNavigationStore`) rather than React Router, even though `react-router-dom` is listed as a dependency. This reflects an in-progress migration; see the Roadmap section below.

## Project Structure

```
src/
  api/                 TMDB API client (src/api/tmdbClient.js)
  assets/              Images, icons, avatars, studio logos
  components/
    common/             Shared UI: Button, MovieCard, ScrollRow, SectionHeader,
                         SectionLayout, GenrePills, CustomSelect, AdvanceSearch
    home/                Home page sections: Hero, Trends, Movies, Series, Pricing,
                         Collections, ContinueWatching, Characters, KidsBanner,
                         GoldenGlobeBanner, FrequentQueries
    kids/                Kids mode sections: KidsHero, KidsSuggestions, MostViewed,
                         OmniKidsBanner, PopularCharacters, LiveSuggestionsBanner, TheBest
    layout/              Navbar, Footer, MediaPageLayout
  constants/            Static data (e.g. collectionsData.js)
  hooks/                Data-fetching hooks (useTrending, useCharacters, useCollections,
                         useContinueWatching, useDiscoverByGenre, useKidsContent)
  pages/                Route-level pages: HomePage, MoviesPage, SeriesPage, KidsPage,
                         AdvanceSearchPage, CollectionListPage, SingleCollectionPage,
                         WatchNowPage, VideoPlayerPage, LoginPage
  store/                Zustand stores: useNavigationStore, useThemeStore, useWatchlistStore
  styles/               Design tokens (tokens.css)
  App.jsx               Root component, page switcher
  main.jsx              App entry point
```

## Getting Started

### Prerequisites

- Node.js (version 18 or later recommended)
- npm
- A free TMDB API key (create an account at themoviedb.org and generate one from your account settings)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/zujajahbatool/movieinsight-app.git
   cd movieinsight-app
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up environment variables

   Create a `.env.local` file in the project root and add your TMDB API key:
   ```
   VITE_MOVIE_API_KEY=your_tmdb_api_key_here
   ```
   Restart the dev server after adding or changing this file, since Vite only reads env files on startup.

4. Run the development server
   ```
   npm run dev
   ```
   The app will be available at the local URL Vite prints in the terminal (typically `http://localhost:5173`).

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the Vite development server with hot module reload |
| `npm run build` | Builds the app for production |
| `npm run preview` | Serves the production build locally for testing |
| `npm run lint` | Runs ESLint across the project |

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_MOVIE_API_KEY` | Your TMDB API key, required for all data fetching. The app throws a clear error if this is missing. |

## Design

The UI is built from a Figma community file, translated into React components and CSS Modules with a shared design token system (colors, spacing, typography) defined in `src/styles/tokens.css`. Light and dark themes are handled through the same token file using a `data-theme` attribute on the document root.

## Roadmap

- Migrate page navigation from the current Zustand-based page switcher to `react-router-dom`, which is already installed
- Expand watchlist functionality (dedicated watchlist page/view)
- Wire up the login page to real authentication

## Acknowledgements

- Movie and TV data provided by [TMDB](https://www.themoviedb.org/). This product uses the TMDB API but is not endorsed or certified by TMDB.
- UI design sourced from a Figma community file

## Author

Zujajah Batool
