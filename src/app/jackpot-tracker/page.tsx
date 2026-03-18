import { Metadata } from 'next';
import Link from 'next/link';
import AdSlot from '@/components/AdSlot';
import Countdown from '@/components/Countdown';
import { getLatestResult } from '@/lib/api/lottery-api';
import { POWERBALL, MEGA_MILLIONS } from '@/lib/data/games';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Jackpot Tracker - All Current US Lottery Jackpots',
  description: 'Track all current US lottery jackpots in one place. See Powerball, Mega Millions, and state lottery jackpot amounts updated in real-time.',
};

export default async function JackpotTrackerPage() {
  const [powerball, megaMillions] = await Promise.all([
    getLatestResult('powerball'),
    getLatestResult('mega-millions'),
  ]);

  const jackpots = [
    {
      game: 'Powerball',
      slug: 'powerball',
      jackpot: powerball?.nextJackpot || powerball?.jackpot || 'TBD',
      nextDraw: powerball?.nextDrawDate || '',
      drawTime: POWERBALL.drawTime,
      color: POWERBALL.color,
      icon: '🔴',
    },
    {
      game: 'Mega Millions',
      slug: 'mega-millions',
      jackpot: megaMillions?.nextJackpot || megaMillions?.jackpot || 'TBD',
      nextDraw: megaMillions?.nextDrawDate || '',
      drawTime: MEGA_MILLIONS.drawTime,
      color: MEGA_MILLIONS.color,
      icon: '🔵',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">Jackpot Tracker</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
        US Lottery Jackpot Tracker
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
        All current lottery jackpots in one place, updated after every draw
      </p>

      <AdSlot slot="jackpot-top" format="horizontal" className="mb-8" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {jackpots.map(j => (
          <Link
            key={j.slug}
            href={`/${j.slug}`}
            className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all overflow-hidden"
          >
            <div className="p-6" style={{ borderTop: `4px solid ${j.color}` }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{j.icon}</span>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                  {j.game}
                </h2>
              </div>
              <div className="mb-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estimated Jackpot</p>
                <p className="text-4xl font-bold text-green-600 dark:text-green-400 mt-1">{j.jackpot}</p>
              </div>
              {j.nextDraw && (
                <Countdown targetDate={j.nextDraw} drawTime={j.drawTime} label="Next Draw" />
              )}
            </div>
          </Link>
        ))}
      </div>

      <AdSlot slot="jackpot-bottom" format="horizontal" className="mb-8" />

      <section className="prose dark:prose-invert max-w-none">
        <h2>US Lottery Jackpots</h2>
        <p>
          Track all current US lottery jackpots in real-time. Our jackpot tracker shows the latest estimated
          jackpot amounts for Powerball, Mega Millions, and state lottery games. Jackpot amounts are updated
          after every draw and when official estimates change.
        </p>
      </section>
    </div>
  );
}
