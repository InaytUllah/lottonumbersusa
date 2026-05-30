import { Metadata } from 'next';
import Link from 'next/link';
import LotteryBalls from '@/components/LotteryBalls';
import Countdown from '@/components/Countdown';
import JsonLd, { getBreadcrumbSchema, getFAQSchema } from '@/components/JsonLd';
import { getLatestResult, fetchPastResults, formatDate, formatShortDate } from '@/lib/api/lottery-api';
import { MEGA_MILLIONS } from '@/lib/data/games';
import { getGameSEO } from '@/lib/data/seo';
import CheckYourNumbers from '@/components/CheckYourNumbers';
import PrizeBreakdown from '@/components/PrizeBreakdown';
import SocialShare from '@/components/SocialShare';
import JackpotHistoryChart from '@/components/JackpotHistoryChart';
import LastUpdated from '@/components/LastUpdated';
import WatchDrawing from '@/components/WatchDrawing';
import WinnerStories from '@/components/WinnerStories';


const seo = getGameSEO('Mega Millions', 'mega-millions');
export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  alternates: { canonical: seo.canonical },
};

const megaMillionsFAQs = [
  { question: 'What time is the Mega Millions drawing?', answer: 'Tuesday and Friday at 11:00 PM Eastern. Numbers usually show up here within a few minutes.' },
  { question: 'How much does a Mega Millions ticket cost?', answer: '$2 per play. The Megaplier add-on costs $1 extra and multiplies non-jackpot prizes by 2x, 3x, 4x, or 5x.' },
  { question: 'What are the odds of winning?', answer: '1 in 302,575,350 for the jackpot. About 1 in 24 for any prize at all. Most wins are small ($2 to $10).' },
  { question: 'How do you play?', answer: 'Pick 5 numbers from 1 to 70, then 1 Mega Ball from 1 to 25. Match all 6 for the jackpot. Or just ask for a Quick Pick and let the machine choose.' },
  { question: 'What is the Megaplier?', answer: 'A $1 add-on. It multiplies non-jackpot prizes by 2x to 5x. So a $1 million Match 5 prize could become $5 million. The multiplier number is drawn separately.' },
  { question: 'What was the biggest Mega Millions jackpot?', answer: '$1.537 billion, won in October 2018 from a single ticket sold in South Carolina.' },
];

