import { Metadata } from 'next';
import Link from 'next/link';
import ResultCard from '@/components/ResultCard';
import AdSlot from '@/components/AdSlot';
import Countdown from '@/components/Countdown';
import { getLatestResult } from '@/lib/api/lottery-api';
import { POWERBALL, MEGA_MILLIONS } from '@/lib/data/games';
import { STATES } from '@/lib/data/states';
import { getHomeSEO } from '@/lib/data/seo';

export const revalidate = 300; // Revalidate every 5 minutes

const seo = getHomeSEO();
export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
};

export default async function HomePage() {
  const [powerballResult, megaMillionsResult] = await Promise.all([
    getLatestResult('powerball'),
    getLatestResult('mega-millions'),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <section className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3">
          Latest US Lottery Results
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Check the latest Powerball, Mega Millions, and state lottery winning numbers. Updated instantly after every draw.
        </p>
      </section>

      {/* Top Ad */}
      <AdSlot slot="top-banner" format="horizontal" className="mb-8" />

      {/* Main Results Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* Powerball */}
        <div>
          {powerballResult && (
            <ResultCard result={powerballResult} gameConfig={POWERBALL} />
          )}
          {powerballResult?.nextDrawDate && (
            <div className="mt-4">
              <Countdown
                targetDate={powerballResult.nextDrawDate}
                drawTime={POWERBALL.drawTime}
                label="Next Powerball Draw"
              />
            </div>
          )}
        </div>

        {/* Mega Millions */}
        <div>
          {megaMillionsResult && (
            <ResultCard result={megaMillionsResult} gameConfig={MEGA_MILLIONS} />
          )}
          {megaMillionsResult?.nextDrawDate && (
            <div className="mt-4">
              <Countdown
                targetDate={megaMillionsResult.nextDrawDate}
                drawTime={MEGA_MILLIONS.drawTime}
                label="Next Mega Millions Draw"
              />
            </div>
          )}
        </div>
      </section>

      {/* Mid Ad */}
      <AdSlot slot="mid-content" format="auto" className="mb-10" />

      {/* State Lotteries Section */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            State Lottery Results
          </h2>
          <Link
            href="/states"
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 transition-colors"
          >
            View All States &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {STATES.map(state => (
            <Link
              key={state.slug}
              href={`/${state.slug}`}
              className="group bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all text-center"
            >
              <span className="text-2xl mb-1 block">{getStateEmoji(state.abbreviation)}</span>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {state.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {state.games.length} games
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Tools Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Lottery Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: 'Number Generator',
              desc: 'Generate random lottery numbers for any game',
              href: '/number-generator',
              icon: '🎲',
            },
            {
              title: 'Jackpot Tracker',
              desc: 'Track all current jackpot amounts in one place',
              href: '/jackpot-tracker',
              icon: '💰',
            },
            {
              title: 'Odds Calculator',
              desc: 'Calculate your chances of winning',
              href: '/odds-calculator',
              icon: '📊',
            },
            {
              title: 'Number Frequency',
              desc: 'See which numbers are drawn most often',
              href: '/number-frequency',
              icon: '🔥',
            },
          ].map(tool => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all"
            >
              <span className="text-3xl mb-3 block">{tool.icon}</span>
              <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors mb-1">
                {tool.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{tool.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom Ad */}
      <AdSlot slot="bottom-banner" format="horizontal" className="mb-8" />

      {/* SEO Content */}
      <section className="prose dark:prose-invert max-w-none">
        <h2>About Lotto Numbers USA</h2>
        <p>
          LottoNumbersUSA.com is your trusted source for the latest US lottery results. We provide instant updates
          for Powerball, Mega Millions, and state lottery games across the United States. Our results are updated
          automatically after every draw, so you can check your winning numbers as soon as they are announced.
        </p>
        <h3>How to Check Your Lottery Results</h3>
        <p>
          Simply select your lottery game from the menu above or click on your state to see all available games.
          We display the latest winning numbers, jackpot amounts, and draw dates for every game. You can also
          view past results and number frequency analysis to help inform your number selections.
        </p>
        <h3>Available Lottery Games</h3>
        <p>
          We cover all major US lottery games including Powerball, Mega Millions, and state-specific games from
          California, Texas, Florida, New York, Pennsylvania, Ohio, Georgia, Michigan, North Carolina, and New Jersey.
          New states are added regularly.
        </p>
      </section>
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
