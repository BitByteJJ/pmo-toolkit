// PMO Toolkit Navigator — App Entry
// Design: "Clarity Cards" — Scandinavian Minimalism, warm whites, category color wayfinding
// Fonts: Sora (display) + Inter (body) + JetBrains Mono (code labels)

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import DeckView from "./pages/DeckView";
import CardDetail from "./pages/CardDetail";
import SearchPage from "./pages/SearchPage";
import BookmarksPage from "./pages/BookmarksPage";
import { BookmarksProvider } from "./contexts/BookmarksContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/deck/:deckId" component={DeckView} />
      <Route path="/card/:cardId" component={CardDetail} />
      <Route path="/search" component={SearchPage} />
      <Route path="/bookmarks" component={BookmarksPage} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <BookmarksProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </BookmarksProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
