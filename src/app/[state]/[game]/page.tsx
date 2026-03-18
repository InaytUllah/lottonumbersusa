import { Metadata } from 'next';
import Link from 'next/link';
import LotteryBalls from '@/components/LotteryBalls';
import { STATES } from '@/lib/data/states';
import { STATE_GAMES, getGameBySlug } from '@/lib/data/games';
import { getGameSEO } from '@/lib/data/seo';
import { getLatestResult } from '@/lib/api/lottery-api';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const paths: { state: string; game: string }[] = [];
  Object.entries(STATE_GAMES).forEach(([stateSlug, games]) => {
    games.forEach(game => {
      paths.push({ state: stateSlug, game: game.slug });
    });
  });
  return paths;
}

export async function generateMetadata({ params }: { params: Promise<{ state: string; game: string }> }): Promise<Metadata> {
  const { state: stateSlug, game: gameSlug } = await params;
  const gameConfig = getGameBySlug(gameSlug, stateSlug);
  if (!gameConfig) return {};
  const seo = getGameSEO(gameConfig.name, gameSlug, gameConfig.state);
  return { title: seo.title, description: seo.description, keywords: seo.keywords };
}

export default async function GamePage({ params }: { params: Promise<{ state: string; game: string }> }) {
  const { state: stateSlug, game: gameSlug } = await params;
  const gameConfig = getGameBySlug(gameSlug, stateSlug);
  const state = STATES.find(s => s.slug === stateSlug);
  if (!gameConfig || !state) notFound();

  const latestResult = await getLatestResult(gameSlug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link href={`/${stateSlug}`} className="hover:text-blue-600 transition-colors">{state.name}</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">{gameConfig.name}</span>
      </nav>

      {/* Hero */}
      <div
        className="rounded-2xl p-6 sm:p-10 mb-8 text-white"
        style={{ background: `linear-gradient(135deg, ${gameConfig.color}, ${gameConfig.color}dd)` }}
      >
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          {state.name} {gameConfig.name} Results
        </h1>
        <p className="text-white/80 text-lg">
          Latest winning numbers &bull; {gameConfig.drawDays.join(', ')} at {gameConfig.drawTime}
        </p>

        {latestResult && (
          <div className="mt-6 bg-white/10 backdrop-blur rounded-xl p-6">
            <p className="text-sm text-white/70 mb-3">Latest Winning Numbers</p>
            <LotteryBalls
              numbers={latestResult.numbers}
              bonusBall={latestResult.bonusBall}
              bonusBallName={gameConfig.bonusBallName}
              multiplier={latestResult.multiplier}
              multiplierName={gameConfig.multiplierName}
              size="lg"
              gameColor={gameConfig.color}
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* How to Play */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              How to Play {gameConfig.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{gameConfig.howToPlay}</p>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">Numbers</p>
                <p className="font-bold text-gray-900 dark:text-white">{gameConfig.mainNumbers}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">Range</p>
                <p className="font-bold text-gray-900 dark:text-white">{gameConfig.mainRange[0]}-{gameConfig.mainRange[1]}</p>
              </div>
              {gameConfig.bonusBall && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">{gameConfig.bonusBallName}</p>
                  <p className="font-bold text-gray-900 dark:text-white">{gameConfig.bonusRange?.[0]}-{gameConfig.bonusRange?.[1]}</p>
                </div>
              )}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">Price</p>
                <p className="font-bold text-gray-900 dark:text-white">${gameConfig.ticketPrice}</p>
              </div>
            </div>
          </div>

          {/* Odds */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Odds of Winning</h2>
            <div className="space-y-3">
              {Object.entries(gameConfig.odds).map(([match, odds]) => (
                <div key={match} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <span className="text-gray-700 dark:text-gray-300">{match}</span>
                  <span className="font-mono text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-1 rounded">{odds}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-5">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3">Game Info</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Draw Days:</span>
                <span className="font-medium text-gray-900 dark:text-white">{gameConfig.drawDays.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Draw Time:</span>
                <span className="font-medium text-gray-900 dark:text-white">{gameConfig.drawTime}</span>
              </div>
              {gameConfig.multiplier && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Multiplier:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{gameConfig.multiplierName}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-5">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3">Other {state.name} Games</h3>
            <ul className="space-y-2">
              {state.games.filter(g => g.slug !== gameSlug).map(game => (
                <li key={game.slug}>
                  <Link
                    href={game.stateSlug ? `/${game.stateSlug}/${game.slug}` : `/${game.slug}`}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {game.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <section className="mt-12 prose dark:prose-invert max-w-none">
        <h2>{state.name} {gameConfig.name} Winning Numbers</h2>
        <p>
          Get the latest {state.name} {gameConfig.name} results right here. {gameConfig.description} Draws take
          place {gameConfig.drawDays.join(', ')} at {gameConfig.drawTime}. Results are updated automatically.
        </p>
      </section>
    </div>
  );
}
