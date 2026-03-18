import { Metadata } from 'next';
import Link from 'next/link';
import LotteryBalls from '@/components/LotteryBalls';
import Countdown from '@/components/Countdown';
import AdSlot from '@/components/AdSlot';
import { getLatestResult, fetchPastResults, formatDate, formatShortDate } from '@/lib/api/lottery-api';
import { MEGA_MILLIONS } from '@/lib/data/games';
import { getGameSEO } from '@/lib/data/seo';

export const revalidate = 300;

const seo = getGameSEO('Mega Millions', 'mega-millions');
export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
};

export default async function MegaMillionsPage() {
  const [latestResult, pastResults] = await Promise.all([
    getLatestResult('mega-millions'),
    fetchPastResults('mega-millions', 20),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">Mega Millions</span>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl p-6 sm:p-10 mb-8 text-white">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Mega Millions Results</h1>
            <p className="text-blue-200 text-lg">Latest winning numbers updated after every draw</p>
            {latestResult && (
              <p className="text-blue-300 text-sm mt-2">Last Draw: {formatDate(latestResult.drawDate)}</p>
            )}
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            {latestResult?.nextDrawDate && (
              <Countdown targetDate={latestResult.nextDrawDate} drawTime={MEGA_MILLIONS.drawTime} label="Next Draw" />
            )}
          </div>
        </div>

        {latestResult && (
          <div className="mt-8 bg-white/10 backdrop-blur rounded-xl p-6">
            <p className="text-sm text-blue-200 mb-3">Winning Numbers</p>
            <LotteryBalls
              numbers={latestResult.numbers}
              bonusBall={latestResult.bonusBall}
              bonusBallName="Mega Ball"
              multiplier={latestResult.multiplier}
              multiplierName="Megaplier"
              size="lg"
              gameColor="#0066b2"
            />
            {latestResult.jackpot && (
              <div className="mt-4 flex items-center gap-4">
                <div>
                  <p className="text-xs text-blue-200">Jackpot</p>
                  <p className="text-2xl font-bold">{latestResult.jackpot}</p>
                </div>
                {latestResult.nextJackpot && (
                  <div>
                    <p className="text-xs text-blue-200">Next Estimated Jackpot</p>
                    <p className="text-2xl font-bold text-yellow-300">{latestResult.nextJackpot}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <AdSlot slot="mm-top" format="horizontal" className="mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Past Mega Millions Results</h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Numbers</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">MB</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">MP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {pastResults.map((result, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                      <td className="px-4 py-3">
                        <Link href={`/mega-millions/results/${result.drawDate}`} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                          {formatShortDate(result.drawDate)}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5">
                          {result.numbers.map((n, i) => (
                            <span key={i} className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs font-bold text-gray-700 dark:text-white">{n}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">{result.bonusBall}</span>
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

        <div className="space-y-6">
          <AdSlot slot="mm-sidebar" format="rectangle" />

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-5">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3">About Mega Millions</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{MEGA_MILLIONS.description}</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Draw Days:</span>
                <span className="font-medium text-gray-900 dark:text-white">{MEGA_MILLIONS.drawDays.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Draw Time:</span>
                <span className="font-medium text-gray-900 dark:text-white">{MEGA_MILLIONS.drawTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Ticket Price:</span>
                <span className="font-medium text-gray-900 dark:text-white">${MEGA_MILLIONS.ticketPrice}</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-5">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3">Mega Millions Odds</h3>
            <div className="space-y-2">
              {Object.entries(MEGA_MILLIONS.odds).map(([match, odds]) => (
                <div key={match} className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{match}</span>
                  <span className="font-mono text-gray-900 dark:text-white text-xs">{odds}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-5">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/number-generator" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Number Generator</Link></li>
              <li><Link href="/number-frequency" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Number Frequency</Link></li>
              <li><Link href="/powerball" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Powerball Results</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <section className="mt-12 prose dark:prose-invert max-w-none">
        <h2>Mega Millions Winning Numbers Today</h2>
        <p>
          Check the latest Mega Millions winning numbers at LottoNumbersUSA.com. Mega Millions draws take place
          every Tuesday and Friday at 11:00 PM ET. Results are updated within minutes of the official draw.
        </p>
        <h3>How to Win Mega Millions</h3>
        <p>
          Match all 5 white balls (1-70) plus the gold Mega Ball (1-25) to win the jackpot. The odds are approximately
          1 in 302.5 million. There are 9 prize tiers, and the overall odds of winning any prize are about 1 in 24.
        </p>
      </section>
    </div>
  );
}
