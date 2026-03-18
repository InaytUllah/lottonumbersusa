import Link from 'next/link';
import LotteryBalls from './LotteryBalls';
import { LotteryResult, GameConfig } from '@/lib/types';
import { formatDate } from '@/lib/api/lottery-api';

interface ResultCardProps {
  result: LotteryResult;
  gameConfig?: GameConfig;
  showLink?: boolean;
  compact?: boolean;
}

export default function ResultCard({ result, gameConfig, showLink = true, compact = false }: ResultCardProps) {
  const gameUrl = result.gameSlug.includes('/')
    ? `/${result.gameSlug}`
    : `/${result.gameSlug}`;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            {showLink ? (
              <Link href={gameUrl} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {result.game}
              </Link>
            ) : (
              result.game
            )}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {formatDate(result.drawDate)}
          </p>
        </div>

        {result.jackpot && (
          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Jackpot</p>
            <p className="text-lg sm:text-xl font-bold text-green-600 dark:text-green-400">
              {result.jackpot}
            </p>
          </div>
        )}
      </div>

      <div className="mb-3">
        <LotteryBalls
          numbers={result.numbers}
          bonusBall={result.bonusBall}
          bonusBallName={result.bonusBallName}
          multiplier={result.multiplier}
          multiplierName={result.multiplierName}
          size={compact ? 'sm' : 'md'}
          gameColor={gameConfig?.color}
        />
      </div>

      {!compact && result.nextJackpot && (
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Next Jackpot:</span>
            <span className="text-sm font-bold text-green-600 dark:text-green-400">{result.nextJackpot}</span>
          </div>
          {result.nextDrawDate && (
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {formatDate(result.nextDrawDate)}
            </span>
          )}
        </div>
      )}

      {showLink && (
        <Link
          href={gameUrl}
          className="mt-3 inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
        >
          View all results
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </div>
  );
}
