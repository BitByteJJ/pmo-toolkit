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

## PDF Illustration Fix v3
- [x] Fix PDF illustration embedding — added server-side image proxy at /api/image-proxy

## PDF Page Break Fix
- [x] Re-engineer PDF export to keep all text within page limits with proper pagination

## Bug Fixes
- [x] Fix process-3 / PR03 (Assess & Manage Risks): added A47 (TOC) to relatedCards so the link chip now appears

## Cross-Reference Audit
- [x] Audit all 144 cards: found and fixed 2 missing relatedCards entries (PR03→A47, phase-execution→A14). All 144 cards pass audit.

## Notes on Cards & ProTip Audit
- [x] Build Notes on Cards — already implemented (sticky-note button, drawer, localStorage persistence all wired in CardDetail)
- [x] Audit and rewrite all 144 proTips to be specific and actionable (41 rewritten, all now 90+ chars)

## AI Tool Finder
- [x] Build AI suggest endpoint (server/aiSuggest.ts + compiled aiSuggest.mjs) calling Manus LLM API
- [x] CARD_CATALOGUE: compact 100+ card index with id, code, title, tagline, whenToUse, tags
- [x] System prompt: instructs LLM to return 4-6 ranked recommendations with specific reasons
- [x] Vite dev server middleware wires /api/ai-suggest to the compiled .mjs handler
- [x] AiSuggest.tsx page: problem input, example prompts, loading skeleton, AI analysis summary, recommendation cards
- [x] Recommendation cards: ranked badges, deck colour coding, "Why this helps" explanations, tap-to-open card
- [x] Route /ai-suggest added to App.tsx
- [x] AI tab added to BottomNav (Sparkles icon)
- [x] AI Tool Finder CTA banner added to Home page (indigo gradient)
- [x] 6 vitest unit tests for enrichRecommendations logic and CARD_CATALOGUE structure (all passing)

## Deep Dive Card Sections
- [x] Add AI endpoint for generating Deep Dive content per card (Core Concept, How It Works, Real-World Example, Common Mistakes, When NOT to Use)
- [x] Add Deep Dive tab to CardDetail page with accordion sections
- [x] Cache generated content in localStorage per card

## Video Script Generator
- [x] Add AI endpoint for generating video scripts per card (human tone, ~2 min)
- [x] Add Script tab to CardDetail page with copy button
- [x] Cache generated scripts in localStorage per card

## Learning Journey Roadmap
- [x] Design journey data for Beginner / Intermediate / Advanced paths (~10 cards each)
- [x] Build visual roadmap page with experience level selector
- [x] Wire roadmap into navigation

## Deep Dive Static Content (Replace AI)
- [ ] Write static deepDiveData.ts with 5 sections per card for all 144 cards (Core Concept, How It Works, Real-World Example, Common Mistakes, When NOT to Use)
- [ ] Remove AI deep dive endpoint and replace Deep Dive tab with static content rendering
- [ ] Ensure all content is accurate, consistent, and referenced to established PM sources

## Video Guide Tab (In-Browser Animated Player)
- [ ] Build VideoGuide React component — animated scene player with CSS/SVG motion graphics
- [ ] Build AI scene script endpoint — generates structured scenes (title, narration, animation type, key points) per card
- [ ] Implement Web Speech API narration synced to scene transitions
- [ ] Add scene types: title card, bullet reveal, diagram animation, quote highlight, summary
- [ ] Replace Script tab with Video Guide tab in CardDetail
- [ ] Cache generated scene data in localStorage per card

## Navigation & UX Fixes
- [ ] Fix roadmap back-navigation — show "Back to Roadmap" button in CardDetail when navigating from roadmap
- [ ] Improve Video Guide voiceover quality — less robotic, more natural-sounding TTS

## QA Fix Pass — Feb 23 2026

- [ ] Re-ID process cards: process-18→PR18, process-19→PR19, process-20→PR20, process-21→PR21 across pmoData, deepDiveData, templateData, caseStudiesData, toolImages
- [ ] Re-ID people cards: people-15→P15, people-16→P16, people-17→P17 across all data files
- [ ] Regenerate 12 illustrations to match existing fine-line caricature deck style
- [ ] Add glossary section to all 12 new cards in pmoData.ts
- [ ] Fix BottomNav placement — currently left-aligned, must be bottom-fixed
- [ ] Redesign Home page: add how-to-navigate section, remove duplicate decks grid
- [ ] Fix deck covers to vertical-only orientation (no expanding horizontal layout on desktop)
- [ ] Full QA: verify card counts, ID consistency, navigation across all pages
- [ ] Update Welcome modal count from 154 to dynamic CARDS.length

