import { LotteryResult } from '../types';

const RESULTS_CACHE = new Map<string, { data: LotteryResult; timestamp: number }>();
const PAST_RESULTS_CACHE = new Map<string, { data: LotteryResult[]; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// ============================================
// API ENDPOINTS (NY Open Data — free, no key needed)
// ============================================
// Powerball: winning_numbers = "07 24 37 42 57 05" (5 main + powerball in one string)
//            multiplier = "2"
// Mega Millions: winning_numbers = "05 15 22 33 37" (5 main only)
//                mega_ball = "02" (SEPARATE field)
//                multiplier = NOT present in API

const ENDPOINTS: Record<string, string> = {
  // National games
  powerball: 'https://data.ny.gov/resource/d6yy-54nr.json',
  'mega-millions': 'https://data.ny.gov/resource/5xaw-6ayf.json',
  // New York state games (free NY Open Data APIs)
  'new-york-lotto': 'https://data.ny.gov/resource/6nbc-h7bj.json',
  'take-5': 'https://data.ny.gov/resource/dg63-4siq.json',
  'numbers': 'https://data.ny.gov/resource/hsys-3def.json',
  'win-4': 'https://data.ny.gov/resource/hsys-3def.json',
};

// ============================================
// Parse a single draw from API response
// ============================================

function parseDraw(game: string, draw: Record<string, string>): LotteryResult | null {
  if (!draw.draw_date) return null;
  // Numbers and Win 4 don't have winning_numbers field — they use separate fields
  // Some games use different field names — skip this check for those
  const noWinningNumbersField = ['numbers', 'win-4', 'numbers-win4', 'take-5'];
  if (!draw.winning_numbers && !noWinningNumbersField.includes(game)) return null;

  const drawDate = draw.draw_date.split('T')[0];

  if (game === 'powerball') {
    // Powerball: all 6 numbers in winning_numbers string
    const allNumbers = draw.winning_numbers.split(' ').map(Number);
    if (allNumbers.length < 6) return null;

    return {
      game: 'Powerball',
      gameSlug: 'powerball',
      drawDate,
      numbers: allNumbers.slice(0, 5),
      bonusBall: allNumbers[5],
      bonusBallName: 'Powerball',
      multiplier: draw.multiplier ? Number(draw.multiplier) : undefined,
      multiplierName: 'Power Play',
    };
  }

  if (game === 'mega-millions') {
    // Mega Millions: 5 main numbers in winning_numbers, mega_ball is SEPARATE
    const mainNumbers = draw.winning_numbers.split(' ').map(Number);
    if (mainNumbers.length < 5) return null;

    const megaBall = draw.mega_ball ? Number(draw.mega_ball) : undefined;

    return {
      game: 'Mega Millions',
      gameSlug: 'mega-millions',
      drawDate,
      numbers: mainNumbers.slice(0, 5),
      bonusBall: megaBall,
      bonusBallName: 'Mega Ball',
      multiplier: undefined,
      multiplierName: 'Megaplier',
    };
  }

  // NY Lotto: winning_numbers = "31 35 36 38 49 55", bonus = "10"
  if (game === 'new-york-lotto') {
    const allNumbers = draw.winning_numbers.split(' ').map(Number);
    if (allNumbers.length < 6) return null;

    return {
      game: 'New York Lotto',
      gameSlug: 'new-york-lotto',
      drawDate,
      numbers: allNumbers.slice(0, 6),
      bonusBall: draw.bonus ? Number(draw.bonus) : undefined,
      bonusBallName: 'Bonus',
    };
  }

  // Take 5: has midday and evening draws
  // evening_winning_numbers = "10 14 15 17 18", midday_winning_numbers = "10 20 21 28 39"
  if (game === 'take-5') {
    // Prefer evening draw, fall back to midday
    const numbersStr = draw.evening_winning_numbers || draw.midday_winning_numbers;
    if (!numbersStr) return null;
    const nums = numbersStr.split(' ').map(Number);
    if (nums.length < 5) return null;

    return {
      game: 'Take 5',
      gameSlug: 'take-5',
      drawDate,
      numbers: nums.slice(0, 5),
    };
  }

  // Numbers (3-digit) — from combined Numbers/Win4 dataset
  if (game === 'numbers' || game === 'numbers-win4') {
    const eveningDaily = draw.evening_daily;
    if (!eveningDaily) return null;

    return {
      game: 'Numbers',
      gameSlug: 'numbers',
      drawDate,
      numbers: eveningDaily.split('').map(Number),
    };
  }

  // Win 4 (4-digit) — from combined Numbers/Win4 dataset
  if (game === 'win-4') {
    const eveningWin4 = draw.evening_win_4;
    if (!eveningWin4) return null;

    return {
      game: 'Win 4',
      gameSlug: 'win-4',
      drawDate,
      numbers: eveningWin4.split('').map(Number),
    };
  }

  return null;
}

// ============================================
// Fetch latest result from API
// ============================================

async function fetchFromLotteryAPI(game: string): Promise<LotteryResult | null> {
  try {
    const baseUrl = ENDPOINTS[game];
    if (!baseUrl) return null;

    const url = `${baseUrl}?$limit=1&$order=draw_date%20DESC`;

    const response = await fetch(url, {
      next: { revalidate: 300 },
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      console.error(`API returned ${response.status} for ${game}`);
      return null;
    }

    const data = await response.json();
    if (!data || data.length === 0) return null;

    return parseDraw(game, data[0]);
  } catch (error) {
    console.error(`API fetch failed for ${game}:`, error);
    return null;
  }
}

// ============================================
// Fetch past results (history)
// ============================================

export async function fetchPastResults(
  game: string,
  limit: number = 10
): Promise<LotteryResult[]> {
  // Check cache
  const cacheKey = `${game}-${limit}`;
  const cached = PAST_RESULTS_CACHE.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    const baseUrl = ENDPOINTS[game];
    if (!baseUrl) return [];

    const url = `${baseUrl}?$limit=${limit}&$order=draw_date%20DESC`;

    const response = await fetch(url, {
      next: { revalidate: 300 },
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) return [];

    const data = await response.json();
    const results = data
      .map((draw: Record<string, string>) => parseDraw(game, draw))
      .filter((r: LotteryResult | null): r is LotteryResult => r !== null);

    PAST_RESULTS_CACHE.set(cacheKey, { data: results, timestamp: Date.now() });
    return results;
  } catch (error) {
    console.error(`Failed to fetch past results for ${game}:`, error);
    return [];
  }
}

// ============================================
// MAIN: Get latest result with multi-layer fallback
// 1. In-memory cache (5 min)
// 2. Fresh API call
// 3. Last-known-good from past-results cache
// Only returns null if we genuinely have zero data — never shows broken UI.
// ============================================

export async function getLatestResult(gameSlug: string): Promise<LotteryResult | null> {
  // Layer 1: In-memory cache
  const cached = RESULTS_CACHE.get(gameSlug);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  // Layer 2: Fresh API call
  const result = await fetchFromLotteryAPI(gameSlug);
  if (result) {
    RESULTS_CACHE.set(gameSlug, { data: result, timestamp: Date.now() });
    return result;
  }

  // Layer 3: Fall back to past-results cache
  for (const [key, entry] of PAST_RESULTS_CACHE.entries()) {
    if (key.startsWith(gameSlug + '-') && entry.data.length > 0) {
      return entry.data[0];
    }
  }

  // Layer 4: Try fetching past results as a last resort (they might succeed even if single-latest failed)
  const past = await fetchPastResults(gameSlug, 1);
  if (past.length > 0) {
    RESULTS_CACHE.set(gameSlug, { data: past[0], timestamp: Date.now() });
    return past[0];
  }

  return null;
}

// ============================================
// Utility functions
// ============================================

export function getNextDrawDate(drawDays: string[]): string {
  const dayMap: Record<string, number> = {
    Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3,
    Thursday: 4, Friday: 5, Saturday: 6,
  };

  const today = new Date();
  const todayDay = today.getDay();
  const drawDayNumbers = drawDays.map(d => dayMap[d]).filter(d => d !== undefined);

  let minDaysAhead = 7;
  for (const drawDay of drawDayNumbers) {
    let daysAhead = drawDay - todayDay;
    if (daysAhead <= 0) daysAhead += 7;
    if (daysAhead < minDaysAhead) minDaysAhead = daysAhead;
  }

  const nextDate = new Date(today);
  nextDate.setDate(today.getDate() + minDaysAhead);
  return nextDate.toISOString().split('T')[0];
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format a timestamp as relative time (e.g. "2 minutes ago")
 */
export function formatRelativeTime(timestamp: string | Date): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}
