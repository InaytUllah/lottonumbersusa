import { Metadata } from 'next';
import Link from 'next/link';
import LotteryBalls from '@/components/LotteryBalls';
import Countdown from '@/components/Countdown';
import JsonLd, { getBreadcrumbSchema, getFAQSchema } from '@/components/JsonLd';
import { getLatestResult, fetchPastResults, formatDate, formatShortDate } from '@/lib/api/lottery-api';
import { MEGA_MILLIONS } from '@/lib/data/games';
import { getGameSEO } from '@/lib/data/seo';

export const revalidate = 300;

const seo = getGameSEO('Mega Millions', 'mega-millions');
export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  alternates: { canonical: seo.canonical },
};

const megaMillionsFAQs = [
  { question: 'What time is the Mega Millions drawing?', answer: 'Mega Millions drawings are held every Tuesday and Friday at 11:00 PM Eastern Time. Results are typically available on our site within minutes of the official draw.' },
  { question: 'How much does a Mega Millions ticket cost?', answer: 'A standard Mega Millions ticket costs $2. You can add the Megaplier option for an extra $1, which multiplies non-jackpot prizes by 2x, 3x, 4x, or 5x.' },
  { question: 'What are the odds of winning the Mega Millions jackpot?', answer: 'The odds of winning the Mega Millions jackpot are 1 in 302,575,350. The overall odds of winning any Mega Millions prize are approximately 1 in 24.' },
  { question: 'How do you play Mega Millions?', answer: 'To play Mega Millions, pick 5 numbers from 1 to 70 (white balls) and 1 number from 1 to 25 (the gold Mega Ball). Match all 6 numbers to win the jackpot. You can also use Quick Pick to have the terminal randomly select your numbers.' },
  { question: 'What is the Megaplier?', answer: 'The Megaplier is an optional add-on that costs $1 extra per play. It multiplies non-jackpot prizes by 2x, 3x, 4x, or 5x, depending on the Megaplier number drawn. For example, a $1 million Match 5 prize becomes $2 million, $3 million, $4 million, or $5 million with the Megaplier.' },
  { question: 'What is the biggest Mega Millions jackpot ever?', answer: 'The largest Mega Millions jackpot in history was $1.537 billion, won on October 23, 2018, by a single ticket sold in South Carolina. It remains one of the largest lottery prizes ever awarded worldwide.' },
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
      <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl p-6 sm:p-10 mb-8 text-white">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Mega Millions Results Today</h1>
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

      {/* Deep SEO Content */}
      <section className="mt-12 prose dark:prose-invert max-w-none">
        <h2>Mega Millions Winning Numbers Today</h2>
        <p>
          Check the latest Mega Millions winning numbers right here at LottoNumbersUSA.com. Mega Millions draws take
          place every Tuesday and Friday at 11:00 PM ET. Our results are updated within minutes of the official draw,
          so you can quickly check if you are a winner. Mega Millions is one of America's two biggest lottery games,
          offering jackpots that frequently climb into the hundreds of millions of dollars.
        </p>
        <p>
          Mega Millions is a multi-state lottery game available in 45 states, the District of Columbia, and the U.S.
          Virgin Islands. The game was originally launched in 1996 as &quot;The Big Game&quot; and rebranded to Mega
          Millions in 2002. It is administered by a consortium of state lotteries and has produced some of the largest
          lottery prizes in world history.
        </p>
        <h3>How to Win Mega Millions</h3>
        <p>
          To win the Mega Millions jackpot, you need to match all 5 white balls (drawn from a pool of 1-70) plus the
          gold Mega Ball (drawn from a separate pool of 1-25). The odds of winning the jackpot are approximately 1 in
          302,575,350. However, there are 9 different prize tiers, and the overall odds of winning any prize are about
          1 in 24. Even matching just the Mega Ball wins you $2.
        </p>
        <h3>Mega Millions Prize Tiers &amp; Megaplier</h3>
        <p>
          Mega Millions offers 9 ways to win. The minimum jackpot starts at $20 million and grows with each drawing
          that has no jackpot winner. The second prize of $1 million is awarded for matching all 5 white balls without
          the Mega Ball. With the Megaplier option ($1 extra), non-jackpot prizes can be multiplied by 2x, 3x, 4x, or
          5x. For example, the $1 million Match 5 prize can become up to $5 million with the Megaplier.
        </p>
        <h3>Mega Millions Drawing Schedule</h3>
        <p>
          Mega Millions drawings are conducted twice per week: Tuesday and Friday evenings at 11:00 PM Eastern Time.
          The drawings are held at WSB-TV studios in Atlanta, Georgia. Ticket sales typically cut off 15 minutes to
          2 hours before the drawing, depending on the selling jurisdiction. All results shown on this page are
          sourced from official state lottery data and updated automatically after each draw.
        </p>
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