## templateData.ts Corruption Fix — Feb 23 2026

- [x] Fix corrupted A67-A77 section in templateData.ts (batch insertion split A67 and A72 blocks)
- [x] Reconstruct A67, A68, A69, A70, A72, A73, A75, A76, A77 template blocks with correct object nesting
- [x] Verify all 166 templates have correct structure (no duplicate cardIds, all blocks properly opened/closed)
- [x] Confirm TypeScript compilation: 0 errors, 0 warnings
- [x] Final audit: all 166 cards have complete coverage (template, deep dive, case study, illustration)

## PMBOK 8 New Cards — Feb 2026 (32 cards)

- [x] Audit existing card structure and numbering patterns for new card IDs
- [x] Write pmoData.ts entries for 32 new PMBOK 8 cards (T21–T43, A88–A93, people-19–21)
- [x] Generate illustrations for all 32 new cards (fine-line caricature style, uploaded to CDN)
- [x] Write templateData.ts entries for all 32 new cards
- [x] Write deepDiveData.ts entries for all 32 new cards
- [x] Write caseStudiesData.ts entries for all 32 new cards
- [x] Write glossary entries for all 32 new cards (157 total glossary terms)
- [x] Pass 1 validation: 198 cards — 0 structural issues (all fields, illustrations, templates, deep dives, case studies present)
- [x] Pass 2 validation: 0 content issues (no PMBOK 7 mentions, no pip deck, TypeScript clean)
- [x] Save checkpoint after all 32 cards complete

## COCOMO Template Fix — Feb 2026

- [x] Fix COCOMO template rendering issue in templateData.ts

## Harmonisation & PMBOK 8 Wiring — Feb 2026

- [ ] Fix all hardcoded card counts (welcome modal, deck subtitles, home page, explore button)
- [ ] Fix glossary count references across the app
- [ ] Wire 32 new PMBOK 8 cards into AI Tool Finder card catalogue (aiSuggest.ts)
- [ ] Wire 32 new PMBOK 8 cards into Decision Helper (decisionData.ts)
- [ ] Wire 32 new PMBOK 8 cards into Learning Roadmap paths (roadmapData.ts)
- [ ] Wire 32 new PMBOK 8 cards into Learning Journey game (journeyData.ts)

## Template Library Feature — Feb 2026

- [x] Design fillable template field schema (templateFieldSchema.ts)
- [x] Build TemplateLibrary landing page with AI question flow and card grid
- [x] Build TemplateFiller page — rich fields, dynamic rows, deck colour theming
- [x] Implement PDF download with branding, card colour, tool name, copyright
- [x] Implement Word (.docx) download with matching formatting
- [x] Wire Template Library into sidebar nav and Home page
- [x] Add Templates nav item to DashboardLayout sidebar
- [x] Add "Browse Templates" CTA to Home page
- [x] Fix PDF table data not rendering (initial table state resolved from template content on download)
- [x] Run validation and save checkpoint

## Post-Template-Library Improvements — Feb 2026

- [x] Wire 32 PMBOK 8 cards into AI Tool Finder card catalogue (aiSuggest.ts) — 99 missing cards added, total 233
- [x] Wire 32 PMBOK 8 cards into Decision Helper (decisionData.ts) — duplicate answer ID fixed
- [x] Wire 32 PMBOK 8 cards into Learning Journey game (journeyData.ts) — T27/T28/T38/T39/T42 added to relevant lessons
- [x] Add localStorage persistence to Template Filler (auto-save 800ms debounce, restore on mount, auto-saved indicator, clear on reset)
- [x] Fix card re-IDs: people-N → P{N}, process-N → PR{N} across 14 files (815 replacements, 0 TS errors)
- [x] Fix hardcoded card counts — verified 198 is accurate and consistent
- [x] Fix BottomNav placement — lg:hidden added; TopNav upgraded with full desktop horizontal nav (11 links)

## Template Generator Audit & Fixes — Feb 2026