export default async function MegaMillionsPage() {
  const [latestResult, pastResults] = await Promise.all([
    getLatestResult('mega-millions'),
    fetchPastResults('mega-millions', 20),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <JsonLd data={getBreadcrumbSchema([
        { name: 'Home', url: 'https://lottonumbersusa.com' },
        { name: 'Mega Millions Results', url: 'https://lottonumbersusa.com/mega-millions' },
      ])} />
      <JsonLd data={getFAQSchema(megaMillionsFAQs)} />

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">Mega Millions</span>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl p-6 sm:p-10 mb-6 text-white">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/15 text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Live Results
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Mega Millions Winning Numbers Today</h1>
            <p className="text-blue-200 text-base sm:text-lg max-w-xl">
              Latest Mega Millions results from the official draw. Updated within minutes of every Tuesday and Friday drawing.
            </p>
            {latestResult && (
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <p className="text-blue-300 text-sm">Last draw: {formatDate(latestResult.drawDate)}</p>
                <LastUpdated drawDate={latestResult.drawDate} />
              </div>
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
            <div className="mt-4">
              <SocialShare title={`Mega Millions Results for ${formatDate(latestResult.drawDate)}: ${latestResult.numbers.join(', ')} MB: ${latestResult.bonusBall}`} url="https://lottonumbersusa.com/mega-millions" />
            </div>
          </div>
        )}
      </div>

      {/* AEO direct-answer snippet */}
      {latestResult && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 mb-8">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">?</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">What were tonight&apos;s Mega Millions numbers?</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                The Mega Millions winning numbers for {formatDate(latestResult.drawDate)} are <strong className="text-gray-900 dark:text-white">{latestResult.numbers.join(', ')}</strong>
                {latestResult.bonusBall !== undefined && <> with a Mega Ball of <strong className="text-blue-600 dark:text-blue-400">{latestResult.bonusBall}</strong></>}
                . The next Mega Millions drawing is {latestResult.nextDrawDate ? formatDate(latestResult.nextDrawDate) : 'soon'} at 11:00 PM ET.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Prize Breakdown */}
      <div className="mb-8">
        <PrizeBreakdown game="mega-millions" />
      </div>

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

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Check Your Numbers */}
          {latestResult && (
            <CheckYourNumbers
              gameSlug="mega-millions"
              latestNumbers={latestResult.numbers}
              latestBonus={latestResult.bonusBall}
            />
          )}

          {/* Jackpot History Chart */}
          <JackpotHistoryChart game="mega-millions" />

          {/* Watch the Drawing */}
          <WatchDrawing game="mega-millions" />

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
              <li><Link href="/number-generator" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Mega Millions Number Generator</Link></li>
              <li><Link href="/number-frequency" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Mega Millions Number Frequency</Link></li>
              <li><Link href="/powerball" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Powerball Results</Link></li>
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Mega Millions Winning Numbers Today</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Check the latest <strong className="text-gray-900 dark:text-white">Mega Millions winning numbers</strong> right here at <strong className="text-gray-900 dark:text-white">LottoNumbersUSA.com</strong>. Mega Millions draws take
              place every Tuesday and Friday at <strong className="text-gray-900 dark:text-white">11:00 PM ET</strong>. Our results are updated within minutes of the official draw.
              Mega Millions is one of America&#39;s two biggest lottery games, offering jackpots that frequently climb into the hundreds of millions.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-3">
              <strong className="text-gray-900 dark:text-white">Mega Millions</strong> is available in <strong className="text-gray-900 dark:text-white">45 states</strong>, the District of Columbia, and the U.S. Virgin Islands. Originally launched in 1996 as &quot;The Big Game,&quot; it was rebranded to Mega Millions in 2002 and has produced some of the largest lottery prizes in world history.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">How to Win Mega Millions</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
              To win the <strong className="text-gray-900 dark:text-white">Mega Millions jackpot</strong>, match all 5 white balls plus the gold Mega Ball. There are <strong className="text-gray-900 dark:text-white">9 prize tiers</strong> — even matching just the Mega Ball wins you $2.
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
                  <tr><td className="px-4 py-2 font-medium">White Ball Pool</td><td className="px-4 py-2">1 to 70 (pick 5)</td></tr>
                  <tr><td className="px-4 py-2 font-medium">Mega Ball Pool</td><td className="px-4 py-2">1 to 25 (pick 1)</td></tr>
                  <tr><td className="px-4 py-2 font-medium">Jackpot Odds</td><td className="px-4 py-2 font-mono text-xs">1 in 302,575,350</td></tr>
                  <tr><td className="px-4 py-2 font-medium">Any Prize Odds</td><td className="px-4 py-2 font-mono text-xs">~1 in 24</td></tr>
                  <tr><td className="px-4 py-2 font-medium">Megaplier</td><td className="px-4 py-2">2x, 3x, 4x, or 5x (extra $1)</td></tr>
                  <tr><td className="px-4 py-2 font-medium">Starting Jackpot</td><td className="px-4 py-2 font-bold text-green-600 dark:text-green-400">$20 Million</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Mega Millions Drawing Schedule</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {['Tuesday', 'Friday'].map(day => (
                <div key={day} className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/></svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{day}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">11:00 PM ET</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
              Drawings are held at WSB-TV studios in Atlanta, Georgia. Sales cut off 15 minutes to 2 hours before the drawing.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Related Tools</h3>
            <div className="flex flex-wrap gap-2">
              <Link href="/check-your-numbers" className="px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 hover:opacity-80 transition-opacity">Check Your Numbers</Link>
              <Link href="/number-generator" className="px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 hover:opacity-80 transition-opacity">Number Generator</Link>
              <Link href="/number-frequency" className="px-3 py-1.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 hover:opacity-80 transition-opacity">Number Frequency</Link>
              <Link href="/powerball" className="px-3 py-1.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 hover:opacity-80 transition-opacity">Powerball Results</Link>
              <Link href="/jackpot-tracker" className="px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:opacity-80 transition-opacity">Jackpot Tracker</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Mega Millions FAQ</h2>
        <div className="space-y-4">
          {megaMillionsFAQs.map((faq, index) => (
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
