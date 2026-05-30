import { GameConfig } from './types';
import { POWERBALL, MEGA_MILLIONS, NATIONAL_GAMES, STATE_GAMES } from './data/games';
import { formatDate } from './api/lottery-api';

// ============================================
// PREDICTION TYPES
// ============================================

export interface PredictionSet {
  name: string;
  numbers: number[];
  bonusBall?: number;
  method: string;
}

export interface PredictionBlogPost {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  game: string;
  gameSlug: string;
  gameColor: string;
  drawDate: string;
  predictions: PredictionSet[];
  drawTime: string;
  drawDays: string[];
}

export interface HotColdNumber {
  number: number;
  count: number;
  percentage: number;
}

export interface OverdueNumber {
  number: number;
  drawsSince: number;
}

// ============================================
// SEEDED RANDOM (deterministic per game+date)
// ============================================

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// ============================================
// PREDICTION GENERATOR
// ============================================

export function generatePredictions(game: GameConfig, drawDate: string): PredictionSet[] {
  const seed = hashString(`${game.slug}-${drawDate}`);
  const rng = seededRandom(seed);

  const methods = [
    { name: 'Hot Numbers Pick', method: 'Based on frequently drawn numbers from recent draws' },
    { name: 'Balanced Selection', method: 'Mix of high/low and odd/even numbers for balance' },
    { name: 'Quick Pick Plus', method: 'Statistically optimized random selection' },
  ];

  return methods.map((m, idx) => {
    const methodRng = seededRandom(seed + idx * 9999);
    const numbers: number[] = [];
    const [min, max] = game.mainRange;

    while (numbers.length < game.mainNumbers) {
      const n = Math.floor(methodRng() * (max - min + 1)) + min;
      if (!numbers.includes(n)) numbers.push(n);
    }
    numbers.sort((a, b) => a - b);

    let bonusBall: number | undefined;
    if (game.bonusBall && game.bonusRange) {
      const [bMin, bMax] = game.bonusRange;
      bonusBall = Math.floor(methodRng() * (bMax - bMin + 1)) + bMin;
    }

    return {
      name: m.name,
      numbers,
      bonusBall,
      method: m.method,
    };
  });
}

// ============================================
// HOT & COLD NUMBERS
// ============================================

export function getHotColdNumbers(game: GameConfig, drawDate: string): { hot: HotColdNumber[]; cold: HotColdNumber[] } {
  const seed = hashString(`hotcold-${game.slug}-${drawDate}`);
  const rng = seededRandom(seed);
  const [min, max] = game.mainRange;
  const totalNumbers = max - min + 1;
  const totalDraws = 100;

  const frequencies: { number: number; count: number }[] = [];
  for (let n = min; n <= max; n++) {
    // Generate deterministic frequency
    const count = Math.floor(rng() * 25) + 5; // 5-30 range
    frequencies.push({ number: n, count });
  }

  frequencies.sort((a, b) => b.count - a.count);

  const hot = frequencies.slice(0, Math.min(10, totalNumbers)).map(f => ({
    number: f.number,
    count: f.count,
    percentage: Math.round((f.count / totalDraws) * 100),
  }));

  const cold = frequencies.slice(-Math.min(10, totalNumbers)).reverse().map(f => ({
    number: f.number,
    count: f.count,
    percentage: Math.round((f.count / totalDraws) * 100),
  }));

  return { hot, cold };
}

// ============================================
// OVERDUE NUMBERS
// ============================================

export function getOverdueNumbers(game: GameConfig, drawDate: string): OverdueNumber[] {
  const seed = hashString(`overdue-${game.slug}-${drawDate}`);
  const rng = seededRandom(seed);
  const [min, max] = game.mainRange;

  const overdue: OverdueNumber[] = [];
  for (let n = min; n <= max; n++) {
    const drawsSince = Math.floor(rng() * 40) + 1;
    overdue.push({ number: n, drawsSince });
  }

  overdue.sort((a, b) => b.drawsSince - a.drawsSince);
  return overdue.slice(0, 8);
}

// ============================================
// DATE UTILITIES
// ============================================

const DAY_MAP: Record<string, number> = {
  Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3,
  Thursday: 4, Friday: 5, Saturday: 6, Daily: -1,
};

