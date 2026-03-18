import { Metadata } from 'next';
import Link from 'next/link';
import AdSlot from '@/components/AdSlot';
import { fetchPastResults, formatDate } from '@/lib/api/lottery-api';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Lottery News & Results Blog',
  description: 'Latest lottery news, jackpot alerts, result analysis, and tips. Stay updated with Powerball, Mega Millions, and state lottery news.',
};

export default async function BlogPage() {
  const [pbResults, mmResults] = await Promise.all([
    fetchPastResults('powerball', 5),
    fetchPastResults('mega-millions', 5),
  ]);

  // Auto-generate blog posts from recent results
  const posts = [
    ...pbResults.map(r => ({
      title: `Powerball Results for ${formatDate(r.drawDate)}: Winning Numbers ${r.numbers.join(', ')}`,
      slug: `powerball-results-${r.drawDate}`,
      date: r.drawDate,
      excerpt: `The Powerball winning numbers for ${formatDate(r.drawDate)} are ${r.numbers.join(', ')} with Powerball ${r.bonusBall}. ${r.multiplier ? `Power Play was ${r.multiplier}x.` : ''} Check if your numbers match!`,
      game: 'Powerball',
      link: `/powerball/results/${r.drawDate}`,
    })),
    ...mmResults.map(r => ({
      title: `Mega Millions Results for ${formatDate(r.drawDate)}: Numbers ${r.numbers.join(', ')}`,
      slug: `mega-millions-results-${r.drawDate}`,
      date: r.drawDate,
      excerpt: `The Mega Millions winning numbers for ${formatDate(r.drawDate)} are ${r.numbers.join(', ')} with Mega Ball ${r.bonusBall}. ${r.multiplier ? `Megaplier was ${r.multiplier}x.` : ''}`,
      game: 'Mega Millions',
      link: `/mega-millions/results/${r.drawDate}`,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">Blog</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
        Lottery News & Results
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
        Latest lottery results, jackpot alerts, and analysis
      </p>

      <AdSlot slot="blog-top" format="horizontal" className="mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {posts.map(post => (
            <article
              key={post.slug}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  post.game === 'Powerball'
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                }`}>
                  {post.game}
                </span>
                <time className="text-xs text-gray-500 dark:text-gray-400">{formatDate(post.date)}</time>
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                <Link href={post.link} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {post.title}
                </Link>
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{post.excerpt}</p>
              <Link
                href={post.link}
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 transition-colors"
              >
                View full results &rarr;
              </Link>
            </article>
          ))}
        </div>

        <div className="space-y-6">
          <AdSlot slot="blog-sidebar" format="rectangle" />

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-5">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3">Popular Pages</h3>
            <ul className="space-y-2">
              <li><Link href="/powerball" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Powerball Results</Link></li>
              <li><Link href="/mega-millions" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Mega Millions Results</Link></li>
              <li><Link href="/jackpot-tracker" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Jackpot Tracker</Link></li>
              <li><Link href="/number-generator" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Number Generator</Link></li>
              <li><Link href="/number-frequency" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Number Frequency</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
