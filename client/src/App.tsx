// PMO Toolkit Navigator — App Entry
// Design: "Clarity Cards" — Scandinavian Minimalism, warm whites, category color wayfinding
// Fonts: Sora (display) + Inter (body) + JetBrains Mono (code labels)

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import DeckView from "./pages/DeckView";
import CardDetail from "./pages/CardDetail";
import SearchPage from "./pages/SearchPage";
import BookmarksPage from './pages/BookmarksPage';
import DecksPage from './pages/DecksPage';
import JourneyPage from './pages/JourneyPage';
import LessonPage from './pages/LessonPage';
import EarnHeartPage from './pages/EarnHeartPage';
import DecisionHelper from './pages/DecisionHelper';
import AiSuggest from './pages/AiSuggest';
import LearningRoadmap from './pages/LearningRoadmap';
import QuizPage from './pages/QuizPage';
import CaseStudiesPage from './pages/CaseStudiesPage';
import GlossaryPage from './pages/GlossaryPage';
import TemplateLibrary from './pages/TemplateLibrary';
import TemplateFiller from './pages/TemplateFiller';
import HowItWasBuilt from './pages/HowItWasBuilt';
import ReviewPage from './pages/ReviewPage';
import CompareCards from './pages/CompareCards';
import HealthChecker from './pages/HealthChecker';
import MindMap from './pages/MindMap';
import AudioMode from './pages/AudioMode';
import WelcomeModal from './components/WelcomeModal';
import OnboardingTour, { useOnboardingTour } from './components/OnboardingTour';
import { BookmarksProvider } from './contexts/BookmarksContext';
import { AudioProvider } from './contexts/AudioContext';
import AudioPlayerBar from './components/AudioPlayerBar';
import { JourneyProvider } from './contexts/JourneyContext';
import TopNav from './components/TopNav';
import BottomNav from './components/BottomNav';
import { getDeckById, getCardById } from './lib/pmoData';

// Scroll to top on every route change
function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location]);
  return null;
}

  // Show BottomNav on all pages except quiz and lesson (lesson has its own sticky bar)
function GlobalBottomNav() {
  const [location] = useLocation();
  if (location.startsWith('/quiz')) return null;
  if (location.startsWith('/journey/lesson')) return null;
  return (
    <>
      <AudioPlayerBar />
      <BottomNav />
    </>
  );
}

// Show TopNav on all pages except quiz
function GlobalTopNav() {
  const [location] = useLocation();
  if (location.startsWith('/quiz')) return null;

  // Derive accent colour from current route
  let accentColor = '#475569';
  let bgColor: string | undefined;

  const deckMatch = location.match(/^\/deck\/([^/]+)/);
  const cardMatch = location.match(/^\/card\/([^/]+)/);

  if (deckMatch) {
    const deck = getDeckById(deckMatch[1]);
    if (deck) {
      accentColor = deck.color;
      bgColor = deck.bgColor + 'F0'; // 94% opacity
    }
  } else if (cardMatch) {
    const card = getCardById(cardMatch[1]);
    if (card) {
      const deck = getDeckById(card.deckId);
      if (deck) {
        accentColor = deck.color;
        bgColor = deck.bgColor + 'F0';
      }
    }
  }

  return <TopNav accentColor={accentColor} bgColor={bgColor} />;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <GlobalTopNav />
      <GlobalBottomNav />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/deck/:deckId" component={DeckView} />
        <Route path="/card/:cardId" component={CardDetail} />
        <Route path="/decks" component={DecksPage} />
        <Route path="/search" component={SearchPage} />
        <Route path="/bookmarks" component={BookmarksPage} />
        <Route path="/journey" component={JourneyPage} />
        <Route path="/journey/lesson/:day" component={LessonPage} />
        <Route path="/journey/earn-heart" component={EarnHeartPage} />
        <Route path="/decision" component={DecisionHelper} />
        <Route path="/ai-suggest" component={AiSuggest} />
        <Route path="/roadmap" component={LearningRoadmap} />
        <Route path="/quiz/:deckId" component={QuizPage} />
        <Route path="/case-studies" component={CaseStudiesPage} />
        <Route path="/glossary" component={GlossaryPage} />
        <Route path="/templates" component={TemplateLibrary} />
        <Route path="/templates/:cardId" component={TemplateFiller} />
        <Route path="/how-it-was-built" component={HowItWasBuilt} />
        <Route path="/review" component={ReviewPage} />
        <Route path="/compare" component={CompareCards} />
        <Route path="/health" component={HealthChecker} />
        <Route path="/mindmap" component={MindMap} />
        <Route path="/audio" component={AudioMode} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function AppInner() {
  const { showTour, dismissTour } = useOnboardingTour();
  return (
    <>
      <WelcomeModal />
      {showTour && <OnboardingTour onDismiss={dismissTour} />}
      <Router />
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" switchable={true}>
        <AudioProvider>
        <JourneyProvider>
        <BookmarksProvider>
          <TooltipProvider>
            <Toaster />
            <AppInner />
          </TooltipProvider>
        </BookmarksProvider>
        </JourneyProvider>
        </AudioProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
