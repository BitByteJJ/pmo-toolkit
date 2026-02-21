# PMO Toolkit Navigator — Design Ideas

## Context
A mobile-first card navigation app for project management tools, inspired by pip deck.
Content: ~120 cards across 8 sections — Project phases, Archetypes, Methodologies, Domain Tasks (People/Process/Business), Tools (T1-T17), Advanced Techniques (A1-A78).

---

<response>
<text>

## Idea 1: "Field Manual" — Tactical Brutalism

**Design Movement:** Swiss International Typographic Style meets Military Field Manual

**Core Principles:**
1. Information density without clutter — every pixel earns its place
2. Strong typographic hierarchy as the primary visual system
3. Color as a functional signal, not decoration
4. Grid-based rigidity with intentional rule-breaking for emphasis

**Color Philosophy:**
- Background: Off-white parchment (#F5F0E8) — feels like a physical document
- Primary: Deep navy (#1A2744) — authority and precision
- Accent: Signal orange (#E85D04) — urgent, actionable
- Section colors: Each deck gets a distinct utility color (olive, slate, rust, teal)
- Rationale: Evokes a physical field manual you'd carry into a project

**Layout Paradigm:**
- Card stack metaphor — cards physically "sit" in a deck
- Left-aligned text columns with strong left border accents
- Section dividers use full-bleed color bands
- No centered layouts — everything anchors left or uses asymmetric split

**Signature Elements:**
1. Bold section numbers in oversized display type (e.g., "T07" in 80px)
2. Horizontal rule separators with section color fills
3. Tag pills with monospace font for tool codes (T1, A23, etc.)

**Interaction Philosophy:**
- Swipe left/right to flip through cards in a deck
- Tap section header to collapse/expand
- Long-press a card to "bookmark" it

**Animation:**
- Card flip: 3D perspective transform on swipe
- Section expand: height animation with slight bounce
- Entrance: cards slide up from bottom with stagger

**Typography System:**
- Display: Space Grotesk Bold — industrial, authoritative
- Body: IBM Plex Sans Regular — technical, readable
- Code/IDs: IBM Plex Mono — precise, functional

</text>
<probability>0.08</probability>
</response>

---

<response>
<text>

## Idea 2: "Clarity Cards" — Modern Minimalist with Warm Accents ✅ CHOSEN

**Design Movement:** Scandinavian Minimalism meets Contemporary Product Design

**Core Principles:**
1. Radical clarity — one idea per card, no visual noise
2. Warm neutrals as the base, with bold accent colors per category
3. Generous whitespace as a design element
4. Touch-first interactions that feel native and physical

**Color Philosophy:**
- Background: Warm white (#FAFAF8) — clean but not clinical
- Card surface: Pure white with subtle shadow
- Category colors (each deck has a distinct hue):
  - Project Phases: Warm amber (#D97706)
  - Archetypes: Deep teal (#0D9488)
  - Methodologies: Indigo (#4F46E5)
  - People Domain: Rose (#E11D48)
  - Process Domain: Emerald (#059669)
  - Business Environment: Violet (#7C3AED)
  - Tools: Sky blue (#0284C7)
  - Advanced Techniques: Slate (#475569)
- Rationale: Color as wayfinding — you always know where you are in the deck

**Layout Paradigm:**
- Mobile-first card stack with swipeable deck interface
- Bottom navigation bar with 4 tabs: Home, Decks, Search, Bookmarks
- Card detail view uses full-screen with scroll
- Home screen uses a "Today's Pick" hero card + horizontal scroll rows

**Signature Elements:**
1. Category color bar — a 4px left border on every card matching its deck color
2. Card code badge (T1, A23, AG2) in top-right corner with monospace font
3. "Related cards" chips at bottom of each card detail

**Interaction Philosophy:**
- Horizontal swipe through cards within a deck (pip deck style)
- Vertical scroll for card detail content
- Tap to expand, swipe to dismiss
- Bookmark with heart icon, accessible from any card

**Animation:**
- Card entrance: fade + slight scale-up (0.95 → 1.0)
- Swipe transition: spring physics, cards feel weighted
- Section color transitions: smooth hue shift when changing decks
- Bookmark: heart pulse animation

**Typography System:**
- Display/Headers: Sora Bold — modern, geometric, friendly
- Body: Inter — clean, highly readable on mobile
- Code labels: JetBrains Mono — precise, distinctive

</text>
<probability>0.09</probability>
</response>

---

<response>
<text>

## Idea 3: "Signal Deck" — Dark Mode Command Center

**Design Movement:** Dark UI / Developer Tools aesthetic meets Card Game Design

**Core Principles:**
1. Dark background reduces eye strain for extended reference use
2. Neon accent colors create strong visual hierarchy
3. Card metaphor taken literally — cards look like physical playing cards
4. Information architecture that rewards exploration

**Color Philosophy:**
- Background: Deep charcoal (#0F1117) — focused, immersive
- Card surface: Dark slate (#1E2130) with subtle border glow
- Accent: Electric cyan (#06B6D4) — primary interactive color
- Category glows: Each deck has a distinct glow color
- Text: Near-white (#E2E8F0) for body, pure white for headers
- Rationale: Feels like a command center, professional and focused

**Layout Paradigm:**
- Full-screen card view with gesture navigation
- Floating category pill navigation at top
- Cards arranged in a fan/stack visual on the home screen
- Side drawer for bookmarks and search

**Signature Elements:**
1. Glowing card borders that match category color
2. Holographic-style category icons
3. Progress indicator showing position in deck (e.g., "7 of 17")

**Interaction Philosophy:**
- Swipe up to advance, swipe down to go back
- Pinch to zoom out to deck overview
- Shake to get a random card

**Animation:**
- Card transitions: GPU-accelerated 3D card flip
- Glow pulse on active cards
- Particle effect on bookmark

**Typography System:**
- Display: Outfit ExtraBold — futuristic, bold
- Body: DM Sans — clean, modern
- Labels: Space Mono — technical precision

</text>
<probability>0.07</probability>
</response>

---

## Selected Design: Idea 2 — "Clarity Cards"

**Rationale:** The warm minimalist approach best serves the reference use case — users need to quickly find and read information without visual fatigue. The category color system creates intuitive wayfinding across 8+ decks. The pip-deck-inspired swipe navigation feels natural on mobile. The warm palette differentiates from typical enterprise tools while maintaining professionalism.
