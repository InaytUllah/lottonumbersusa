// ============================================
// Long-form blog guides — written specifically to target
// keywords from Google Search Console data.
// ============================================

export interface BlogGuide {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  category: string;
  publishedAt: string; // ISO date
  updatedAt: string;
  readingMinutes: number;
  author: string;
  // Markdown-style content (rendered as MDX-style sections)
  sections: BlogSection[];
  faq: { question: string; answer: string }[];
  relatedGames?: string[]; // game slugs to link to
  relatedTools?: string[]; // tool paths to link to
  // For schema.org Article markup
  keywords: string[];
}

export type BlogSection =
  | { type: 'paragraph'; content: string }
  | { type: 'heading'; level: 2 | 3; content: string; id?: string }
  | { type: 'list'; ordered?: boolean; items: string[] }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'callout'; variant: 'info' | 'warning' | 'success' | 'tip'; title?: string; content: string }
  | { type: 'quote'; content: string; cite?: string }
  | { type: 'numbersList'; numbers: number[]; label: string };

// Get all guides
export function getAllGuides(): BlogGuide[] {
  return BLOG_GUIDES;
}

// Get a single guide by slug
export function getGuideBySlug(slug: string): BlogGuide | undefined {
  return BLOG_GUIDES.find(g => g.slug === slug);
}

// Get all guide slugs (for generateStaticParams)
export function getAllGuideSlugs(): string[] {
  return BLOG_GUIDES.map(g => g.slug);
}

// =====================================================
// THE GUIDES
// =====================================================

export const BLOG_GUIDES: BlogGuide[] = [];

// We import individual guides to keep this file readable
import { lotto47Guide } from './blog-guides/01-lotto-47';
import { texasTwoStepGuide } from './blog-guides/02-texas-two-step';
import { texasPick3Guide } from './blog-guides/03-texas-pick-3';
import { numberGeneratorGuide } from './blog-guides/04-number-generator';
import { megaMillionsGeneratorGuide } from './blog-guides/05-mega-millions-generator';
import { usaLotteryGuide } from './blog-guides/06-usa-lottery';
import { lottoAmericaGuide } from './blog-guides/07-lotto-america';
import { michiganLotteryGuide } from './blog-guides/08-michigan-lottery';
import { pickNumbersGuide } from './blog-guides/09-pick-numbers';
import { wheelingSystemsGuide } from './blog-guides/10-wheeling-systems';

BLOG_GUIDES.push(
  lotto47Guide,
  texasTwoStepGuide,
  texasPick3Guide,
  numberGeneratorGuide,
  megaMillionsGeneratorGuide,
  usaLotteryGuide,
  lottoAmericaGuide,
  michiganLotteryGuide,
  pickNumbersGuide,
  wheelingSystemsGuide,
);
