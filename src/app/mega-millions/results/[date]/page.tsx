import { Metadata } from 'next';
import Link from 'next/link';
import LotteryBalls from '@/components/LotteryBalls';
import { fetchPastResults, formatDate } from '@/lib/api/lottery-api';
import { MEGA_MILLIONS } from '@/lib/data/games';
import { getResultDateSEO } from '@/lib/data/seo';

// Static export: enumerate all dated result pages at build time. Dates
// outside this set return 404 (no on-demand generation in static export).
export const dynamicParams = false;

export async function generateStaticParams() {
  const results = await fetchPastResults('mega-millions', 100);
  return results.map(r => ({ date: r.drawDate }));
}

export async function generateMetadata({ params }: { params: Promise<{ date: string }> }): Promise<Metadata> {
  const { date } = await params;
  const seo = getResultDateSEO('Mega Millions', date);
  return { title: seo.title, description: seo.description };
}

export default async function MegaMillionsResultDatePage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;

  const allResults = await fetchPastResults('mega-millions', 100);
  const result = allResults.find(r => r.drawDate === date);
  const resultIndex = allResults.findIndex(r => r.drawDate === date);
  const prevResult = resultIndex < allResults.length - 1 ? allResults[resultIndex + 1] : null;
  const nextResult = resultIndex > 0 ? allResults[resultIndex - 1] : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/mega-millions" className="hover:text-blue-600 transition-colors">Mega Millions</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">{formatDate(date)}</span>
      </nav>

      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Mega Millions Results for {formatDate(date)}
      </h1>

      {result ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 sm:p-8 mb-8">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Winning Numbers</p>
          <LotteryBalls
            numbers={result.numbers}
            bonusBall={result.bonusBall}
            bonusBallName="Mega Ball"
            multiplier={result.multiplier}
            multiplierName="Megaplier"
            size="lg"
            gameColor={MEGA_MILLIONS.color}
          />
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500">White Balls</p>
              <p className="font-bold text-gray-900 dark:text-white">{result.numbers.join(', ')}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500">Mega Ball</p>
              <p className="font-bold text-blue-600">{result.bonusBall}</p>
            </div>
            {result.multiplier && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500">Megaplier</p>
                <p className="font-bold text-yellow-600">{result.multiplier}x</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 mb-8 text-center">
          <p className="text-yellow-800 dark:text-yellow-200">
            No Mega Millions draw on this date, or results not yet available.
          </p>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        {prevResult ? (
          <Link href={`/mega-millions/results/${prevResult.drawDate}`} className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            {formatDate(prevResult.drawDate)}
          </Link>
        ) : <div />}
        {nextResult ? (
          <Link href={`/mega-millions/results/${nextResult.drawDate}`} className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
            {formatDate(nextResult.drawDate)}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
