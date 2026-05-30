import Link from 'next/link';

interface WinnerStory {
  headline: string;
  amount: string;
  state: string;
  date: string;
  game: string;
}

// Verified historical biggest US lottery jackpots (public record)
const RECENT_WINNERS: WinnerStory[] = [
  { headline: 'Largest Powerball jackpot ever won', amount: '$2.04 Billion', state: 'California', date: 'Nov 2022', game: 'Powerball' },
  { headline: 'Record Mega Millions jackpot claimed', amount: '$1.537 Billion', state: 'South Carolina', date: 'Oct 2018', game: 'Mega Millions' },
  { headline: 'Single ticket wins massive Mega Millions prize', amount: '$1.337 Billion', state: 'Illinois', date: 'Jul 2022', game: 'Mega Millions' },
  { headline: 'Powerball jackpot claimed after months of rolls', amount: '$1.326 Billion', state: 'Oregon', date: 'Apr 2024', game: 'Powerball' },
  { headline: 'Mega Millions jackpot won in Maine', amount: '$1.35 Billion', state: 'Maine', date: 'Jan 2023', game: 'Mega Millions' },
];

export default function WinnerStories() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="bg-gradient-to-r from-yellow-500 to-amber-500 px-5 py-3">
        <h3 className="font-bold text-white text-sm">Recent Big Winners</h3>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {RECENT_WINNERS.map((winner, i) => (
          <div key={i} className="px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{winner.headline}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {winner.game} &middot; {winner.state} &middot; {winner.date}
                </p>
              </div>
              <span className="text-sm font-bold text-green-600 dark:text-green-400 whitespace-nowrap">{winner.amount}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="px-5 py-3 bg-gray-50 dark:bg-gray-750">
        <Link href="/blog" className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline">
          View more lottery stories &rarr;
        </Link>
      </div>
    </div>
  );
}
