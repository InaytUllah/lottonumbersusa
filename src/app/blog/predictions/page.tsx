import { Metadata } from 'next';
import Link from 'next/link';
import JsonLd, { getBreadcrumbSchema } from '@/components/JsonLd';
import { generatePredictionBlogPosts } from '@/lib/predictions';
import { formatDate } from '@/lib/api/lottery-api';


export const metadata: Metadata = {
  title: 'Lottery Predictions - Powerball, Mega Millions & State Games',
  description: 'Free daily lottery predictions for Powerball, Mega Millions, and US state lottery games. Hot numbers, cold numbers, and statistical analysis for every upcoming draw.',
  alternates: { canonical: '/blog/predictions' },
};

export default function PredictionsPage() {
  const posts = generatePredictionBlogPosts();

  // Schema for ItemList
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Lottery Predictions',
    description: 'Daily lottery predictions for US lottery games',
    numberOfItems: posts.length,
    itemListElement: posts.slice(0, 20).map((post, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: post.title,
      url: `https://lottonumbersusa.com/blog/predictions/${post.slug}`,
    })),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <JsonLd data={getBreadcrumbSchema([
        { name: 'Home', url: 'https://lottonumbersusa.com' },
        { name: 'Blog', url: 'https://lottonumbersusa.com/blog' },
        { name: 'Predictions', url: 'https://lottonumbersusa.com/blog/predictions' },
      ])} />
      <JsonLd data={itemListSchema} />

      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-blue-600 transition-colors">Blog</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">Predictions</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
        Lottery Predictions
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
        Free daily predictions for Powerball, Mega Millions, and state lottery games based on statistical analysis.
      </p>

      {/* Game-specific prediction landing pages */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Predictions by Game</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[
            { name: 'Powerball', slug: 'powerball', color: '#e4002b' },
            { name: 'Mega Millions', slug: 'mega-millions', color: '#0066b2' },
            { name: 'SuperLotto Plus', slug: 'superlotto-plus', color: '#FFD700' },
            { name: 'Lotto Texas', slug: 'lotto-texas', color: '#003366' },
            { name: 'Florida Lotto', slug: 'florida-lotto', color: '#FF6600' },
            { name: 'NY Lotto', slug: 'new-york-lotto', color: '#1C1C7A' },
            { name: 'Classic Lotto', slug: 'classic-lotto', color: '#CC0000' },
            { name: 'Lotto 47', slug: 'lotto-47', color: '#003B6F' },
          ].map(game => (
            <Link
              key={game.slug}
              href={`/blog/predictions/${game.slug}`}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 hover:shadow-md transition-all text-center group"
            >
              <div className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: game.color }}>
                {game.name.charAt(0)}
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{game.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">View predictions</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Prediction blog posts grid */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Upcoming Draw Predictions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.slice(0, 30).map(post => (
            <article
              key={post.slug}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Color accent bar */}
              <div className="h-1.5" style={{ backgroundColor: post.gameColor }} />

              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: post.gameColor }}
                  >
                    {post.game}
                  </span>
                  <time className="text-xs text-gray-500 dark:text-gray-400">{formatDate(post.drawDate)}</time>
                </div>

                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  <Link href={`/blog/predictions/${post.slug}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {post.title}
                  </Link>
                </h3>

                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{post.excerpt}</p>

                <Link
                  href={`/blog/predictions/${post.slug}`}
                  className="text-xs font-medium hover:underline transition-colors"
                  style={{ color: post.gameColor }}
                >
                  View predictions &rarr;
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SEO Content */}
      <section className="mt-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About Our Lottery Predictions</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Our <strong className="text-gray-900 dark:text-white">free lottery predictions</strong> are generated daily for every upcoming draw. We analyze historical draw data including <strong className="text-gray-900 dark:text-white">hot numbers</strong> (most frequently drawn), <strong className="text-gray-900 dark:text-white">cold numbers</strong> (least frequently drawn), and <strong className="text-gray-900 dark:text-white">overdue numbers</strong> (longest since last appearance) to create 3 unique prediction sets for each game.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Our Prediction Methods</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                <span><strong className="text-gray-900 dark:text-white">Hot Numbers Pick</strong> — Based on the most frequently drawn numbers from the last 100 draws</span>
              </li>
              <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                <span><strong className="text-gray-900 dark:text-white">Balanced Selection</strong> — Optimized mix of high/low and odd/even numbers</span>
              </li>
              <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                <span><strong className="text-gray-900 dark:text-white">Quick Pick Plus</strong> — Statistically optimized random selection algorithm</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Related Tools</h3>
            <div className="flex flex-wrap gap-2">
              <Link href="/number-generator" className="px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 hover:opacity-80 transition-opacity">Number Generator</Link>
              <Link href="/number-frequency" className="px-3 py-1.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 hover:opacity-80 transition-opacity">Number Frequency</Link>
              <Link href="/check-your-numbers" className="px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:opacity-80 transition-opacity">Check Your Numbers</Link>
              <Link href="/odds-calculator" className="px-3 py-1.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 hover:opacity-80 transition-opacity">Odds Calculator</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
