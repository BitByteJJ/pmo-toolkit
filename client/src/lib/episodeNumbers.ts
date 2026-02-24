// episodeNumbers.ts
// Assigns and persists a unique episode number (S1E1, S1E2, …) to each card.
// Numbers are stored in localStorage so they are consistent across sessions.
// The first card a user ever plays becomes S1E1, the second S1E2, etc.
// If a card has already been assigned a number it always gets the same one.

const STORAGE_KEY = 'stratalign_episode_map_v1';
const COUNTER_KEY = 'stratalign_episode_counter_v1';

type EpisodeMap = Record<string, number>; // cardId → episode number

function loadMap(): EpisodeMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as EpisodeMap) : {};
  } catch {
    return {};
  }
}

function saveMap(map: EpisodeMap): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch { /* storage full */ }
}

function loadCounter(): number {
  try {
    return parseInt(localStorage.getItem(COUNTER_KEY) ?? '0', 10) || 0;
  } catch {
    return 0;
  }
}

function saveCounter(n: number): void {
  try {
    localStorage.setItem(COUNTER_KEY, String(n));
  } catch { /* storage full */ }
}

/**
 * Returns the episode number for a card, assigning a new one if needed.
 * Episode numbers start at 1 and increment globally.
 */
export function getEpisodeNumber(cardId: string): number {
  const map = loadMap();
  if (map[cardId] !== undefined) return map[cardId];

  const counter = loadCounter() + 1;
  map[cardId] = counter;
  saveMap(map);
  saveCounter(counter);
  return counter;
}

/**
 * Formats an episode number as "S1E12".
 */
export function formatEpisodeId(n: number): string {
  return `S1E${n}`;
}

/**
 * Returns the formatted episode ID for a card (e.g. "S1E7").
 */
export function getEpisodeId(cardId: string): string {
  return formatEpisodeId(getEpisodeNumber(cardId));
}
