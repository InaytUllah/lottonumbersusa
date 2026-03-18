import { MetadataRoute } from 'next';
import { STATES } from '@/lib/data/states';
import { STATE_GAMES, NATIONAL_GAMES } from '@/lib/data/games';

const SITE_URL = 'https://lottonumbersusa.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: 'hourly', priority: 1.0 },
    { url: `${SITE_URL}/powerball`, lastModified: now, changeFrequency: 'daily', priority: 0.95 },
    { url: `${SITE_URL}/mega-millions`, lastModified: now, changeFrequency: 'daily', priority: 0.95 },
    { url: `${SITE_URL}/states`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/number-generator`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/odds-calculator`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/jackpot-tracker`, lastModified: now, changeFrequency: 'daily', priority: 0.85 },
    { url: `${SITE_URL}/number-frequency`, lastModified: now, changeFrequency: 'daily', priority: 0.75 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
  ];

  // State pages
  const statePages: MetadataRoute.Sitemap = STATES.map(state => ({
    url: `${SITE_URL}/${state.slug}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.85,
  }));

  // Game pages
  const gamePages: MetadataRoute.Sitemap = [];
  Object.entries(STATE_GAMES).forEach(([stateSlug, games]) => {
    games.forEach(game => {
      gamePages.push({
        url: `${SITE_URL}/${stateSlug}/${game.slug}`,
        lastModified: now,
        changeFrequency: 'daily' as const,
        priority: 0.8,
      });
    });
  });

  // How-to-play pages
  const howToPlayPages: MetadataRoute.Sitemap = [
    ...NATIONAL_GAMES,
    ...Object.values(STATE_GAMES).flat(),
  ].map(game => ({
    url: `${SITE_URL}/how-to-play/${game.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...statePages, ...gamePages, ...howToPlayPages];
}
