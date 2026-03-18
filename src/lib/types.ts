// ============================================
// LOTTERY DATA TYPES
// ============================================

export interface LotteryResult {
  game: string;
  gameSlug: string;
  drawDate: string; // YYYY-MM-DD
  numbers: number[];
  bonusBall?: number;
  bonusBallName?: string; // "Powerball", "Mega Ball", etc.
  multiplier?: number;
  multiplierName?: string; // "Power Play", "Megaplier", etc.
  jackpot?: string;
  nextJackpot?: string;
  nextDrawDate?: string;
}

export interface GameConfig {
  name: string;
  slug: string;
  state?: string;
  stateSlug?: string;
  mainNumbers: number; // how many main numbers drawn
  mainRange: [number, number]; // [min, max]
  bonusBall: boolean;
  bonusBallName?: string;
  bonusRange?: [number, number];
  multiplier: boolean;
  multiplierName?: string;
  drawDays: string[]; // ["Monday", "Wednesday", "Saturday"]
  drawTime: string; // "10:59 PM ET"
  ticketPrice: number;
  color: string; // primary brand color
  icon: string; // emoji or icon identifier
  description: string;
  howToPlay: string;
  odds: Record<string, string>;
}

export interface StateConfig {
  name: string;
  slug: string;
  abbreviation: string;
  games: GameConfig[];
  officialSite: string;
  population: number;
  region: string;
}

export interface BlogPost {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  content: string;
  game: string;
  gameSlug: string;
  tags: string[];
}

export interface JackpotInfo {
  game: string;
  gameSlug: string;
  amount: string;
  nextDraw: string;
  state?: string;
}

export interface NumberFrequency {
  number: number;
  count: number;
  percentage: number;
  lastDrawn: string;
}

export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  canonical?: string;
  ogImage?: string;
}
