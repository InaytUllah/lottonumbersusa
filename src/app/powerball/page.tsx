import { Metadata } from 'next';
import Link from 'next/link';
import LotteryBalls from '@/components/LotteryBalls';
import Countdown from '@/components/Countdown';
import JsonLd, { getBreadcrumbSchema, getFAQSchema } from '@/components/JsonLd';
import { getLatestResult, fetchPastResults, formatDate, formatShortDate } from '@/lib/api/lottery-api';
import { POWERBALL } from '@/lib/data/games';
import { getGameSEO } from '@/lib/data/seo';
import CheckYourNumbers from '@/components/CheckYourNumbers';
import PrizeBreakdown from '@/components/PrizeBreakdown';
import SocialShare from '@/components/SocialShare';
import JackpotHistoryChart from '@/components/JackpotHistoryChart';
import WatchDrawing from '@/components/WatchDrawing';
import WinnerStories from '@/components/WinnerStories';
import LastUpdated from '@/components/LastUpdated';


const seo = getGameSEO('Powerball', 'powerball');
export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  alternates: { canonical: seo.canonical },
};

const powerballFAQs = [
  { question: 'What time is the Powerball drawing?', answer: 'Monday, Wednesday, and Saturday at 10:59 PM Eastern. We usually post results within a few minutes.' },
  { question: 'How much does a Powerball ticket cost?', answer: '$2 for a standard ticket. Power Play costs an extra $1 and multiplies non-jackpot prizes by 2x to 10x. The 10x multiplier only applies when the jackpot is under $150 million.' },
  { question: 'What are the odds of winning the Powerball jackpot?', answer: '1 in 292,201,338 for the jackpot. Your overall odds of winning any prize are about 1 in 25. Most wins are $4.' },
  { question: 'How many numbers do you need to win?', answer: 'All 5 white balls (picked from 1-69) plus the red Powerball (1-26) for the jackpot. Fewer matches still pay out. Matching just the Powerball alone gets you $4.' },
  { question: 'What is Power Play?', answer: 'A $1 add-on that multiplies non-jackpot prizes. The multiplier is drawn separately: 2x, 3x, 4x, 5x, or 10x. One exception: the Match 5 prize always doubles to $2 million with Power Play, no matter what multiplier is drawn.' },
  { question: 'How long do I have to claim a prize?', answer: 'Depends on your state. Some give you 90 days, others up to a year. Check your state lottery website for the exact deadline. Unclaimed prizes go back to the participating states.' },
];

