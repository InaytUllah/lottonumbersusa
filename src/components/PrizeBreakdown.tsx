interface PrizeTier {
  match: string;
  prize: string;
  odds: string;
  withMultiplier?: string;
}

const POWERBALL_PRIZES: PrizeTier[] = [
  { match: '5 + Powerball', prize: 'JACKPOT', odds: '1 in 292,201,338', withMultiplier: 'N/A' },
  { match: '5', prize: '$1,000,000', odds: '1 in 11,688,053', withMultiplier: '$2,000,000' },
  { match: '4 + Powerball', prize: '$50,000', odds: '1 in 913,129', withMultiplier: '$100,000 - $500,000' },
  { match: '4', prize: '$100', odds: '1 in 36,525', withMultiplier: '$200 - $1,000' },
  { match: '3 + Powerball', prize: '$100', odds: '1 in 14,494', withMultiplier: '$200 - $1,000' },
  { match: '3', prize: '$7', odds: '1 in 579', withMultiplier: '$14 - $70' },
  { match: '2 + Powerball', prize: '$7', odds: '1 in 701', withMultiplier: '$14 - $70' },
  { match: '1 + Powerball', prize: '$4', odds: '1 in 91', withMultiplier: '$8 - $40' },
  { match: 'Powerball only', prize: '$4', odds: '1 in 38', withMultiplier: '$8 - $40' },
];

const MEGA_MILLIONS_PRIZES: PrizeTier[] = [
  { match: '5 + Mega Ball', prize: 'JACKPOT', odds: '1 in 302,575,350', withMultiplier: 'N/A' },
  { match: '5', prize: '$1,000,000', odds: '1 in 12,607,306', withMultiplier: '$2M - $5M' },
  { match: '4 + Mega Ball', prize: '$10,000', odds: '1 in 931,001', withMultiplier: '$20K - $50K' },
  { match: '4', prize: '$500', odds: '1 in 38,792', withMultiplier: '$1,000 - $2,500' },
  { match: '3 + Mega Ball', prize: '$200', odds: '1 in 14,547', withMultiplier: '$400 - $1,000' },
  { match: '3', prize: '$10', odds: '1 in 606', withMultiplier: '$20 - $50' },
  { match: '2 + Mega Ball', prize: '$10', odds: '1 in 693', withMultiplier: '$20 - $50' },
  { match: '1 + Mega Ball', prize: '$4', odds: '1 in 89', withMultiplier: '$8 - $20' },
  { match: 'Mega Ball only', prize: '$2', odds: '1 in 37', withMultiplier: '$4 - $10' },
];

export default function PrizeBreakdown({ game }: { game: 'powerball' | 'mega-millions' }) {
  const prizes = game === 'powerball' ? POWERBALL_PRIZES : MEGA_MILLIONS_PRIZES;
  const multiplierName = game === 'powerball' ? 'Power Play' : 'Megaplier';
  const accentColor = game === 'powerball' ? 'red' : 'blue';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className={`bg-${accentColor}-600 px-5 py-3`} style={{ backgroundColor: game === 'powerball' ? '#e4002b' : '#0066b2' }}>
        <h3 className="font-bold text-white text-sm">Prize Breakdown</h3>
        <p className="text-xs text-white/80">All 9 prize tiers with {multiplierName}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Match</th>
              <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Prize</th>
              <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase hidden sm:table-cell">w/ {multiplierName}</th>
              <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase hidden md:table-cell">Odds</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {prizes.map((tier, index) => (
              <tr key={index} className={`${index === 0 ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''} hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors`}>
                <td className="px-4 py-2.5 font-medium text-gray-900 dark:text-white">
                  {tier.match}
                </td>
                <td className={`px-4 py-2.5 text-right font-bold ${index === 0 ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'}`}>
                  {tier.prize}
                </td>
                <td className="px-4 py-2.5 text-right text-gray-600 dark:text-gray-400 hidden sm:table-cell">
                  {tier.withMultiplier}
                </td>
                <td className="px-4 py-2.5 text-right font-mono text-xs text-gray-500 dark:text-gray-500 hidden md:table-cell">
                  {tier.odds}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-5 py-3 bg-gray-50 dark:bg-gray-750 text-xs text-gray-500 dark:text-gray-400">
        Overall odds of winning any prize: ~1 in {game === 'powerball' ? '24.87' : '24'}
      </div>
    </div>
  );
}
