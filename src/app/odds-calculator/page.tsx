'use client';

import { useState } from 'react';
import Link from 'next/link';
import { NATIONAL_GAMES, STATE_GAMES } from '@/lib/data/games';
import { GameConfig } from '@/lib/types';

function factorial(n: number): number {
  if (n <= 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

function combinations(n: number, r: number): number {
  if (r > n) return 0;
  return factorial(n) / (factorial(r) * factorial(n - r));
}

function calculateOdds(game: GameConfig): { jackpot: number; anyPrize: number } {
  const mainCombinations = combinations(game.mainRange[1] - game.mainRange[0] + 1, game.mainNumbers);
  let jackpotOdds = mainCombinations;

  if (game.bonusBall && game.bonusRange) {
    jackpotOdds *= (game.bonusRange[1] - game.bonusRange[0] + 1);
  }

  // Approximate "any prize" odds (simplified)
  const anyPrize = Math.round(jackpotOdds / 12);

  return { jackpot: jackpotOdds, anyPrize };
}

const allGames = [
  ...NATIONAL_GAMES,
  ...Object.values(STATE_GAMES).flat(),
];

export default function OddsCalculatorPage() {
  const [selectedGame, setSelectedGame] = useState<GameConfig>(NATIONAL_GAMES[0]);
  const odds = calculateOdds(selectedGame);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">Odds Calculator</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
        Lottery Odds Calculator
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
        Calculate your chances of winning any US lottery game
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6 mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Game</label>
            <select
              value={`${selectedGame.stateSlug || ''}:${selectedGame.slug}`}
              onChange={(e) => {
                const [stateSlug, gameSlug] = e.target.value.split(':');
                const game = allGames.find(g => g.slug === gameSlug && (g.stateSlug || '') === stateSlug);
                if (game) setSelectedGame(game);
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-6"
            >
              <optgroup label="National Games">
                {NATIONAL_GAMES.map(g => (
                  <option key={g.slug} value={`:${g.slug}`}>{g.name}</option>
                ))}
              </optgroup>
              {Object.entries(STATE_GAMES).map(([stateSlug, games]) => (
                <optgroup key={stateSlug} label={games[0]?.state || stateSlug}>
                  {games.map(g => (
                    <option key={`${stateSlug}:${g.slug}`} value={`${stateSlug}:${g.slug}`}>{g.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>

            {/* Results */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-5 text-center">
                <p className="text-xs text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-1">Jackpot Odds</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-200">
                  1 in {odds.jackpot.toLocaleString()}
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-5 text-center">
                <p className="text-xs text-green-600 dark:text-green-400 uppercase tracking-wider mb-1">Any Prize (Est.)</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-200">
                  ~1 in {odds.anyPrize.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Game Details */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Game Details</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500">Main Numbers</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedGame.mainNumbers}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500">Range</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedGame.mainRange[0]}-{selectedGame.mainRange[1]}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500">Bonus Ball</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedGame.bonusBall ? 'Yes' : 'No'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500">Combinations</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{odds.jackpot.toLocaleString()}</p>
              </div>
            </div>

            {/* Official Odds */}
            <h3 className="font-bold text-gray-900 dark:text-white mb-3">Official Prize Odds</h3>
            <div className="space-y-2">
              {Object.entries(selectedGame.odds).map(([match, officialOdds]) => (
                <div key={match} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{match}</span>
                  <span className="font-mono text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-1 rounded">
                    {officialOdds}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-5">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3">Understanding Odds</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Lottery odds represent the probability of winning. A &ldquo;1 in 292 million&rdquo; chance means
              if you bought 292 million different tickets, statistically one would win. Each ticket has the
              same odds regardless of numbers chosen.
            </p>
          </div>
        </div>
      </div>

      <section className="mt-12 prose dark:prose-invert max-w-none">
        <h2>Lottery Odds Calculator</h2>
        <p>
          Use our odds calculator to understand your chances of winning any US lottery game. The calculator
          shows both jackpot odds and estimated odds of winning any prize. Remember that every combination
          has exactly the same probability of being drawn.
        </p>
      </section>
    </div>
  );
}
