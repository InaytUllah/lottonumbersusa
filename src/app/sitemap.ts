import { MetadataRoute } from 'next';
import { STATES } from '@/lib/data/states';
import { STATE_GAMES } from '@/lib/data/games';
import { generatePredictionBlogPosts, isPredictionGameSlug } from '@/lib/predictions';
import { getAllGuides } from '@/lib/data/blog-guides';

const SITE_URL = 'https://lottonumbersusa.com';

// Required under output: 'export' so sitemap.xml is emitted as a static file.
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: 'hourly', priority: 1.0 },
    { url: `${SITE_URL}/powerball`, lastModified: now, changeFrequency: 'daily', priority: 0.95 },
    { url: `${SITE_URL}/mega-millions`, lastModified: now, changeFrequency: 'daily', priority: 0.95 },
    { url: `${SITE_URL}/states`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/check-your-numbers`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/number-generator`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/odds-calculator`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/tax-calculator`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${SITE_URL}/jackpot-tracker`, lastModified: now, changeFrequency: 'daily', priority: 0.85 },
    { url: `${SITE_URL}/number-frequency`, lastModified: now, changeFrequency: 'daily', priority: 0.75 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
    { url: `${SITE_URL}/blog/predictions`, lastModified: now, changeFrequency: 'daily', priority: 0.85 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/disclaimer`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const statePages: MetadataRoute.Sitemap = STATES.map(state => ({
    url: `${SITE_URL}/${state.slug}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.85,
  }));

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

  // Prediction landing pages (game-specific)
  const predictionGamePages: MetadataRoute.Sitemap = [
    'powerball', 'mega-millions', 'superlotto-plus', 'lotto-texas',
    'florida-lotto', 'new-york-lotto', 'classic-lotto', 'lotto-47',
  ].filter(isPredictionGameSlug).map(slug => ({
    url: `${SITE_URL}/blog/predictions/${slug}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.85,
  }));

  // Prediction blog posts
  const predictionPosts: MetadataRoute.Sitemap = generatePredictionBlogPosts().slice(0, 30).map(post => ({
    url: `${SITE_URL}/blog/predictions/${post.slug}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  // Long-form blog guides (high priority — these are our main content)
  const guidePages: MetadataRoute.Sitemap = getAllGuides().map(guide => ({
    url: `${SITE_URL}/blog/guides/${guide.slug}`,
    lastModified: guide.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...staticPages, ...statePages, ...gamePages, ...predictionGamePages, ...predictionPosts, ...guidePages];
}
