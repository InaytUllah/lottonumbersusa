import { Metadata } from 'next';
import Link from 'next/link';
import LotteryBalls from '@/components/LotteryBalls';
import Countdown from '@/components/Countdown';
import { getLatestResult, fetchPastResults, formatDate, formatShortDate } from '@/lib/api/lottery-api';
import { POWERBALL } from '@/lib/data/games';
import { getGameSEO } from '@/lib/data/seo';

export const revalidate = 300;

const seo = getGameSEO('Powerball', 'powerball');
export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
};

export default async function PowerballPage() {
  const [latestResult, pastResults] = await Promise.all([
    getLatestResult('powerball'),
    fetchPastResults('powerball', 20),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">Powerball</span>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-2xl p-6 sm:p-10 mb-8 text-white">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Powerball Results</h1>
            <p className="text-red-100 text-lg">
              Latest winning numbers updated after every draw
            </p>
            {latestResult && (
              <p className="text-red-200 text-sm mt-2">
                Last Draw: {formatDate(latestResult.drawDate)}
              </p>
            )}
          </div>

          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            {latestResult?.nextDrawDate && (
              <Countdown
                targetDate={latestResult.nextDrawDate}
                drawTime={POWERBALL.drawTime}
                label="Next Draw"
              />
            )}
          </div>
        </div>

        {/* Latest Numbers */}
        {latestResult && (
          <div className="mt-8 bg-white/10 backdrop-blur rounded-xl p-6">
            <p className="text-sm text-red-200 mb-3">Winning Numbers</p>
            <LotteryBalls
              numbers={latestResult.numbers}
              bonusBall={latestResult.bonusBall}
              bonusBallName="Powerball"
              multiplier={latestResult.multiplier}
              multiplierName="Power Play"
              size="lg"
              gameColor="#e4002b"
            />
            {latestResult.jackpot && (
              <div className="mt-4 flex items-center gap-4">
                <div>
                  <p className="text-xs text-red-200">Jackpot</p>
                  <p className="text-2xl font-bold">{latestResult.jackpot}</p>
                </div>
                {latestResult.nextJackpot && (
                  <div>
                    <p className="text-xs text-red-200">Next Estimated Jackpot</p>
                    <p className="text-2xl font-bold text-yellow-300">{latestResult.nextJackpot}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Past Results */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Past Powerball Results
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Numbers</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">PB</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">PP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {pastResults.map((result, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                      <td className="px-4 py-3">
                        <Link
                          href={`/powerball/results/${result.drawDate}`}
                          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {formatShortDate(result.drawDate)}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5">
                          {result.numbers.map((n, i) => (
                            <span key={i} className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs font-bold text-gray-700 dark:text-white">
                              {n}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-xs font-bold text-white">
                          {result.bonusBall}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {result.multiplier ? `${result.multiplier}x` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Game Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-5">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3">About Powerball</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{POWERBALL.description}</p>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Draw Days:</span>
                <span className="font-medium text-gray-900 dark:text-white">{POWERBALL.drawDays.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Draw Time:</span>
                <span className="font-medium text-gray-900 dark:text-white">{POWERBALL.drawTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Ticket Price:</span>
                <span className="font-medium text-gray-900 dark:text-white">${POWERBALL.ticketPrice}</span>
              </div>
            </div>
          </div>

          {/* Odds Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-5">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3">Powerball Odds</h3>
            <div className="space-y-2">
              {Object.entries(POWERBALL.odds).map(([match, odds]) => (
                <div key={match} className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{match}</span>
                  <span className="font-mono text-gray-900 dark:text-white text-xs">{odds}</span>
                </div>
              ))}
            </div>
          </div>

          {/* How to Play */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-5">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3">How to Play</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{POWERBALL.howToPlay}</p>
          </div>

          {/* Quick Links */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-5">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/number-generator" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  Powerball Number Generator
                </Link>
              </li>
              <li>
                <Link href="/number-frequency" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  Powerball Number Frequency
                </Link>
              </li>
              <li>
                <Link href="/mega-millions" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  Mega Millions Results
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* SEO Content */}
      <section className="mt-12 prose dark:prose-invert max-w-none">
        <h2>Powerball Winning Numbers Today</h2>
        <p>
          Check the latest Powerball winning numbers right here at LottoNumbersUSA.com. Powerball draws take place
          every Monday, Wednesday, and Saturday at 10:59 PM ET. Our results are updated within minutes of the
          official draw, so you can quickly check if you are a winner.
        </p>
        <h3>How to Win Powerball</h3>
        <p>
          To win the Powerball jackpot, you need to match all 5 white balls (drawn from a pool of 1-69) plus the
          red Powerball (drawn from a pool of 1-26). The odds of winning the jackpot are approximately 1 in 292 million.
          However, there are 9 different prize tiers, and the overall odds of winning any prize are approximately 1 in 24.87.
        </p>
      </section>
    </div>
  );
}
