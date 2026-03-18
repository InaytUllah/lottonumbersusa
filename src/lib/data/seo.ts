import { SEOData } from '../types';

const SITE_NAME = 'Lotto Numbers USA';
const SITE_URL = 'https://lottonumbersusa.com';

export function getHomeSEO(): SEOData {
  return {
    title: 'Lotto Numbers USA - Latest US Lottery Results & Winning Numbers',
    description: 'Get the latest Powerball, Mega Millions, and state lottery results. Updated instantly after every draw. Check winning numbers, jackpots, and past results.',
    keywords: ['lotto numbers usa', 'us lottery results', 'powerball results', 'mega millions results', 'lottery winning numbers', 'us lotto results today'],
    canonical: SITE_URL,
  };
}

export function getGameSEO(gameName: string, gameSlug: string, stateName?: string): SEOData {
  const prefix = stateName ? `${stateName} ` : '';
  return {
    title: `${prefix}${gameName} Results - Latest Winning Numbers | ${SITE_NAME}`,
    description: `Latest ${prefix}${gameName} winning numbers and results. Check today's draw, past results, jackpot amounts, number frequency and more.`,
    keywords: [
      `${gameName.toLowerCase()} results`,
      `${gameName.toLowerCase()} winning numbers`,
      `${gameName.toLowerCase()} numbers today`,
      `${gameName.toLowerCase()} lottery`,
      stateName ? `${stateName.toLowerCase()} ${gameName.toLowerCase()}` : '',
    ].filter(Boolean),
    canonical: stateName
      ? `${SITE_URL}/${gameSlug}`
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
  const numbersStr = numbers ? `: ${numbers.join(', ')}` : '';
  return {
    title: `${gameName} Results for ${formattedDate}${numbersStr} | ${SITE_NAME}`,
    description: `${gameName} winning numbers for ${formattedDate}${numbersStr}. Check if you won, view prize breakdown, and see past results.`,
    keywords: [
      `${gameName.toLowerCase()} results ${date}`,
      `${gameName.toLowerCase()} winning numbers ${formattedDate}`,
      `${gameName.toLowerCase()} ${date}`,
    ],
  };
}

export function getStateSEO(stateName: string): SEOData {
  return {
    title: `${stateName} Lottery Results - All ${stateName} Lotto Numbers | ${SITE_NAME}`,
    description: `Latest ${stateName} lottery results for all games. Check Powerball, Mega Millions, and ${stateName}-specific lottery winning numbers updated instantly.`,
    keywords: [
      `${stateName.toLowerCase()} lottery results`,
      `${stateName.toLowerCase()} lotto numbers`,
      `${stateName.toLowerCase()} winning numbers`,
      `${stateName.toLowerCase()} lottery`,
    ],
  };
}

export function getToolSEO(toolName: string, toolDescription: string): SEOData {
  return {
    title: `${toolName} | ${SITE_NAME}`,
    description: toolDescription,
    keywords: [toolName.toLowerCase(), 'lottery tools', 'lotto numbers'],
  };
}

export function getBlogSEO(): SEOData {
  return {
    title: `Lottery News & Results Blog | ${SITE_NAME}`,
    description: 'Latest lottery news, jackpot alerts, winning number analysis, and tips. Stay updated with the biggest lottery stories across the US.',
    keywords: ['lottery news', 'lottery blog', 'jackpot alerts', 'lottery tips'],
  };
}

export { SITE_NAME, SITE_URL };