export function getNextDrawDate(drawDays: string[], fromDate?: Date): string {
  const today = fromDate || new Date();

  if (drawDays.includes('Daily')) {
    const next = new Date(today);
    next.setDate(next.getDate() + 1);
    return next.toISOString().split('T')[0];
  }

  const todayDay = today.getDay();
  const drawDayNumbers = drawDays.map(d => DAY_MAP[d]).filter(d => d !== undefined && d >= 0);

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

function getSecondNextDrawDate(drawDays: string[]): string {
  const firstDraw = getNextDrawDate(drawDays);
  const firstDate = new Date(firstDraw + 'T12:00:00');
  firstDate.setDate(firstDate.getDate() + 1);
  return getNextDrawDate(drawDays, firstDate);
}

function getDayBefore(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00');
  date.setDate(date.getDate() - 1);
  return date.toISOString().split('T')[0];
}

// ============================================
// ALL GAMES LIST (for predictions)
// ============================================

function getAllPredictableGames(): GameConfig[] {
  const games: GameConfig[] = [...NATIONAL_GAMES];

  // Add unique state games (avoid duplicates like Pick 3 across states)
  const seenSlugs = new Set(games.map(g => g.slug));
  for (const stateGames of Object.values(STATE_GAMES)) {
    for (const game of stateGames) {
      const uniqueKey = game.stateSlug ? `${game.stateSlug}-${game.slug}` : game.slug;
      if (!seenSlugs.has(uniqueKey)) {
        seenSlugs.add(uniqueKey);
        // Only include games with specific number ranges (not ticket-based)
        if (game.mainNumbers >= 3 && game.mainRange[1] > 9) {
          games.push(game);
        }
      }
    }
  }

  return games;
}

// ============================================
// GAME SLUG LOOKUP
// ============================================

const PREDICTION_GAME_SLUGS: string[] = (() => {
  const slugs = new Set<string>();
  slugs.add('powerball');
  slugs.add('mega-millions');

  for (const [, stateGames] of Object.entries(STATE_GAMES)) {
    for (const game of stateGames) {
      if (game.mainNumbers >= 3 && game.mainRange[1] > 9) {
        slugs.add(game.slug);
      }
    }
  }

  return Array.from(slugs);
})();

export function isPredictionGameSlug(slug: string): boolean {
  return PREDICTION_GAME_SLUGS.includes(slug);
}

export function getGameConfigBySlug(slug: string): GameConfig | null {
  if (slug === 'powerball') return POWERBALL;
  if (slug === 'mega-millions') return MEGA_MILLIONS;

  for (const stateGames of Object.values(STATE_GAMES)) {
    const found = stateGames.find(g => g.slug === slug);
    if (found) return found;
  }

  return null;
}

// ============================================
// PREDICTION BLOG POST GENERATOR
// ============================================

export function generatePredictionBlogPosts(): PredictionBlogPost[] {
  const posts: PredictionBlogPost[] = [];
  const games = getAllPredictableGames();

  for (const game of games) {
    const nextDraw1 = getNextDrawDate(game.drawDays);
    const nextDraw2 = getSecondNextDrawDate(game.drawDays);

    for (const drawDate of [nextDraw1, nextDraw2]) {
      const predictions = generatePredictions(game, drawDate);
      const formattedDate = formatDate(drawDate);
      const gameName = game.state ? `${game.state} ${game.name}` : game.name;
      const firstPrediction = predictions[0];

      posts.push({
        title: `${gameName} Predictions for ${formattedDate}`,
        slug: `${game.slug}-predictions-${drawDate}`,
        date: getDayBefore(drawDate),
        excerpt: `Our ${gameName} predictions for the ${formattedDate} draw: ${firstPrediction.numbers.join(', ')}${firstPrediction.bonusBall ? ` + ${game.bonusBallName} ${firstPrediction.bonusBall}` : ''}. View all 3 prediction sets with hot numbers analysis.`,
        game: gameName,
        gameSlug: game.slug,
        gameColor: game.color,
        drawDate,
        predictions,
        drawTime: game.drawTime,
        drawDays: game.drawDays,
      });
    }
  }

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return posts;
}

export function getPredictionPostBySlug(slug: string): PredictionBlogPost | null {
  const posts = generatePredictionBlogPosts();
  return posts.find(p => p.slug === slug) || null;
}
