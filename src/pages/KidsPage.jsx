import KidsHero from '../components/kids/KidsHero/KidsHero';
import KidsSuggestions from '../components/kids/KidsSuggestions/KidsSuggestions';
import TheBest from '../components/kids/TheBest/TheBest';
import OmniKidsBanner from '../components/kids/OmniKidsBanner/OmniKidsBanner';
import PopularCharacters from '../components/kids/PopularCharacters/PopularCharacters';
import LiveSuggestionsBanner from '../components/kids/LiveSuggestionsBanner/LiveSuggestionsBanner';
import MostViewed from '../components/kids/MostViewed/MostViewed';

function KidsPage() {
  return (
    <div className="kids-page" style={{ paddingBottom: '3rem' }}>
      {/* 1. Hero Section */}
      <KidsHero />

      {/* Main page content area */}
      <div style={{ maxWidth: '1232px', margin: '0 auto', padding: '0 clamp(1rem, 2vw, 1.75rem)' }}>
        {/* 2. Suggestions Component */}
        <KidsSuggestions />

        {/* 3. The Best Component */}
        <TheBest />
      </div>

      {/* 4. Omni Kid Banner */}
      <OmniKidsBanner />

      <div style={{ maxWidth: '1232px', margin: '0 auto', padding: '0 clamp(1rem, 2vw, 1.75rem)' }}>
        {/* 5. Popular Characters Component */}
        <PopularCharacters />

        {/* 6. Live Suggestions Banner Component */}
        <LiveSuggestionsBanner />

        {/* 7. Most Viewed Component */}
        <MostViewed />
      </div>
    </div>
  );

}

export default KidsPage;