export default async function PowerballPage() {
  const [latestResult, pastResults] = await Promise.all([
    getLatestResult('powerball'),
    fetchPastResults('powerball', 20),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <JsonLd data={getBreadcrumbSchema([
        { name: 'Home', url: 'https://lottonumbersusa.com' },
        { name: 'Powerball Results', url: 'https://lottonumbersusa.com/powerball' },
      ])} />
      <JsonLd data={getFAQSchema(powerballFAQs)} />

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">Powerball</span>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-2xl p-6 sm:p-10 mb-6 text-white">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/15 text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Live Results
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Powerball Winning Numbers Today</h1>
            <p className="text-red-100 text-base sm:text-lg max-w-xl">
              Latest Powerball results from the official Multi-State Lottery draw. Updated within minutes of every drawing.
            </p>
            {latestResult && (
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <p className="text-red-200 text-sm">Last draw: {formatDate(latestResult.drawDate)}</p>
                <LastUpdated drawDate={latestResult.drawDate} />
              </div>
            )}
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            {latestResult?.nextDrawDate && (
              <Countdown targetDate={latestResult.nextDrawDate} drawTime={POWERBALL.drawTime} label="Next Draw" />
            )}
          </div>
        </div>

        {latestResult && (
          <div className="mt-8 bg-white/10 backdrop-blur rounded-xl p-6">
            <p className="text-sm text-red-200 mb-3">Winning Numbers</p>
            <LotteryBalls numbers={latestResult.numbers} bonusBall={latestResult.bonusBall} bonusBallName="Powerball" multiplier={latestResult.multiplier} multiplierName="Power Play" size="lg" gameColor="#e4002b" />
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
            <div className="mt-4">
              <SocialShare title={`Powerball Results for ${formatDate(latestResult.drawDate)}: ${latestResult.numbers.join(', ')} PB: ${latestResult.bonusBall}`} url="https://lottonumbersusa.com/powerball" />
            </div>
          </div>
        )}
      </div>

      {/* AEO direct-answer snippet */}
      {latestResult && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 mb-8">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center flex-shrink-0">
              <span className="text-red-600 dark:text-red-400 font-bold text-sm">?</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">What were tonight&apos;s Powerball numbers?</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                The Powerball winning numbers for {formatDate(latestResult.drawDate)} are <strong className="text-gray-900 dark:text-white">{latestResult.numbers.join(', ')}</strong>
                {latestResult.bonusBall !== undefined && <> with a Powerball of <strong className="text-red-600 dark:text-red-400">{latestResult.bonusBall}</strong></>}
                {latestResult.multiplier && <>. Power Play was <strong>{latestResult.multiplier}x</strong></>}.
                The next Powerball drawing is {latestResult.nextDrawDate ? formatDate(latestResult.nextDrawDate) : 'soon'} at 10:59 PM ET.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Prize Breakdown */}
      <div className="mb-8">
        <PrizeBreakdown game="powerball" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Past Powerball Results</h2>
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
                        <Link href={`/powerball/results/${result.drawDate}`} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
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
                        <span className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-xs font-bold text-white">{result.bonusBall}</span>
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
          {/* Check Your Numbers */}
          {latestResult && (
            <CheckYourNumbers
              gameSlug="powerball"
              latestNumbers={latestResult.numbers}
              latestBonus={latestResult.bonusBall}
            />
          )}

          {/* Jackpot History Chart */}
          <JackpotHistoryChart game="powerball" />

          {/* Watch the Drawing */}
          <WatchDrawing game="powerball" />

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

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-5">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3">How to Play Powerball</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{POWERBALL.howToPlay}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-5">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/number-generator" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Powerball Number Generator</Link></li>
              <li><Link href="/number-frequency" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Powerball Number Frequency</Link></li>
              <li><Link href="/mega-millions" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Mega Millions Results</Link></li>
              <li><Link href="/odds-calculator" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Lottery Odds Calculator</Link></li>
              <li><Link href="/jackpot-tracker" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Current Jackpots</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Winner Stories */}
      <div className="mt-8">
        <WinnerStories />
      </div>

      {/* Deep SEO Content */}
      <section className="mt-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Powerball Winning Numbers Today</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Check the latest <strong className="text-gray-900 dark:text-white">Powerball winning numbers</strong> right here at <strong className="text-gray-900 dark:text-white">LottoNumbersUSA.com</strong>. Powerball draws take place
              every Monday, Wednesday, and Saturday at <strong className="text-gray-900 dark:text-white">10:59 PM ET</strong>. Our results are updated within minutes of the
              official draw, so you can quickly check if you are a winner.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-3">
              <strong className="text-gray-900 dark:text-white">Powerball</strong> is one of the two major multi-state lottery games in the United States, available in <strong className="text-gray-900 dark:text-white">45 states</strong>,
              the District of Columbia, Puerto Rico, and the U.S. Virgin Islands. The game is coordinated by the
              Multi-State Lottery Association (MUSL) and has been running since 1992.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">How to Win Powerball</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
              To win the <strong className="text-gray-900 dark:text-white">Powerball jackpot</strong>, you need to match all 5 white balls plus the red Powerball. There are <strong className="text-gray-900 dark:text-white">9 different prize tiers</strong>, so you can win even without matching all numbers.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Detail</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-gray-600 dark:text-gray-400">
                  <tr><td className="px-4 py-2 font-medium">White Ball Pool</td><td className="px-4 py-2">1 to 69 (pick 5)</td></tr>
                  <tr><td className="px-4 py-2 font-medium">Powerball Pool</td><td className="px-4 py-2">1 to 26 (pick 1)</td></tr>
                  <tr><td className="px-4 py-2 font-medium">Jackpot Odds</td><td className="px-4 py-2 font-mono text-xs">1 in 292,201,338</td></tr>
                  <tr><td className="px-4 py-2 font-medium">Any Prize Odds</td><td className="px-4 py-2 font-mono text-xs">~1 in 24.87</td></tr>
                  <tr><td className="px-4 py-2 font-medium">Starting Jackpot</td><td className="px-4 py-2 font-bold text-green-600 dark:text-green-400">$20 Million</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Powerball Drawing Schedule</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {['Monday', 'Wednesday', 'Saturday'].map(day => (
                <div key={day} className="flex items-center gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
                  <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/></svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{day}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">10:59 PM ET</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
              Drawings are broadcast live from the Florida Lottery draw studio in Tallahassee. Sales cut off 1-2 hours before the drawing.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Related Tools</h3>
            <div className="flex flex-wrap gap-2">
              <Link href="/check-your-numbers" className="px-3 py-1.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 hover:opacity-80 transition-opacity">Check Your Numbers</Link>
              <Link href="/number-generator" className="px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 hover:opacity-80 transition-opacity">Number Generator</Link>
              <Link href="/number-frequency" className="px-3 py-1.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 hover:opacity-80 transition-opacity">Number Frequency</Link>
              <Link href="/mega-millions" className="px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 hover:opacity-80 transition-opacity">Mega Millions Results</Link>
              <Link href="/jackpot-tracker" className="px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:opacity-80 transition-opacity">Jackpot Tracker</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Powerball FAQ</h2>
        <div className="space-y-4">
          {powerballFAQs.map((faq, index) => (
            <details key={index} className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              <summary className="flex items-center justify-between cursor-pointer p-5 font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                {faq.question}
                <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="px-5 pb-5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
