import Link from 'next/link';
import { fetchPastResults, formatDate } from '@/lib/api/lottery-api';

export default async function HomepageNews() {
  const [pbResults, mmResults] = await Promise.all([
    fetchPastResults('powerball', 4),
    fetchPastResults('mega-millions', 4),
  ]);

  const items = [
    ...pbResults.map(r => {
      const sum = r.numbers.reduce((a, b) => a + b, 0);
      const oddCount = r.numbers.filter(n => n % 2 !== 0).length;
      return {
        title: `Powerball numbers for ${formatDate(r.drawDate)}`,
        slug: r.drawDate,
        excerpt: `Winning: ${r.numbers.join(', ')} · PB: ${r.bonusBall ?? 'N/A'}${r.multiplier ? ` · ${r.multiplier}x Power Play` : ''}. Sum ${sum}, ${oddCount}/${5 - oddCount} odd/even.`,
        date: r.drawDate,
        game: 'Powerball',
        color: 'red',
        href: `/powerball/results/${r.drawDate}`,
      };
    }),
    ...mmResults.map(r => {
      const sum = r.numbers.reduce((a, b) => a + b, 0);
      const oddCount = r.numbers.filter(n => n % 2 !== 0).length;
      return {
        title: `Mega Millions numbers for ${formatDate(r.drawDate)}`,
        slug: r.drawDate,
        excerpt: `Winning: ${r.numbers.join(', ')} · MB: ${r.bonusBall ?? 'N/A'}. Sum ${sum}, ${oddCount}/${5 - oddCount} odd/even.`,
        date: r.drawDate,
        game: 'Mega Millions',
        color: 'blue',
        href: `/mega-millions/results/${r.drawDate}`,
      };
    }),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  if (items.length === 0) return null;

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Recent draw analysis</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Latest results with number breakdown</p>
        </div>
        <Link href="/blog" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 transition-colors whitespace-nowrap">
          All results →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, i) => (
          <Link
            key={i}
            href={item.href}
            className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                item.color === 'red'
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                  : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
              }`}>
                {item.game}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(item.date)}</span>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
              {item.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
              {item.excerpt}
            </p>
            <div className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400">
              View full draw analysis
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
