import { Metadata } from 'next';
import Link from 'next/link';
import LotteryBalls from '@/components/LotteryBalls';
import Countdown from '@/components/Countdown';
import LastUpdated from '@/components/LastUpdated';
import MostDueWidget from '@/components/MostDueWidget';
import HomepageNews from '@/components/HomepageNews';
import OnThisDayWidget from '@/components/OnThisDayWidget';
import JsonLd, { getFAQSchema } from '@/components/JsonLd';
import { getLatestResult, formatDate } from '@/lib/api/lottery-api';
import { POWERBALL, MEGA_MILLIONS } from '@/lib/data/games';
import { STATES } from '@/lib/data/states';
import { getHomeSEO } from '@/lib/data/seo';


const seo = getHomeSEO();
export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  alternates: { canonical: seo.canonical },
};

const homeFAQs = [
  {
    question: 'What are tonight\'s Powerball winning numbers?',
    answer: 'Powerball draws happen Monday, Wednesday, and Saturday at 10:59 PM Eastern. Tonight\'s winning numbers appear on this page and on our Powerball page within a few minutes of the draw. Sales stop 59 minutes before the drawing in most states.',
  },
  {
    question: 'What time does Mega Millions draw tonight?',
    answer: 'Mega Millions draws are Tuesday and Friday at 11:00 PM Eastern. We post the winning numbers on this page and the Mega Millions page within minutes of the draw.',
  },
  {
    question: 'How do I check if my lottery ticket won?',
    answer: 'Match the five white-ball numbers and the bonus ball (Powerball or Mega Ball) on your ticket to the winning numbers shown on this page. Use our free Check Your Numbers tool to enter your ticket and instantly see which tier you hit.',
  },
  {
    question: 'Are the results on this site official?',
    answer: 'Yes. Results pull directly from official state lottery data feeds — New York\'s Open Data portal for Powerball, Mega Millions, and four New York games. For claims over $600 we still recommend double-checking with your state lottery.',
  },
  {
    question: 'Which lottery states are covered?',
    answer: 'California, Texas, Florida, New York, Pennsylvania, Ohio, Georgia, Michigan, North Carolina, and New Jersey. Every state has Powerball and Mega Millions plus its own local games.',
  },
  {
    question: 'What are the odds of winning the Powerball jackpot?',
    answer: 'Roughly 1 in 292 million for the jackpot. Overall odds of winning any Powerball prize are about 1 in 25. Most wins are the $4 prize for matching just the Powerball.',
  },
  {
    question: 'What is the biggest US lottery jackpot ever won?',
    answer: '$2.04 billion Powerball, won in California on November 7, 2022 by a single ticket. The second-biggest was $1.586 billion split between three Powerball tickets in January 2016.',
  },
];