- [x] Audit PDF generator: formatting, layout, table rendering, section spacing, page breaks
- [x] Audit Word generator: formatting, table rendering, section spacing, missing footer
- [x] Fix Word document footer (copyright statement + Page X of Y field codes confirmed in XML)
- [x] Fix Word document formatting: heading styles, table column widths, checklist rendering, border properties
- [x] Fix PDF formatting: landscape for 5+ column tables, smart column widths, text wrapping, checklist checkboxes
- [x] Fix PDF Unicode: sanitize block chars (Gantt bars) to [####] ASCII, strip markdown bold/italic, preserve em dash
- [x] Test both generators: RACI Matrix (6 cols, landscape), Gantt Chart (14 cols, landscape), Word footer verified
- [x] Save checkpoint after fixes

## Navigation Streamlining — Feb 2026

- [x] Reduce BottomNav to 5 essential tabs: Home, AI, Templates, Search, Saved
- [x] Move Journey, Roadmap, Glossary, Case Studies, Decision Helper out of BottomNav
- [x] Add Mini-Apps dropdown to TopNav alongside existing Decks dropdown
- [x] Mini-Apps dropdown: AI Tool Finder, Decision Helper, Template Library, Learning Journey, Learning Roadmap, Glossary, Case Studies (7 items with icons + descriptions)
- [x] Mini-Apps dropdown accessible on all pages that show TopNav (all except Home, Journey, Decision, Quiz)
- [x] Home page hides TopNav intentionally (has its own full-screen hero header)
- [x] Tested: Mini-Apps dropdown opens correctly on /templates page, all 7 items visible and clickable

## Bug Fixes — Feb 23 2026

- [x] Fix Template Filler header being cut off by TopNav bar — added pt-12 to outer wrapper and top-12 to sticky header in both TemplateFiller.tsx and TemplateLibrary.tsx
- [ ] Fix date field overflow in Template Filler document header (date input falls outside its container)
- [ ] Fix missing Word document footer (copyright + page numbers not appearing in downloaded .docx)

## Nav Restructuring — Feb 23 2026

- [x] Move Decks to centre slot of BottomNav (as a dropdown with upward panel, ChevronUp indicator)
- [x] Remove Saved/Bookmarks from BottomNav (moved to TopNav)
- [x] Add Bookmarks button to TopNav next to Mini-Apps (both mobile icon + desktop Saved label with badge)

## New Features — Feb 23 2026 (Session 3)

- [x] Remove Decks dropdown from TopNav (keep only in BottomNav centre)
- [x] Build first-time visitor onboarding tour with navigation map (Take Tour / Skip)
- [x] Verify case studies for factual accuracy and apply corrections
- [x] Build "How It Was Built" documentation page (prompt library + tools used)

## New Features — Feb 23 2026 (Session 3)

- [x] Remove Decks dropdown from TopNav (keep only in BottomNav centre)
- [x] Build first-time visitor onboarding tour with navigation map (Take Tour / Skip)
- [x] Verify case studies for factual accuracy and apply corrections
- [x] Build "How It Was Built" documentation page (prompt library + tools used)

## Dark Mode — Feb 23 2026 (Session 4)
- [x] Apply dark ThemeProvider globally (defaultTheme="dark")
- [x] Fix TopNav: dark frosted glass bar, dark dropdown panel, light text
- [x] Fix BottomNav: dark dropdown panel, light deck titles
- [x] Fix JourneyPage: full dark-mode rewrite with dark card containers
- [x] Fix Advanced Techniques deck theme color for dark mode visibility
- [x] Batch replace all stone-* text/bg classes with dark-mode equivalents across all pages
- [x] Fix CardDetail: dark modal, dark sticky header, dark card surfaces
- [x] Fix CaseStudiesPage, BookmarksPage, DecisionHelper, GlossaryPage, LessonPage, QuizPage, AiSuggest
- [x] Fix VideoGuide and DailyChallenge component dark text colors

## Dark Mode Pass 2 — Feb 23 2026 (Session 2)
- [x] Add BottomNav to TemplateLibrary page
- [x] Add BottomNav to TemplateFiller page
- [x] Add BottomNav to EarnHeartPage, JourneyPage, LessonPage (were missing)
- [x] Fix Glossary term card white backgrounds (#f5f3ee → rgba dark)
- [x] Fix LessonPage complete/no-hearts screens (light bg → dark)
- [x] Fix LessonPage question option selected states (bg-blue/emerald/rose-50 → dark)
- [x] Fix LessonPage sticky header (warm bg → dark navy)
- [x] Fix Browse by Deck tiles (theme.bg+'22' → theme.bg direct)
- [x] Fix EarnHeartPage, QuizPage, DecisionHelper, AiSuggest, LearningRoadmap, HowItWasBuilt light bg remnants
- [x] Fix TemplateFiller color picker and priority badge light backgrounds

## Theme Unification & Template Card Fixes — Feb 23 2026 (Session 5)
- [x] Unify background to deep navy (#0a1628) across all pages via CSS --background variable
- [x] Fix template card ID display (business-1 -> BE01, BE02, BE03, BE04, BE05 now consistent)
- [x] Fix deck colour dot alignment on template cards - replaced with icon badge

## Full Dark Navy Cohesion Audit — Feb 23 2026 (Session 6)
- [ ] Audit all pages for light-mode remnants and inconsistent backgrounds
- [ ] Fix Home page desktop layout and card deck backgrounds for navy mode
- [ ] Fix TopNav desktop dropdown and mobile menu for navy mode
- [ ] Fix WelcomeModal white background
- [ ] Fix GlossaryPage term cards and quiz option buttons
- [ ] Fix CardDetail page backgrounds and tab bar
- [ ] Fix DeckPage card list backgrounds
- [ ] Fix JourneyPage unit/day node backgrounds
- [ ] Fix LessonPage question cards and completion screens
- [ ] Fix QuizPage option cards
- [ ] Fix CaseStudiesPage card backgrounds
- [ ] Fix BookmarksPage card backgrounds
- [ ] Fix DecisionHelper, AiSuggest, VideoGuide, LearningRoadmap, DailyChallenge backgrounds

## Dark Navy Cohesion Pass Complete — Feb 23 2026 (Session 6 resolved)
- [x] CardDetail deep-dive accordion: replaced light bg values (#EFF6FF etc.) with rgba dark equivalents
- [x] CardDetail video guide error state: replaced bg-red-50 with dark rgba
- [x] QuizPage answer options: replaced bg-emerald-50/bg-red-50 with dark rgba equivalents
- [x] QuizPage explanation box: replaced bg-emerald-50/bg-amber-50 with dark rgba equivalents
- [x] QuizPage mastery badge text: replaced text-amber-800/text-amber-600 with text-amber-300/text-amber-400
- [x] BookmarksPage: replaced bg-rose-50 and border-rose-200 with dark equivalents
- [x] EarnHeartPage: replaced bg-rose-50 and border-rose-200 with dark equivalents
- [x] CaseStudiesPage: replaced bg-amber-50 badge with dark equivalent
- [x] HowItWasBuilt: replaced bg-amber-50 panel with dark equivalent
- [x] OnboardingTour: replaced all light bg values (#ECFDF5, #FEF3C7, #F0F9FF, #F5F3FF, #FDF2F8, #FFF1F2, #F8FAFC) with rgba dark equivalents
- [x] All 49 tests passing after changes

## Tour & Home Background Fixes — Feb 23 2026
- [x] Fix OnboardingTour sheet: replaced white #fff background with dark navy #0f1c30
- [x] Fix OnboardingTour MAP_ITEMS: replaced #EFF6FF (Decks) and #EEF2FF (AI) with rgba dark equivalents
- [x] Fix OnboardingTour TOUR_STEPS: replaced #EFF6FF bg for welcome/decks/ai steps with rgba dark equivalents
- [x] Unify Home page background: replaced 3-stop dark-black gradient with single deep navy linear-gradient(135deg, #0a1628 0%, #0f2040 100%) matching TemplateLibrary
- [x] Fix Home hero base layer: aligned to same navy so hero blends seamlessly into page body
- [x] Fix Home hero overlay gradients: updated left-side and bottom-fade colours to match #0a1628

## Tour & Home Background Fixes — Feb 23 2026
- [x] Fix OnboardingTour sheet: replaced white #fff background with dark navy #0f1c30
- [x] Fix OnboardingTour MAP_ITEMS: replaced #EFF6FF (Decks) and #EEF2FF (AI) with rgba dark equivalents
- [x] Fix OnboardingTour TOUR_STEPS: replaced #EFF6FF bg for welcome/decks/ai steps with rgba dark equivalents
- [x] Unify Home page background: single deep navy linear-gradient(135deg, #0a1628 0%, #0f2040 100%) matching TemplateLibrary
- [x] Fix Home hero base layer: aligned to same navy so hero blends seamlessly into page body
- [x] Fix Home hero overlay gradients: updated left-side and bottom-fade colours to match #0a1628

## Home Page Desktop Layout & ContinueCard Fix — Feb 23 2026
- [x] Add lg:two-column layout to Home page (hero left, feature grid right on desktop)
- [x] Fix ContinueCard background to blend with unified navy (#0a1628)

## Tech Stack & Notes Fixes
- [ ] Fix HowItWasBuilt: replace light bg values (#F0F9FF, #ECFDF5, #EEF2FF, #FEF3C7, #F5F3FF) in TOOLS data with dark rgba equivalents
- [x] Fix HowItWasBuilt: replace light gradient on Build Stats panel with dark navy
- [x] Fix HowItWasBuilt: fix unreadable text-indigo-700 stat values (dark purple on dark bg)
- [x] Fix HowItWasBuilt: fix amber disclaimer text-amber-700 (too dark on dark bg)
- [ ] Fix CardDetail notes: brighten textarea text from text-slate-300 to text-slate-100, brighten placeholder

## Tech Stack & Notes Fixes — Feb 23 2026
- [x] Fix HowItWasBuilt: replace light bg values in TOOLS data with dark rgba equivalents
- [ ] Fix HowItWasBuilt: replace light gradient on Build Stats panel with dark navy
- [ ] Fix HowItWasBuilt: fix unreadable text-indigo-700 stat values
- [ ] Fix HowItWasBuilt: fix amber disclaimer text-amber-700
- [x] Fix CardDetail notes: brighten textarea text and placeholder

## Round 7 Fixes
- [ ] CardDetail flip card: replace deck.bgColor with #0f1c30, fix #1a1a1a title, remove mixBlendMode multiply
- [ ] DeckView card thumbnails: replace deck.bgColor with rgba(15,28,48,0.8)
- [ ] OnboardingTour step tiles: align bg to rgba(15,28,48,0.8)
- [ ] VideoGuide text: fix unreadable text colours
- [ ] TemplateFiller: reduce size of Download PDF, Download Word, Reset buttons

## Round 7 Fixes — Feb 23 2026 (Session continuation)
- [x] CardDetail deckBgColor: replaced deck.bgColor with #0f1c30 (VideoGuide data prop)
- [x] VideoGuide narration box: replaced white bg + text-gray-600 with #0f1c30 bg + text-slate-300
- [x] TemplateFiller: reduced Download PDF, Download Word, Reset buttons (py-3→py-1.5, text-sm→text-xs, rounded-xl→rounded-lg, smaller icons)
- [x] OnboardingTour TOUR_STEPS bg values confirmed already using rgba(color, 0.12) — no change needed
- [x] All 49 tests passing, TypeScript 0 errors

## Journey Pages Visual Upgrade — Feb 23 2026

- [x] JourneyPage: upgrade day nodes (larger, richer icons, star/XP labels, better active pulse), improve unit banners with gradient mesh, upgrade stats strip with glowing cards
- [x] JourneyPage: add decorative connector path between nodes (curved/dashed), improve UnitPathCard with subtle gradient background
- [x] LessonPage: upgrade question card (larger prompt, richer option buttons with letter badges), upgrade lesson complete screen (remove light bg stats, add animated confetti/stars, dark stat cards)
- [x] LessonPage: upgrade no-hearts screen (richer layout, animated heart, countdown styling)
- [x] EarnHeartPage: fix light-mode header (rose-100 bg → dark navy), fix card study modal header (deck.bgColor → dark navy), fix "Studied!" confirmation (bg-emerald-50 → dark)
- [x] JourneySetupWizard: fix option buttons (light #fafaf8 bg → dark navy, border #e7e5e4 → rgba white), fix step dots inactive color (#e7e5e4 → rgba white)

## Journey Winding Road — Feb 23 2026

- [x] Replace straight connector line with winding SVG road/trail connecting day nodes in a fluid, game-map style (dashed road with curves, node positions matched to road waypoints)

## LessonPage Continue Button Fix — Feb 23 2026

- [x] Fix Continue button hidden behind BottomNav — add pb-24 to scroll area and raise sticky button bar above nav

## Deck Card List Visual Upgrade — Feb 23 2026

- [x] Frosted glass meta pill on each card row for readability
- [x] Illustrations more visible (opacity 0.65, larger 160% height, screen blend)
- [x] Bookmark badge floats outside card boundary as a circular pill button

## BottomNav Global Fix — Feb 23 2026

- [x] Fix BottomNav disappearing on screens wider than 1024px — removed lg:hidden, moved to App.tsx as GlobalBottomNav, removed per-page imports

## Illustration Audit — Feb 23 2026

- [ ] Audit all 198 cards for missing illustration URLs (especially Business Environment deck)
- [ ] Fix any missing illustration URLs across all decks

## DeckView Frosted Sections — Feb 23 2026

- [x] Fix category pill text readability (near-invisible against dark bg)
- [x] Apply frosted glass styling to How to Start section
- [x] Apply frosted glass styling to Categories section

## Business Environment Deep Dives — Feb 23 2026

- [x] Audit deepDiveData for BE01–BE05 and add any missing entries
- [x] Rename stale business-1/2/3/4/5 keys to BE01–BE05 across deepDiveData, cardLevels, decisionData, glossaryData, journeyData, VisualReference, TemplateLibrary

## Dark Scrollbar — Feb 23 2026

- [x] Add dark custom scrollbar CSS for Chrome/Edge/Windows (webkit) and Firefox (scrollbar-color)

## Roadmap Tab Visual Upgrade — Feb 23 2026

- [x] Apply frosted glass and richer active states to Roadmap page tabs

## Card Illustration Gradient & Frosted Matte — Feb 23 2026

- [x] DeckView card rows: illustration fades from transparent (left) to bold (right); text container fades from solid (left) to transparent (right)
- [x] Deepen frosted glass matte (higher backdrop-blur, darker bg tint) across all major panels app-wide

## Light/Dark Theme Toggle — Feb 2026

- [ ] Create ThemeContext with localStorage persistence
- [x] Define light mode CSS variable set in index.css
- [ ] Add theme toggle button to top navigation bar
- [ ] Update hardcoded dark colours across all pages to use CSS theme variables
- [x] Light/dark theme toggle (Sun/Moon button in TopNav, persisted to localStorage)

## Light Mode Readability Audit — Feb 2026

- [x] Fix CardDetail page light mode readability
- [x] Fix SearchPage light mode readability
- [x] Fix BookmarksPage light mode readability
- [x] Fix DecksPage light mode readability
- [x] Fix AiSuggest page light mode readability
- [x] Fix DecisionHelper page light mode readability
- [x] Fix GlossaryPage light mode readability
- [x] Fix CaseStudiesPage light mode readability
- [x] Fix LearningRoadmap page light mode readability
- [x] Fix TemplateLibrary page light mode readability
- [x] Fix TemplateFiller page light mode readability
- [x] Fix JourneyPage light mode readability
- [x] Fix LessonPage light mode readability
- [x] Fix QuizPage light mode readability
- [x] Fix WelcomeModal light mode readability
- [x] Fix OnboardingTour light mode readability
- [x] Fix SprintMode (DeckView) light mode readability
- [x] Fix HowItWasBuilt page light mode readability
- [x] Fix light mode contrast: Daily Challenge text, quiz options, card text invisible
- [x] Restore footer disclaimer (owner name, month/year, educational disclaimer) on every page
- [x] Fix AI Suggest page: invisible title and example chip text in light mode
- [x] Fix CardDetail template table row text in light mode
- [x] Fix MarkdownTemplateRenderer: theme-aware text colours
- [x] Fix home page illustrations: correct blend mode for light mode

## Light Mode Fixes Round 2 — Feb 2026

- [x] Fix CardDetail hero header: title text invisible in light mode (light text on light bg)
- [x] Fix CardDetail hero: illustration box showing as grey rectangle (blend mode issue)
- [x] Fix TemplateFiller description box: low contrast text in light mode
- [x] Fix TemplateFiller table cells: raw markdown asterisks (**text**) not rendered as bold

## Five New Features — Feb 2026

### Feature 1: Spaced Repetition Engine
- [ ] Add SR fields to localStorage card state: nextReview (timestamp), interval (days), easeFactor (float), repetitions (int)
- [ ] Implement SM-2 algorithm: on answer, compute next interval from quality rating (0-5)
- [ ] Add "Review" tab to Journey page showing cards due today
- [ ] Add quality-rating buttons (Again / Hard / Good / Easy) to LessonPage card answer flow
- [ ] Add SR stats to CardDetail (next review date, current interval, ease factor)
- [ ] Add global "Due for Review" badge to BottomNav Journey icon

### Feature 2: Card Comparison Tool
- [ ] Add "Compare" button to CardDetail page (opens comparison picker)
- [ ] Build CompareModal: search/select a second card, show side-by-side layout
- [ ] Build ComparisonPage (/compare/:id1/:id2): full-page structured comparison table
- [ ] Comparison rows: What It Is, When to Use, Key Steps, Strengths, Limitations, Best Paired With
- [ ] Add "Compare with..." quick-select chips on CardDetail (pre-populated related cards)
- [ ] Support light/dark mode in comparison layout

### Feature 3: Project Health Checker
- [ ] Design 15-question diagnostic (5 domains: Scope, Stakeholders, Risk, Delivery, Team)
- [ ] Build HealthCheckerPage (/health-check): stepper questionnaire UI
- [ ] Implement scoring engine: per-domain score (0-100) + overall health score
- [ ] Build results page: radar/spider chart of 5 domains, top 5 recommended cards
- [ ] Add "Check Project Health" CTA to Home page and AI page
- [ ] Persist last health check result to localStorage with timestamp
- [ ] Support light/dark mode in all health checker screens

### Feature 4: Snowflake Mind Map
- [ ] Add toolRelationships data to pmoData: for each card, list related cards by relationship type (pairs-with, leads-to, alternative-to, prerequisite-of)
- [ ] Install and configure D3.js or react-force-graph for force-directed layout
- [ ] Build MindMapPage (/mindmap): full-screen canvas with all 198 cards as nodes
- [ ] Implement snowflake expand: click a node to highlight its direct relationships (1st ring), click again to expand 2nd ring
- [ ] Node styling: colour by deck, size by connection count, glow on active
- [ ] Add search/filter bar to highlight matching nodes
- [ ] Add minimap / zoom controls
- [ ] Clicking a node navigates to CardDetail
- [ ] Add "View in Mind Map" button on CardDetail
- [ ] Support light/dark mode in mind map canvas

### Feature 5: Audio Mode (Lock-Screen Playback)
- [ ] Build TTS pipeline: card text (What It Is + How to Use It + Key Steps) → chunked utterances
- [ ] Use Web Speech API (SpeechSynthesis) as primary TTS (no API key needed, works offline)
- [ ] Implement Media Session API: set metadata (title, artist=deck name, artwork=card illustration) so lock screen shows card info
- [ ] Add playback controls: play/pause, next card, previous card, speed (0.75x/1x/1.25x/1.5x)
- [ ] Build AudioPlayerBar: persistent bottom bar above BottomNav when audio is playing
- [ ] Build AudioQueuePage (/audio): playlist of selected cards or full deck
- [ ] Add "Listen" button to CardDetail and DeckView
- [ ] Add "Listen to Deck" button to DecksPage
- [ ] Ensure audio continues when screen locks (Media Session API handles this on iOS/Android)
- [ ] Support light/dark mode in AudioPlayerBar and AudioQueuePage

## New Features — Feb 24 2026 (Session 7)

- [x] Spaced Repetition Engine (SM-2 algorithm): ReviewPage with due-today queue, rating buttons (Again/Hard/Good/Easy), interval scheduling, and stats
- [x] DueTodayBanner on JourneyPage: shows count of cards due for review with link to /review
- [x] Card Comparison Tool: CompareCards page with dual card pickers, structured attribute rows, random pair shuffle, and view-full-card links
- [x] Project Health Checker: HealthChecker page with 16-question Likert scale across 8 dimensions, pure SVG radar chart, and personalised card recommendations
- [x] Snowflake Mind Map: MindMap page with force-directed SVG graph, expand/collapse nodes, pan/zoom, search to focus, and selected node info panel
- [x] Audio Mode: AudioMode page with Web Speech API TTS, Media Session API lock-screen controls (play/pause/next/prev), speed selector, deck/card playlist builder
- [x] AudioContext: global provider with play/pause/stop/next/prev, rate/pitch/volume controls, and MediaMetadata for lock screen
- [x] AudioPlayerBar: persistent mini-player bar above BottomNav when audio is active
- [x] All 5 new routes wired into App.tsx (/review, /compare, /health, /mindmap, /audio)
- [x] All 5 new tools added to TopNav Mini-Apps dropdown
- [x] All 5 new tools added to Home page feature grid
- [x] All 49 existing tests still passing after changes

## Mind Map Label Fix — Feb 24 2026

- [x] Show card titles (names) in Mind Map nodes instead of card codes/IDs
- [x] Smart text truncation and node sizing so titles remain readable at all zoom levels

## Audio Mode Upgrade — Feb 24 2026

- [x] Replace Web Speech API with Google Cloud TTS (Neural2/Journey voice) via server-side tRPC endpoint
- [x] Build podcast-style card script (intro hook + explanation + example + takeaway) for richer narration
- [x] Cache TTS audio in sessionStorage (base64) to avoid re-fetching the same card
- [x] Fix Media Session API lock-screen controls (artwork, title, artist, action handlers)
- [x] Update AudioContext to use HTMLAudioElement instead of SpeechSynthesis
- [x] Update AudioMode UI to show loading state while TTS is being generated

## Two-Host Podcast Audio — Feb 24 2026

- [x] Build LLM-powered two-host podcast script generator (Host A: Journey-O, Host B: Journey-D)
- [x] Update /api/tts endpoint to accept voice parameter (journey-o / journey-d)
- [x] Add /api/podcast endpoint that generates multi-segment script via LLM then TTS each segment
- [x] Update AudioContext to fetch and stitch podcast segments, playing them sequentially
- [x] Update AudioMode UI to show host avatars and current speaker during playback
- [x] Cache full podcast episodes in sessionStorage

## Podcast Improvements — Feb 24 2026

- [x] Fix podcast script prompt: no "as you know" / "already know" phrasing; reference other tools as "we cover that in another session"
- [x] Add real-time progress bar + time remaining to AudioPlayerBar mini-player
- [x] Add time elapsed / total duration to NowPlaying panel
- [x] Add /api/podcast-download endpoint that stitches all segments into one MP3 (base64)
- [x] Add Download Episode button in AudioMode NowPlaying panel

## Podcast Streaming (Low Latency) — Feb 24 2026

- [x] Rewrite /api/podcast to stream NDJSON segments as each TTS line completes
- [x] LLM streams script lines via SSE; each line is TTS'd immediately as it arrives
- [x] AudioContext reads the NDJSON stream and starts playback on the first segment
- [x] Subsequent segments are queued and played back-to-back with no gap
- [x] Tune script to 30–50 lines for 5–10 min episodes
- [x] Show "buffering" indicator when player is waiting for next segment

## Podcast Rename — Feb 24 2026

- [x] Rename podcast from "The PMO Toolkit Podcast" to "StratAlign Theater" in server prompt
- [x] Update Media Session album name to "StratAlign Theater"
- [x] Update all UI labels (AudioMode page, AudioPlayerBar) to "StratAlign Theater"

## Jingle + Episode Numbers — Feb 24 2026

- [ ] Generate StratAlign Theater intro jingle via Google TTS (branded spoken intro + tone)
- [ ] Serve jingle as a static asset from /public
- [ ] Wire jingle playback into AudioContext as segment index -1 before episode starts
- [ ] Add episode number tracking in localStorage (card ID → episode number, global counter)
- [ ] Display episode number (S1E12) in NowPlaying header and AudioPlayerBar subtitle
- [ ] Include episode number in Media Session title metadata

## Multi-Character Cast — Feb 24 2026

- [x] Define 5-character cast: Alex (PM lead), Sam (analyst), Jordan (sponsor/exec), Maya (team lead), Chris (sceptic/devil's advocate)
- [x] Assign each character a unique Google TTS Journey voice
- [x] Update LLM prompt to select 2-5 characters based on tool complexity
- [x] Update server TTS handler to route each character to their voice
- [x] Update AudioContext to handle 5 speakers (colours, avatars)
- [x] Update AudioMode UI to show all active speakers with role labels
- [x] Wire intro jingle before first segment
- [x] Add episode numbers (S1E#) to NowPlaying and Media Session

## Audio Bug Fix — Feb 24 2026

- [ ] Diagnose why audio loads then immediately closes/stops
- [ ] Fix the streaming pipeline or AudioContext abort issue

## Audio API Routing Fix — Feb 24 2026

- [ ] Register /api/podcast, /api/tts, /api/podcast-download routes in the active server entry point
- [ ] Verify all audio endpoints respond correctly (not 404)
- [ ] Confirm jingle plays, characters appear, and download works

## Audio Bug Fix — Feb 24 2026

- [x] Diagnose why audio loads then immediately closes/stops (root cause: podcast .mjs not loaded by Vite dev server + streaming JSON parser failing on markdown-fenced LLM output)
- [x] Fix: rewrite podcastGenerator.mjs with non-streaming LLM call + robust JSON parsing
- [x] Fix: update voice mapping to Studio-Q/O and Neural2 voices (Journey voices not available on this API key)
- [x] Verify: 28-segment RACI Matrix episode generates successfully end-to-end

## Journey Voice Restoration — Feb 24 2026

- [x] Diagnose why Journey voices appeared missing (Google /voices endpoint does not list them, but they work when called directly)
- [x] Confirmed available Journey voices: Journey-D (male), Journey-F (female), Journey-O (female)
- [x] Restored: Alex=Journey-D, Sam=Journey-O, Maya=Journey-F, Jordan=Journey-D, Chris=Journey-D
- [x] Verified end-to-end: 28-segment RACI Matrix episode generates successfully with all Journey voices

## Audio Fix (Edge Proxy) — Feb 24 2026

- [x] Diagnose: edge proxy blocks NDJSON streaming (x-e2bp-resp-type: general_error)
- [x] Rewrite /api/podcast to return single JSON response instead of NDJSON stream
- [x] Update AudioContext to use response.json() instead of streaming reader
- [x] Verified: 25 segments returned correctly, Journey voices working
