import { LotteryResult } from '../types';

const RESULTS_CACHE = new Map<string, { data: LotteryResult; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// ============================================
// PRIMARY: Fetch from free lottery APIs
// ============================================

// Lottery results API (free, no key needed for basic usage)
async function fetchFromLotteryAPI(game: string): Promise<LotteryResult | null> {
  try {
    // Using a public lottery data endpoint
    const endpoints: Record<string, string> = {
      powerball: 'https://data.ny.gov/resource/d6yy-54nr.json?$limit=1&$order=draw_date%20DESC',
      'mega-millions': 'https://data.ny.gov/resource/5xaw-6ayf.json?$limit=1&$order=draw_date%20DESC',
    };

    const url = endpoints[game];
    if (!url) return null;

    const response = await fetch(url, {
      next: { revalidate: 300 }, // Cache for 5 min
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) return null;

    const data = await response.json();
    if (!data || data.length === 0) return null;

    const draw = data[0];

    if (game === 'powerball') {
      const numbers = draw.winning_numbers?.split(' ').map(Number) || [];
      const mainNumbers = numbers.slice(0, 5);
      const powerball = numbers[5];
      return {
        game: 'Powerball',
        gameSlug: 'powerball',
        drawDate: draw.draw_date?.split('T')[0] || '',
        numbers: mainNumbers,
        bonusBall: powerball,
        bonusBallName: 'Powerball',
        multiplier: draw.multiplier ? Number(draw.multiplier) : undefined,
        multiplierName: 'Power Play',
      };
    }

    if (game === 'mega-millions') {
      const numbers = draw.winning_numbers?.split(' ').map(Number) || [];
      const mainNumbers = numbers.slice(0, 5);
      const megaBall = numbers[5];
      return {
        game: 'Mega Millions',
        gameSlug: 'mega-millions',
        drawDate: draw.draw_date?.split('T')[0] || '',
        numbers: mainNumbers,
        bonusBall: megaBall,
        bonusBallName: 'Mega Ball',
        multiplier: draw.mega_ball ? Number(draw.multiplier) : undefined,
        multiplierName: 'Megaplier',
      };
    }

    return null;
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
  try {
    const endpoints: Record<string, string> = {
      powerball: `https://data.ny.gov/resource/d6yy-54nr.json?$limit=${limit}&$order=draw_date%20DESC`,
      'mega-millions': `https://data.ny.gov/resource/5xaw-6ayf.json?$limit=${limit}&$order=draw_date%20DESC`,
    };

    const url = endpoints[game];
    if (!url) return [];

    const response = await fetch(url, {
      next: { revalidate: 300 },
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) return [];

    const data = await response.json();

    return data.map((draw: Record<string, string>) => {
      const numbers = draw.winning_numbers?.split(' ').map(Number) || [];

      if (game === 'powerball') {
        return {
          game: 'Powerball',
          gameSlug: 'powerball',
          drawDate: draw.draw_date?.split('T')[0] || '',
          numbers: numbers.slice(0, 5),
          bonusBall: numbers[5],
          bonusBallName: 'Powerball',
          multiplier: draw.multiplier ? Number(draw.multiplier) : undefined,
          multiplierName: 'Power Play',
        };
      }

      return {
        game: 'Mega Millions',
        gameSlug: 'mega-millions',
        drawDate: draw.draw_date?.split('T')[0] || '',
        numbers: numbers.slice(0, 5),
        bonusBall: numbers[5],
        bonusBallName: 'Mega Ball',
        multiplier: draw.multiplier ? Number(draw.multiplier) : undefined,
        multiplierName: 'Megaplier',
      };
    });
  } catch (error) {
    console.error(`Failed to fetch past results for ${game}:`, error);
    return [];
  }
}

// ============================================
// MAIN: Get latest result (with caching)
// ============================================

export async function getLatestResult(gameSlug: string): Promise<LotteryResult | null> {
  // Check cache
  const cached = RESULTS_CACHE.get(gameSlug);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  // Try API first
  const result = await fetchFromLotteryAPI(gameSlug);

  if (result) {
    RESULTS_CACHE.set(gameSlug, { data: result, timestamp: Date.now() });
    return result;
  }

  // Return sample data as fallback (for development/when APIs are down)
  return getSampleResult(gameSlug);
}

// ============================================
// Sample data for development & fallback
// ============================================

function getSampleResult(gameSlug: string): LotteryResult {
  const today = new Date().toISOString().split('T')[0];

  const samples: Record<string, LotteryResult> = {
    powerball: {
      game: 'Powerball',
      gameSlug: 'powerball',
      drawDate: today,
      numbers: [7, 14, 33, 46, 59],
      bonusBall: 12,
      bonusBallName: 'Powerball',
      multiplier: 3,
      multiplierName: 'Power Play',
      jackpot: '$284 Million',
      nextJackpot: '$312 Million',
      nextDrawDate: getNextDrawDate(['Monday', 'Wednesday', 'Saturday']),
    },
    'mega-millions': {
      game: 'Mega Millions',
      gameSlug: 'mega-millions',
      drawDate: today,
      numbers: [3, 21, 35, 52, 67],
      bonusBall: 18,
      bonusBallName: 'Mega Ball',
      multiplier: 2,
      multiplierName: 'Megaplier',
      jackpot: '$415 Million',
      nextJackpot: '$450 Million',
      nextDrawDate: getNextDrawDate(['Tuesday', 'Friday']),
    },
  };

  // Generate generic sample for state games
  if (!samples[gameSlug]) {
    return {
      game: gameSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      gameSlug,
      drawDate: today,
      numbers: [5, 12, 23, 34, 41],
      jackpot: '$50,000',
    };
  }

  return samples[gameSlug];
}

// ============================================
// Utility functions
// ============================================

function getNextDrawDate(drawDays: string[]): string {
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