export default async function HomePage() {
  const [powerballResult, megaMillionsResult] = await Promise.all([
    getLatestResult('powerball'),
    getLatestResult('mega-millions'),
  ]);

  const latestDrawDate = powerballResult?.drawDate || megaMillionsResult?.drawDate;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <JsonLd data={getFAQSchema(homeFAQs)} />

      {/* Hero Section - Compact, data-forward */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Live Results
          </span>
          {latestDrawDate && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Last draw: {formatDate(latestDrawDate)}
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
          Lottery Results Today: Powerball, Mega Millions &amp; State Games
        </h1>

        {/* AEO direct-answer snippet */}
        <div className="max-w-3xl">
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            Check the latest US lottery winning numbers below. Powerball draws Monday, Wednesday, and Saturday at 10:59 PM ET.
            Mega Millions draws Tuesday and Friday at 11:00 PM ET. All numbers pull from official state lottery data and update within minutes of each draw.
          </p>
        </div>
      </section>

      {/* Main Results Grid - prominent, hero-level */}
      <section className="mb-10" aria-label="Latest lottery winning numbers">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Powerball */}
          {powerballResult ? (
            <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-2xl p-6 sm:p-7 text-white shadow-xl">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-white" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-red-100">Powerball Results</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold">{formatDate(powerballResult.drawDate)}</h2>
                  <div className="mt-1">
                    <LastUpdated drawDate={powerballResult.drawDate} />
                  </div>
                </div>
                {powerballResult.jackpot && (
                  <div className="text-right">
                    <p className="text-xs text-red-200 uppercase tracking-wide">Jackpot</p>
                    <p className="text-lg sm:text-xl font-bold">{powerballResult.jackpot}</p>
                  </div>
                )}
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
                <p className="text-xs text-red-100 mb-3 font-medium">Winning Numbers</p>
                <LotteryBalls
                  numbers={powerballResult.numbers}
                  bonusBall={powerballResult.bonusBall}
                  bonusBallName="Powerball"
                  multiplier={powerballResult.multiplier}
                  multiplierName="Power Play"
                  size="md"
                  gameColor="#e4002b"
                />
              </div>

              {powerballResult.nextDrawDate && (
                <div className="pt-3 border-t border-white/20">
                  <Countdown targetDate={powerballResult.nextDrawDate} drawTime={POWERBALL.drawTime} label="Next Draw" />
                </div>
              )}

              <Link
                href="/powerball"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold bg-white/15 hover:bg-white/25 backdrop-blur-sm px-4 py-2 rounded-lg transition-colors"
              >
                See full Powerball results
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </Link>
            </div>
          ) : (
            <PlaceholderCard game="Powerball" href="/powerball" color="red" />
          )}

          {/* Mega Millions */}
          {megaMillionsResult ? (
            <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl p-6 sm:p-7 text-white shadow-xl">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-white" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-100">Mega Millions Results</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold">{formatDate(megaMillionsResult.drawDate)}</h2>
                  <div className="mt-1">
                    <LastUpdated drawDate={megaMillionsResult.drawDate} />
                  </div>
                </div>
                {megaMillionsResult.jackpot && (
                  <div className="text-right">
                    <p className="text-xs text-blue-200 uppercase tracking-wide">Jackpot</p>
                    <p className="text-lg sm:text-xl font-bold">{megaMillionsResult.jackpot}</p>
                  </div>
                )}
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
                <p className="text-xs text-blue-100 mb-3 font-medium">Winning Numbers</p>
                <LotteryBalls
                  numbers={megaMillionsResult.numbers}
                  bonusBall={megaMillionsResult.bonusBall}
                  bonusBallName="Mega Ball"
                  multiplier={megaMillionsResult.multiplier}
                  multiplierName="Megaplier"
                  size="md"
                  gameColor="#0066b2"
                />
              </div>

              {megaMillionsResult.nextDrawDate && (
                <div className="pt-3 border-t border-white/20">
                  <Countdown targetDate={megaMillionsResult.nextDrawDate} drawTime={MEGA_MILLIONS.drawTime} label="Next Draw" />
                </div>
              )}

              <Link
                href="/mega-millions"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold bg-white/15 hover:bg-white/25 backdrop-blur-sm px-4 py-2 rounded-lg transition-colors"
              >
                See full Mega Millions results
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </Link>
            </div>
          ) : (
            <PlaceholderCard game="Mega Millions" href="/mega-millions" color="blue" />
          )}
        </div>

        {/* Primary action bar - conversion-focused */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/check-your-numbers"
            className="group flex items-center gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p className="font-semibold text-emerald-900 dark:text-emerald-100 text-sm">Did you win?</p>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">Check your ticket now</p>
            </div>
          </Link>
          <Link
            href="/jackpot-tracker"
            className="group flex items-center gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>
            </div>
            <div>
              <p className="font-semibold text-amber-900 dark:text-amber-100 text-sm">Current Jackpots</p>
              <p className="text-xs text-amber-700 dark:text-amber-300">All games tracked live</p>
            </div>
          </Link>
          <Link
            href="/blog/predictions"
            className="group flex items-center gap-3 p-4 rounded-xl bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 hover:bg-violet-100 dark:hover:bg-violet-900/30 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-violet-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div>
              <p className="font-semibold text-violet-900 dark:text-violet-100 text-sm">Next Draw Predictions</p>
              <p className="text-xs text-violet-700 dark:text-violet-300">Based on real draw data</p>
            </div>
          </Link>
        </div>

        {/* On This Day */}
        <div className="mt-5">
          <OnThisDayWidget />
        </div>
      </section>

      {/* Most Due numbers widget */}
      <MostDueWidget />

      {/* Recent draw analysis (news) */}
      <HomepageNews />

      {/* State Lotteries - compact grid */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">State Lottery Results</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Pick your state for local game results</p>
          </div>
          <Link href="/states" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 transition-colors whitespace-nowrap">
            All states &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {STATES.map(state => (
            <Link
              key={state.slug}
              href={`/${state.slug}`}
              className="group bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all text-center"
            >
              <span className="text-2xl mb-1 block" aria-hidden="true">{getStateEmoji(state.abbreviation)}</span>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{state.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{state.games.length} games</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Tools - practical, scannable */}
      <section className="mb-10">
        <div className="mb-5">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Free Lottery Tools</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Built for players, no signup needed</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { title: 'Tax Calculator', desc: 'After-tax winnings by state', href: '/tax-calculator', icon: '💵' },
            { title: 'Number Generator', desc: 'Quick Pick-style random numbers', href: '/number-generator', icon: '🎲' },
            { title: 'Jackpot Tracker', desc: 'All current jackpot amounts', href: '/jackpot-tracker', icon: '💰' },
            { title: 'Odds Calculator', desc: 'Your real chance of winning', href: '/odds-calculator', icon: '📊' },
            { title: 'Number Frequency', desc: 'Hot and cold number analysis', href: '/number-frequency', icon: '🔥' },
          ].map(tool => (
            <Link key={tool.href} href={tool.href} className="group bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all">
              <span className="text-3xl mb-3 block" aria-hidden="true">{tool.icon}</span>
              <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors mb-1">{tool.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{tool.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Data source / trust / content section */}
      <section className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8 mb-10">
        <div className="space-y-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">Where our lottery results come from</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Official data feeds</p>
                  <p className="text-gray-600 dark:text-gray-400 mt-0.5 text-xs leading-relaxed">
                    Results come directly from New York State&apos;s Open Data portal (data.ny.gov), the same source used by official lottery partners.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Updated within minutes</p>
                  <p className="text-gray-600 dark:text-gray-400 mt-0.5 text-xs leading-relaxed">
                    Our servers check for new results every 15 minutes. When a draw finishes, numbers appear here shortly after.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Free, no signup</p>
                  <p className="text-gray-600 dark:text-gray-400 mt-0.5 text-xs leading-relaxed">
                    No accounts, no ads blocking results, no fake &quot;premium&quot; tiers. Every tool and every result is free.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">How to read your lottery ticket</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed text-sm">
              Every Powerball and Mega Millions ticket has five main numbers and one bonus ball. To win the jackpot, all six must match. Smaller prizes kick in for matching fewer numbers — even just the bonus ball pays out. Match your ticket to the numbers above, or paste them into our <Link href="/check-your-numbers" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Check Your Numbers tool</Link> to see instantly which tier you hit.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <Link href="/powerball" className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <span className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-bold">PB</span>
                <span className="font-medium text-gray-900 dark:text-white">Powerball results &amp; history</span>
              </Link>
              <Link href="/mega-millions" className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <span className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center text-xs font-bold">MM</span>
                <span className="font-medium text-gray-900 dark:text-white">Mega Millions results &amp; history</span>
              </Link>
              <Link href="/number-frequency" className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <span className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs">🔥</span>
                <span className="font-medium text-gray-900 dark:text-white">Hot &amp; cold numbers</span>
              </Link>
              <Link href="/blog/predictions" className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <span className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs">⚡</span>
                <span className="font-medium text-gray-900 dark:text-white">Next draw predictions</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mb-10">
        <div className="mb-5">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Common lottery questions</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Quick answers to what players ask most</p>
        </div>
        <div className="space-y-3">
          {homeFAQs.map((faq, index) => (
            <details key={index} className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              <summary className="flex items-center justify-between cursor-pointer p-4 sm:p-5 font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors list-none">
                <span>{faq.question}</span>
                <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="px-4 sm:px-5 pb-4 sm:pb-5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

function PlaceholderCard({ game, href, color }: { game: string; href: string; color: 'red' | 'blue' }) {
  const bgClass = color === 'red'
    ? 'bg-gradient-to-br from-red-600 to-red-800'
    : 'bg-gradient-to-br from-blue-700 to-blue-900';
  return (
    <div className={`${bgClass} rounded-2xl p-6 sm:p-7 text-white shadow-xl flex items-center justify-center min-h-[280px]`}>
      <div className="text-center">
        <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-white/15 flex items-center justify-center">
          <svg className="w-7 h-7 text-white animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        </div>
        <h2 className="text-xl font-bold mb-1">{game} Results Loading</h2>
        <p className="text-sm text-white/80 mb-4">Fresh numbers are being fetched from the official data feed.</p>
        <Link href={href} className="inline-flex items-center gap-1.5 text-sm font-semibold bg-white/15 hover:bg-white/25 backdrop-blur-sm px-4 py-2 rounded-lg transition-colors">
          Go to {game} page
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </Link>
      </div>
    </div>
  );
}

function getStateEmoji(abbreviation: string): string {
  const emojis: Record<string, string> = {
    CA: '☀️', TX: '🤠', FL: '🌴', NY: '🗽', PA: '🔔',
    OH: '🏈', GA: '🍑', MI: '🏒', NC: '🌲', NJ: '🏖️',
  };
  return emojis[abbreviation] || '🏛️';
}
