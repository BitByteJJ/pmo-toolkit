# PMO Toolkit Navigator — TODO

- [x] Initial app scaffold with 8 decks and 144 cards
- [x] Home page with deck grid and quick stats
- [x] DeckView with illustrated title card, how-to-start, categories, and card list
- [x] CardView with full card detail, illustrations, and related cards
- [x] Sprint Mode — focused card flipper per deck
- [x] Search across all cards
- [x] Bookmarks / saved cards
- [x] Read progress tracking (per card, per deck)
- [x] Bottom navigation
- [x] Categories section auto-filters card list when a category pill is tapped
- [x] Active category badge shown in header when filter is active
- [x] Clear filter button and "X of Y cards" count when filtered
- [x] Advanced tag filter panel (via Filter button)
- [x] vitest config and category filter unit tests (6 tests passing)
- [x] 30-day PM Learning Journey with 150 questions across 6 units (journeyData.ts)
- [x] JourneyContext with hearts system (3 hearts, lose on wrong answer, 24h refill)
- [x] Earn-a-heart flow: study 5 topics to regain 1 heart
- [x] Journey map page with zigzag path, unit banners, day nodes, and stats strip
- [x] Daily lesson flow with question screens, answer feedback, and XP scoring
- [x] Lesson complete screen with accuracy stats and XP earned
- [x] No-hearts screen with countdown timer and earn-heart CTA
- [x] Earn Heart page with card study modal and progress tracker
- [x] Journey CTA banner on Home page with live hearts and streak display
- [x] Journey tab added to BottomNav with mini hearts indicator
- [x] XP level system (PM Apprentice → PM Master) with progress bar
- [x] Day streak tracking
- [x] All journey state persisted to localStorage
- [x] 22 vitest unit tests for journey reducer logic (all passing)
- [x] Fix: lesson hangs on "Loading lesson..." after the 5th question
- [x] Fix: app completely inaccessible after last deployment (stale localStorage session + storage key bump)
- [x] Fix: hearts icon misaligned in Journey bottom nav tab
- [x] Fix: after lesson completion, journey map/lesson flow broken until page refresh
- [x] Template sub-tab on every card: structured working template for all 144 tools/techniques/methodologies
- [x] templateData.ts: template content library with sections, fields, and example rows for each card
- [x] Template UI: inline preview, copy-to-clipboard, and download as text/markdown
- [x] Add footer credit: "Jackson Joy · February 2026" below the bottom nav on all pages
- [x] Redesign templateData.ts: structured JSON format (sections, tables, checklists) instead of raw Markdown
- [x] Build MarkdownTemplateRenderer component: styled HTML tables, section cards, colour-coded headers
- [x] Add CSV download and copy-as-text export options
- [x] Hide Template tab on cards that have no template entry in templateData.ts
- [x] Decision Helper tool: guided questionnaire that recommends relevant cards
- [x] decisionData.ts: decision tree with questions, answer paths, and card mappings
- [x] DecisionHelper page: animated question flow, progress bar, recommendation results
- [x] Entry points: Decision Helper accessible from Home page (navy CTA banner) and /decision route
- [x] Rewrite Decision Helper questions in plain, beginner-friendly language (no PM jargon)
- [x] Card difficulty tags: add Beginner/Intermediate/Advanced level to all 144 cards in pmoData.ts
- [x] Card difficulty filter: filter pill in DeckView and Search to show cards by difficulty level
- [x] First-launch onboarding prompt: welcome modal on first visit routing beginners to Decision Helper
- [x] Journey personalisation wizard: 3-question setup (role, experience, goal) before starting the 30-day journey
- [x] Tailor journey lesson order/difficulty based on wizard answers (personalised tip banner shown after wizard)

## Upcoming Features

### Quick Wins
- [ ] Daily challenge: one card-based question per day, separate from Journey
- [ ] Quiz mode per deck: standalone 10-question quiz for any deck
- [ ] Mastery badges: visual badge when user completes all cards in a deck or achieves 100% quiz accuracy
- [ ] Glossary / jargon buster: searchable A–Z of PM terms linked to relevant cards
- [ ] Notes on cards: personal text field per card stored in localStorage
- [ ] Share a card: shareable URL + OG meta tags for card preview
- [ ] Printable card deck: PDF export of any deck formatted as flash cards

### Medium Features
- [ ] AI coach: chat interface for project challenges, recommends relevant cards
- [ ] Project health check: diagnostic questionnaire scoring project health, recommends tools
- [ ] Scenario library: pre-built starter packs for common project situations
- [ ] Spaced repetition review: resurface previously-read cards at increasing intervals (SM-2)
- [ ] Custom collections: named folders of cards beyond single Bookmarks list
- [ ] Template builder: interactive form version of card templates with PDF/Word export
- [ ] Certification prep mode: study path aligned to PMP/PRINCE2/APM with exam-style questions

### Content Additions
- [x] Case studies: short real-world stories on each card showing the tool in action
- [x] Create caseStudiesData.ts with real-world PM case studies linked to cards
- [x] Add Case Studies tab to CardDetail page (conditional — only shows when a case study exists)
- [x] Create standalone CaseStudiesPage browser with deck/industry filters
- [x] Wire CaseStudiesPage into App.tsx routing, BottomNav, and Home CTAs
- [x] Expand case studies data to cover remaining People, Process, and Techniques cards (60 total)
- [x] Add case-study badge indicator in DeckView card list items

### Team Mode
- [ ] Team mode: shared workspace with user accounts, shared collections, card assignments, and comments

## Glossary & Expanded Case Studies
- [x] Write glossaryData.ts with 120+ PM terms, definitions, and card links
- [x] Build GlossaryPage with A–Z index, search, and card link chips
- [x] Wire Glossary into App.tsx routing and BottomNav
- [x] Add glossary term links on CardDetail page (overview tab)
- [x] Expand caseStudiesData.ts to cover remaining high-value cards (100 total)

## Glossary Wiring & PDF Export
- [x] Update all 120+ glossary term relatedCards arrays to cover all 144 cards (100% coverage)
- [x] Add PDF export button to CardDetail page (full-page formatted PDF via jsPDF)

## Sprint Cover Illustration Layout
- [x] Move deck cover illustrations below text with fade and transparency effect in DeckView

## PDF Export Fixes
- [x] Add card illustration to PDF export (centered with background circle, 85% opacity)
- [x] Add copyright/IP notices to PDF export (footer on every page)
- [x] Add author credit (Jackson Joy · February 2026) to PDF export (footer on every page)

## Sprint Mode Illustrations
- [x] Add card illustrations beneath card name in Sprint Mode flipper cards

## PDF Export Fixes v2
- [x] Update PDF footer: remove personal copyright, use educational disclaimer language
- [x] Fix PDF illustration embedding (CORS issue — switched from fetch to canvas with crossOrigin)
