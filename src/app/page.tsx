import { Metadata } from 'next';
import Link from 'next/link';
import ResultCard from '@/components/ResultCard';
import Countdown from '@/components/Countdown';
import JsonLd, { getFAQSchema } from '@/components/JsonLd';
import { getLatestResult } from '@/lib/api/lottery-api';
import { POWERBALL, MEGA_MILLIONS } from '@/lib/data/games';
import { STATES } from '@/lib/data/states';
import { getHomeSEO } from '@/lib/data/seo';

export const revalidate = 300;

const seo = getHomeSEO();
export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  alternates: { canonical: seo.canonical },
};

const homeFAQs = [
  {
    question: 'What time are Powerball numbers drawn?',
    answer: 'Powerball drawings take place every Monday, Wednesday, and Saturday at 10:59 PM Eastern Time. Results are usually available within minutes of the draw.',
  },
  {
    question: 'What time are Mega Millions numbers drawn?',
    answer: 'Mega Millions drawings take place every Tuesday and Friday at 11:00 PM Eastern Time. Winning numbers are posted on our site within minutes after the official draw.',
  },
  {
    question: 'How do I check my lottery numbers?',
    answer: 'Simply visit our homepage to see the latest Powerball and Mega Millions results. You can also click on your state to see state-specific lottery results. Compare the winning numbers displayed with the numbers on your ticket.',
  },
  {
    question: 'Are the lottery results on this site official?',
    answer: 'Our results are sourced from official public data APIs and are updated within minutes of each draw. However, they are unofficial. Always verify your winning numbers with your official state lottery commission before claiming any prize.',
  },
  {
    question: 'Which US states have their own lottery games?',
    answer: 'Most US states operate their own lottery in addition to participating in national games like Powerball and Mega Millions. We currently cover state-specific games for California, Texas, Florida, New York, Pennsylvania, Ohio, Georgia, Michigan, North Carolina, and New Jersey.',
  },
  {
    question: 'What are the odds of winning the Powerball jackpot?',
    answer: 'The odds of winning the Powerball jackpot are approximately 1 in 292.2 million. However, there are 9 prize tiers, and the overall odds of winning any Powerball prize are about 1 in 24.87.',
  },
];

export default async function HomePage() {
  const [powerballResult, megaMillionsResult] = await Promise.all([
    getLatestResult('powerball'),
    getLatestResult('mega-millions'),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <JsonLd data={getFAQSchema(homeFAQs)} />

      {/* Hero Section */}
      <section className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3">
          Lotto Numbers USA &mdash; Latest US Lottery Results
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Check the latest Powerball, Mega Millions, and state lottery winning numbers. Updated instantly after every draw.
        </p>
      </section>

      {/* Main Results Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <div>
          {powerballResult && (
            <ResultCard result={powerballResult} gameConfig={POWERBALL} />
          )}
          {powerballResult?.nextDrawDate && (
            <div className="mt-4">
              <Countdown targetDate={powerballResult.nextDrawDate} drawTime={POWERBALL.drawTime} label="Next Powerball Draw" />
            </div>
          )}
        </div>
        <div>
          {megaMillionsResult && (
            <ResultCard result={megaMillionsResult} gameConfig={MEGA_MILLIONS} />
          )}
          {megaMillionsResult?.nextDrawDate && (
            <div className="mt-4">
              <Countdown targetDate={megaMillionsResult.nextDrawDate} drawTime={MEGA_MILLIONS.drawTime} label="Next Mega Millions Draw" />
            </div>
          )}
        </div>
      </section>

      {/* State Lotteries */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">State Lottery Results</h2>
          <Link href="/states" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 transition-colors">
            View All States &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {STATES.map(state => (
            <Link key={state.slug} href={`/${state.slug}`} className="group bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all text-center">
              <span className="text-2xl mb-1 block">{getStateEmoji(state.abbreviation)}</span>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{state.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{state.games.length} games</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Tools */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Free Lottery Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Number Generator', desc: 'Generate random lottery numbers for any US game', href: '/number-generator', icon: '🎲' },
            { title: 'Jackpot Tracker', desc: 'Track all current jackpot amounts in one place', href: '/jackpot-tracker', icon: '💰' },
            { title: 'Odds Calculator', desc: 'Calculate your chances of winning any lottery', href: '/odds-calculator', icon: '📊' },
            { title: 'Number Frequency', desc: 'See the hottest and coldest lottery numbers', href: '/number-frequency', icon: '🔥' },
          ].map(tool => (
            <Link key={tool.href} href={tool.href} className="group bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all">
              <span className="text-3xl mb-3 block">{tool.icon}</span>
              <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors mb-1">{tool.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{tool.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* SEO Content with internal links */}
      <section className="prose dark:prose-invert max-w-none mb-10">
        <h2>About Lotto Numbers USA</h2>
        <p>
          LottoNumbersUSA.com is your trusted source for the latest US lottery results. We provide instant updates
          for <Link href="/powerball">Powerball</Link>, <Link href="/mega-millions">Mega Millions</Link>, and state
          lottery games across the United States. Our results are updated automatically after every draw, so you
          can check your winning numbers as soon as they are announced.
        </p>
        <h3>How to Check Your Lottery Results</h3>
        <p>
          Simply select your lottery game from the menu above or click on your state to see all available games.
          We display the latest winning numbers, jackpot amounts, and draw dates for every game. You can also
          view past results and use our <Link href="/number-frequency">number frequency analysis</Link> to see
          which numbers are drawn most often.
        </p>
        <h3>Available Lottery Games</h3>
        <p>
          We cover all major US lottery games including Powerball, Mega Millions, and state-specific games from{' '}
          <Link href="/california">California</Link>, <Link href="/texas">Texas</Link>, <Link href="/florida">Florida</Link>,{' '}
          <Link href="/new-york">New York</Link>, <Link href="/pennsylvania">Pennsylvania</Link>,{' '}
          <Link href="/ohio">Ohio</Link>, <Link href="/georgia">Georgia</Link>,{' '}
          <Link href="/michigan">Michigan</Link>, <Link href="/north-carolina">North Carolina</Link>, and{' '}
          <Link href="/new-jersey">New Jersey</Link>. New states are added regularly.
        </p>
        <p>
          In addition to results, we offer free tools including a <Link href="/number-generator">lottery number generator</Link>,{' '}
          <Link href="/odds-calculator">odds calculator</Link>, and <Link href="/jackpot-tracker">jackpot tracker</Link> to
          help you make informed decisions about your lottery play.
        </p>
      </section>

      {/* FAQ Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {homeFAQs.map((faq, index) => (
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

function getStateEmoji(abbreviation: string): string {
  const emojis: Record<string, string> = {
    CA: '☀️', TX: '🤠', FL: '🌴', NY: '🗽', PA: '🔔',
    OH: '🏈', GA: '🍑', MI: '🏒', NC: '🌲', NJ: '🏖️',
  };
  return emojis[abbreviation] || '🏛️';
}
