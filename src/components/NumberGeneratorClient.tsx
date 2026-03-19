'use client';

import { useState } from 'react';
import Link from 'next/link';
import LotteryBalls from '@/components/LotteryBalls';
import { NATIONAL_GAMES, STATE_GAMES } from '@/lib/data/games';
import { GameConfig } from '@/lib/types';

const allGames: GameConfig[] = [
  ...NATIONAL_GAMES,
  ...Object.values(STATE_GAMES).flat(),
];

const uniqueGames = allGames.filter((game, index, self) =>
  index === self.findIndex(g => g.slug === game.slug && g.stateSlug === game.stateSlug)
);

function generateNumbers(game: GameConfig): { numbers: number[]; bonusBall?: number } {
  const numbers: number[] = [];
  const [min, max] = game.mainRange;

  while (numbers.length < game.mainNumbers) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    if (!numbers.includes(num)) {
      numbers.push(num);
    }
  }
  numbers.sort((a, b) => a - b);

  let bonusBall: number | undefined;
  if (game.bonusBall && game.bonusRange) {
    bonusBall = Math.floor(Math.random() * (game.bonusRange[1] - game.bonusRange[0] + 1)) + game.bonusRange[0];
  }

  return { numbers, bonusBall };
}

export default function NumberGeneratorClient() {
  const [selectedGame, setSelectedGame] = useState<GameConfig>(NATIONAL_GAMES[0]);
  const [generated, setGenerated] = useState<{ numbers: number[]; bonusBall?: number }[]>([]);
  const [count, setCount] = useState(5);

  const handleGenerate = () => {
    const results = Array.from({ length: count }, () => generateNumbers(selectedGame));
    setGenerated(results);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Game</label>
              <select
                value={`${selectedGame.stateSlug || ''}:${selectedGame.slug}`}
                onChange={(e) => {
                  const [stateSlug, gameSlug] = e.target.value.split(':');
                  const game = uniqueGames.find(g => g.slug === gameSlug && (g.stateSlug || '') === stateSlug);
                  if (game) setSelectedGame(game);
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
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
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">How Many Lines</label>
              <select
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                {[1, 3, 5, 10, 20].map(n => (
                  <option key={n} value={n}>{n} {n === 1 ? 'line' : 'lines'}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
          >
            Generate Numbers
          </button>

          <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span>Pick {selectedGame.mainNumbers} from {selectedGame.mainRange[0]}-{selectedGame.mainRange[1]}</span>
            {selectedGame.bonusBall && selectedGame.bonusRange && (
              <span>+ {selectedGame.bonusBallName} from {selectedGame.bonusRange[0]}-{selectedGame.bonusRange[1]}</span>
            )}
          </div>
        </div>

        {generated.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Your {selectedGame.name} Numbers</h2>
            <div className="space-y-4">
              {generated.map((result, index) => (
                <div key={index} className="flex items-center gap-3 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <span className="text-sm text-gray-400 w-6">#{index + 1}</span>
                  <LotteryBalls numbers={result.numbers} bonusBall={result.bonusBall} bonusBallName={selectedGame.bonusBallName} size="sm" gameColor={selectedGame.color} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-5">
          <h3 className="font-bold text-gray-900 dark:text-white mb-3">About This Tool</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Our lottery number generator uses a random number algorithm to produce unbiased combinations for any US lottery game. Each number has an equal probability of being selected.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-5">
          <h3 className="font-bold text-gray-900 dark:text-white mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link href="/powerball" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Powerball Results</Link></li>
            <li><Link href="/mega-millions" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Mega Millions Results</Link></li>
            <li><Link href="/number-frequency" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Number Frequency</Link></li>
            <li><Link href="/odds-calculator" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Odds Calculator</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
