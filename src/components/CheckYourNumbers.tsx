'use client';

import { useState } from 'react';
import { POWERBALL, MEGA_MILLIONS } from '@/lib/data/games';
import type { GameConfig } from '@/lib/types';

interface CheckResult {
  matched: number[];
  bonusMatched: boolean;
  prizeTier: string;
  prizeAmount: string;
}

const PRIZE_TIERS: Record<string, Record<string, string>> = {
  powerball: {
    '5+bonus': 'JACKPOT',
    '5': '$1,000,000',
    '4+bonus': '$50,000',
    '4': '$100',
    '3+bonus': '$100',
    '3': '$7',
    '2+bonus': '$7',
    '1+bonus': '$4',
    '0+bonus': '$4',
  },
  'mega-millions': {
    '5+bonus': 'JACKPOT',
    '5': '$1,000,000',
    '4+bonus': '$10,000',
    '4': '$500',
    '3+bonus': '$200',
    '3': '$10',
    '2+bonus': '$10',
    '1+bonus': '$4',
    '0+bonus': '$2',
  },
};

function checkNumbers(
  userNumbers: number[],
  userBonus: number,
  winningNumbers: number[],
  winningBonus: number,
  gameSlug: string
): CheckResult {
  const matched = userNumbers.filter(n => winningNumbers.includes(n));
  const bonusMatched = userBonus === winningBonus;
  const key = `${matched.length}${bonusMatched ? '+bonus' : ''}`;
  const tiers = PRIZE_TIERS[gameSlug] || {};
  const prizeAmount = tiers[key] || 'No Prize';
  let prizeTier = 'No Match';

  if (prizeAmount !== 'No Prize') {
    prizeTier = prizeAmount === 'JACKPOT' ? 'JACKPOT WINNER!' : `Match ${matched.length}${bonusMatched ? ' + Bonus' : ''}`;
  }

  return { matched, bonusMatched, prizeTier, prizeAmount };
}

export default function CheckYourNumbers({ gameSlug, latestNumbers, latestBonus }: {
  gameSlug: 'powerball' | 'mega-millions';
  latestNumbers: number[];
  latestBonus?: number;
}) {
  const game: GameConfig = gameSlug === 'powerball' ? POWERBALL : MEGA_MILLIONS;
  const [userNumbers, setUserNumbers] = useState<string[]>(Array(game.mainNumbers).fill(''));
  const [userBonus, setUserBonus] = useState('');
  const [result, setResult] = useState<CheckResult | null>(null);
  const [error, setError] = useState('');

  const handleCheck = () => {
    setError('');
    setResult(null);

    const nums = userNumbers.map(n => parseInt(n, 10));
    const bonus = parseInt(userBonus, 10);

    if (nums.some(isNaN) || isNaN(bonus)) {
      setError('Please fill in all numbers.');
      return;
    }

    const [min, max] = game.mainRange;
    if (nums.some(n => n < min || n > max)) {
      setError(`Main numbers must be between ${min} and ${max}.`);
      return;
    }

    const [bMin, bMax] = game.bonusRange || [1, 26];
    if (bonus < bMin || bonus > bMax) {
      setError(`${game.bonusBallName} must be between ${bMin} and ${bMax}.`);
      return;
    }

    if (new Set(nums).size !== nums.length) {
      setError('Main numbers must be unique.');
      return;
    }

    const checkResult = checkNumbers(nums, bonus, latestNumbers, latestBonus || 0, gameSlug);
    setResult(checkResult);
  };

  const handleClear = () => {
    setUserNumbers(Array(game.mainNumbers).fill(''));
    setUserBonus('');
    setResult(null);
    setError('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-5">
      <h3 className="font-bold text-gray-900 dark:text-white mb-1">Check Your Numbers</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Enter your numbers to see if you won</p>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
            Your Numbers ({game.mainRange[0]}-{game.mainRange[1]})
          </label>
          <div className="flex gap-1.5 flex-wrap">
            {userNumbers.map((val, i) => (
              <input
                key={i}
                type="number"
                min={game.mainRange[0]}
                max={game.mainRange[1]}
                value={val}
                onChange={(e) => {
                  const updated = [...userNumbers];
                  updated[i] = e.target.value;
                  setUserNumbers(updated);
                }}
                className="w-12 h-12 text-center text-sm font-bold rounded-full border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder={(i + 1).toString()}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
            {game.bonusBallName} ({game.bonusRange?.[0]}-{game.bonusRange?.[1]})
          </label>
          <input
            type="number"
            min={game.bonusRange?.[0]}
            max={game.bonusRange?.[1]}
            value={userBonus}
            onChange={(e) => setUserBonus(e.target.value)}
            className="w-12 h-12 text-center text-sm font-bold rounded-full border-2 text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            style={{ borderColor: game.color, backgroundColor: game.color }}
            placeholder="?"
          />
        </div>

        {error && (
          <p className="text-red-500 text-xs font-medium">{error}</p>
        )}

        <div className="flex gap-2 pt-1">
          <button
            onClick={handleCheck}
            className="flex-1 py-2.5 px-4 rounded-lg text-sm font-bold text-white transition-all active:scale-[0.98]"
            style={{ backgroundColor: game.color }}
          >
            Check Numbers
          </button>
          <button
            onClick={handleClear}
            className="py-2.5 px-4 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Clear
          </button>
        </div>

        {result && (
          <div className={`mt-3 p-4 rounded-xl text-center ${
            result.prizeAmount === 'No Prize'
              ? 'bg-gray-50 dark:bg-gray-700'
              : result.prizeAmount === 'JACKPOT'
                ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-black'
                : 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800'
          }`}>
            <p className="text-xs font-medium mb-1 opacity-80">
              {result.matched.length} number{result.matched.length !== 1 ? 's' : ''} matched
              {result.bonusMatched ? ` + ${game.bonusBallName}` : ''}
            </p>
            <p className={`text-lg font-bold ${
              result.prizeAmount === 'No Prize'
                ? 'text-gray-500 dark:text-gray-400'
                : result.prizeAmount === 'JACKPOT'
                  ? 'text-black'
                  : 'text-green-600 dark:text-green-400'
            }`}>
              {result.prizeAmount === 'No Prize' ? 'No Prize — Try Again!' : result.prizeAmount === 'JACKPOT' ? 'JACKPOT WINNER!' : `You Won ${result.prizeAmount}!`}
            </p>
            <p className="text-xs mt-1 opacity-70">{result.prizeTier}</p>
          </div>
        )}
      </div>
    </div>
  );
}
