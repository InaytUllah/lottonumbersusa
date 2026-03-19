import { Metadata } from 'next';
import Link from 'next/link';
import LotteryBalls from '@/components/LotteryBalls';
import Countdown from '@/components/Countdown';
import JsonLd, { getBreadcrumbSchema, getFAQSchema } from '@/components/JsonLd';
import { getLatestResult, fetchPastResults, formatDate, formatShortDate } from '@/lib/api/lottery-api';
import { POWERBALL } from '@/lib/data/games';
import { getGameSEO } from '@/lib/data/seo';

export const revalidate = 300;

const seo = getGameSEO('Powerball', 'powerball');
export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  alternates: { canonical: seo.canonical },
};

const powerballFAQs = [
  { question: 'What time is the Powerball drawing?', answer: 'Powerball drawings are held every Monday, Wednesday, and Saturday at 10:59 PM Eastern Time. Results are typically available on our site within 5 minutes of the draw.' },
  { question: 'How much does a Powerball ticket cost?', answer: 'A standard Powerball ticket costs $2. You can add Power Play for an extra $1, which multiplies non-jackpot prizes by 2x, 3x, 4x, 5x, or 10x (10x only when jackpot is under $150 million).' },
  { question: 'What are the odds of winning the Powerball jackpot?', answer: 'The odds of winning the Powerball jackpot are 1 in 292,201,338. The overall odds of winning any Powerball prize are approximately 1 in 24.87.' },
  { question: 'How many numbers do you need to win Powerball?', answer: 'To win the Powerball jackpot, you must match all 5 white balls (1-69) plus the red Powerball (1-26). However, you can win smaller prizes by matching fewer numbers. Even matching just the Powerball wins you $4.' },
  { question: 'What is the Power Play option?', answer: 'Power Play is an add-on feature for $1 extra per play. It multiplies non-jackpot prizes by 2x, 3x, 4x, 5x, or 10x. The Match 5 prize is always doubled to $2 million with Power Play, regardless of the multiplier drawn.' },
  { question: 'How long do I have to claim a Powerball prize?', answer: 'Claim periods vary by state, ranging from 90 days to 1 year from the drawing date. Check with your state lottery for the exact deadline. Unclaimed prizes revert to the participating states.' },
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
      <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-2xl p-6 sm:p-10 mb-8 text-white">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Powerball Results Today</h1>
            <p className="text-red-100 text-lg">Latest winning numbers updated after every draw</p>
            {latestResult && (
              <p className="text-red-200 text-sm mt-2">Last Draw: {formatDate(latestResult.drawDate)}</p>
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
          </div>
        )}
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

      {/* Deep SEO Content */}
      <section className="mt-12 prose dark:prose-invert max-w-none">
        <h2>Powerball Winning Numbers Today</h2>
        <p>
          Check the latest Powerball winning numbers right here at LottoNumbersUSA.com. Powerball draws take place
          every Monday, Wednesday, and Saturday at 10:59 PM ET. Our results are updated within minutes of the
          official draw, so you can quickly check if you are a winner.
        </p>
        <p>
          Powerball is one of the two major multi-state lottery games in the United States, available in 45 states,
          the District of Columbia, Puerto Rico, and the U.S. Virgin Islands. The game is coordinated by the
          Multi-State Lottery Association (MUSL) and has been running since 1992.
        </p>
        <h3>How to Win Powerball</h3>
        <p>
          To win the Powerball jackpot, you need to match all 5 white balls (drawn from a pool of 1-69) plus the
          red Powerball (drawn from a pool of 1-26). The odds of winning the jackpot are approximately 1 in 292 million.
          However, there are 9 different prize tiers, and the overall odds of winning any prize are approximately 1 in 24.87.
        </p>
        <h3>Powerball Prize Tiers</h3>
        <p>
          Powerball offers 9 ways to win. The minimum jackpot starts at $20 million and grows with each drawing that
          has no jackpot winner. The second prize of $1 million is awarded for matching all 5 white balls without the
          Powerball. With Power Play, this prize doubles to $2 million. Smaller prizes range from $4 (Powerball only)
          to $50,000 (4 white balls + Powerball).
        </p>
        <h3>Powerball Drawing Schedule</h3>
        <p>
          Powerball drawings are conducted three times per week: Monday, Wednesday, and Saturday evenings at 10:59 PM
          Eastern Time. The drawings are broadcast live from the Florida Lottery draw studio in Tallahassee. Sales
          cut off at least 1-2 hours before the drawing, depending on your state.
        </p>
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
