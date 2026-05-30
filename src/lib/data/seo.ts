import { SEOData } from '../types';

const SITE_NAME = 'Lotto Numbers USA';
const SITE_URL = 'https://lottonumbersusa.com';

export function getHomeSEO(): SEOData {
  return {
    title: 'Lottery Results Today: Powerball, Mega Millions & State Winning Numbers',
    description: 'Latest US lottery results updated after every draw. Powerball, Mega Millions, and 40+ state lottery winning numbers from official data feeds. Free ticket checker, odds calculator, and jackpot tracker.',
    canonical: SITE_URL,
  };
}

export function getGameSEO(gameName: string, gameSlug: string, stateName?: string): SEOData {
  const prefix = stateName ? `${stateName} ` : '';
  const stateSlugPart = stateName ? `/${stateName.toLowerCase().replace(/\s+/g, '-')}` : '';
  return {
    title: `${prefix}${gameName} Results Today - Latest Winning Numbers | ${SITE_NAME}`,
    description: `Check today's ${prefix}${gameName} winning numbers and results. View latest draw, past results history, jackpot amounts, hot & cold numbers, odds, and how to play. Updated instantly after every draw.`,
    canonical: stateName
      ? `${SITE_URL}${stateSlugPart}/${gameSlug}`
      : `${SITE_URL}/${gameSlug}`,
  };
}

export function getResultDateSEO(gameName: string, date: string, numbers?: number[]): SEOData {
  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const numbersStr = numbers ? ` - ${numbers.join(', ')}` : '';
  return {
    title: `${gameName} Results for ${formattedDate}${numbersStr} | ${SITE_NAME}`,
    description: `Official ${gameName} winning numbers for ${formattedDate}${numbersStr}. Check if you won, view the complete prize breakdown, next jackpot estimate, and previous draw results.`,
  };
}

export function getStateSEO(stateName: string): SEOData {
  return {
    title: `${stateName} Lottery Results Today - All ${stateName} Lotto Winning Numbers | ${SITE_NAME}`,
    description: `Get the latest ${stateName} lottery results for all games including Powerball, Mega Millions, and ${stateName}-specific games. Winning numbers updated instantly after every draw. View past results, jackpots, and odds.`,
    canonical: `${SITE_URL}/${stateName.toLowerCase().replace(/\s+/g, '-')}`,
  };
}

export function getToolSEO(toolName: string, toolDescription: string): SEOData {
  return {
    title: `Free ${toolName} - ${toolDescription} | ${SITE_NAME}`,
    description: `${toolDescription} Use our free ${toolName.toLowerCase()} for Powerball, Mega Millions, and all US state lottery games. No signup required.`,
  };
}

export function getBlogSEO(): SEOData {
  return {
    title: `Lottery News, Results & Analysis Blog | ${SITE_NAME}`,
    description: 'Latest US lottery news, Powerball & Mega Millions results analysis, jackpot alerts, winning number trends, and lottery tips. Updated daily.',
  };
}

export { SITE_NAME, SITE_URL };
