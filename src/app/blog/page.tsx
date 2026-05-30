import { Metadata } from 'next';
import Link from 'next/link';
import { fetchPastResults, formatDate } from '@/lib/api/lottery-api';
import { getAllGuides } from '@/lib/data/blog-guides';


export const metadata: Metadata = {
  title: 'Lottery Guides, News & Results Analysis',
  description: 'In-depth lottery guides, drawing results analysis, and strategy articles. Powerball, Mega Millions, state-specific games, tax calculators, and number generator guides.',
  alternates: { canonical: 'https://lottonumbersusa.com/blog' },
};

export default async function BlogPage() {
  const [pbResults, mmResults] = await Promise.all([
    fetchPastResults('powerball', 4),
    fetchPastResults('mega-millions', 4),
  ]);

  const guides = getAllGuides();

  // Auto-generated result posts
  const resultPosts = [
    ...pbResults.map(r => ({
      title: `Powerball Results for ${formatDate(r.drawDate)}: Winning Numbers ${r.numbers.join(', ')}`,
      slug: `powerball-results-${r.drawDate}`,
      date: r.drawDate,
      excerpt: `Powerball winning numbers ${r.numbers.join(', ')} with Powerball ${r.bonusBall ?? 'N/A'}.${r.multiplier ? ` Power Play ${r.multiplier}x.` : ''}`,
      game: 'Powerball',
      link: `/powerball/results/${r.drawDate}`,
    })),
    ...mmResults.map(r => ({
      title: `Mega Millions Results for ${formatDate(r.drawDate)}: Numbers ${r.numbers.join(', ')}`,
      slug: `mega-millions-results-${r.drawDate}`,
      date: r.drawDate,
      excerpt: `Mega Millions winning numbers ${r.numbers.join(', ')} with Mega Ball ${r.bonusBall ?? 'N/A'}.`,
      game: 'Mega Millions',
      link: `/mega-millions/results/${r.drawDate}`,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Group guides by category
  const guidesByCategory = guides.reduce((acc, g) => {
    if (!acc[g.category]) acc[g.category] = [];
    acc[g.category].push(g);
    return acc;
  }, {} as Record<string, typeof guides>);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">Blog</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Lottery Guides &amp; Results Analysis
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
          In-depth guides on every major US lottery game, plus daily result analysis. Game rules, odds, real strategies, and the math you need to know — written by humans, no fluff.
        </p>
      </header>

      {/* Featured Guides */}
      <section id="guides" className="mb-12">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Complete guides</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Long-form lottery articles, 2,000+ words each</p>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">{guides.length} guides</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {guides.map((guide, i) => (
            <Link
              key={guide.slug}
              href={`/blog/guides/${guide.slug}`}
              className={`group bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all ${
                i === 0 ? 'md:col-span-2 lg:col-span-1 lg:row-span-2 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20' : ''
              }`}
            >
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                  {guide.category}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{guide.readingMinutes} min</span>
              </div>
              <h3 className={`font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug ${
                i === 0 ? 'text-xl' : 'text-base'
              }`}>
                {guide.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">
                {guide.excerpt}
              </p>
              <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 dark:text-blue-400">
                Read guide
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Browse by category */}
      <section className="mb-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Browse by topic</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(guidesByCategory).map(([category, guides]) => (
            <div key={category}>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">{category}</h3>
              <ul className="space-y-1.5">
                {guides.map(g => (
                  <li key={g.slug}>
                    <Link
                      href={`/blog/guides/${g.slug}`}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline leading-snug"
                    >
                      {g.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Recent results */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recent draw results</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Latest Powerball and Mega Millions results</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {resultPosts.map(post => (
            <article
              key={post.slug}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  post.game === 'Powerball'
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                }`}>
                  {post.game}
                </span>
                <time className="text-xs text-gray-500 dark:text-gray-400">{formatDate(post.date)}</time>
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 leading-snug">
                <Link href={post.link} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {post.title}
                </Link>
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{post.excerpt}</p>
              <Link
                href={post.link}
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 transition-colors"
              >
                View results &rarr;
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
