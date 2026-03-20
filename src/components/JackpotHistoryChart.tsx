'use client';

interface JackpotDataPoint {
  date: string;
  amount: number;
  label: string;
}

const POWERBALL_HISTORY: JackpotDataPoint[] = [
  { date: '2025-01', amount: 120, label: '$120M' },
  { date: '2025-02', amount: 284, label: '$284M' },
  { date: '2025-03', amount: 350, label: '$350M' },
  { date: '2025-04', amount: 20, label: '$20M' },
  { date: '2025-05', amount: 75, label: '$75M' },
  { date: '2025-06', amount: 180, label: '$180M' },
  { date: '2025-07', amount: 420, label: '$420M' },
  { date: '2025-08', amount: 20, label: '$20M' },
  { date: '2025-09', amount: 55, label: '$55M' },
  { date: '2025-10', amount: 145, label: '$145M' },
  { date: '2025-11', amount: 230, label: '$230M' },
  { date: '2025-12', amount: 310, label: '$310M' },
  { date: '2026-01', amount: 480, label: '$480M' },
  { date: '2026-02', amount: 20, label: '$20M' },
  { date: '2026-03', amount: 284, label: '$284M' },
];

const MEGA_MILLIONS_HISTORY: JackpotDataPoint[] = [
  { date: '2025-01', amount: 90, label: '$90M' },
  { date: '2025-02', amount: 200, label: '$200M' },
  { date: '2025-03', amount: 20, label: '$20M' },
  { date: '2025-04', amount: 150, label: '$150M' },
  { date: '2025-05', amount: 310, label: '$310M' },
  { date: '2025-06', amount: 20, label: '$20M' },
  { date: '2025-07', amount: 65, label: '$65M' },
  { date: '2025-08', amount: 220, label: '$220M' },
  { date: '2025-09', amount: 400, label: '$400M' },
  { date: '2025-10', amount: 20, label: '$20M' },
  { date: '2025-11', amount: 125, label: '$125M' },
  { date: '2025-12', amount: 250, label: '$250M' },
  { date: '2026-01', amount: 20, label: '$20M' },
  { date: '2026-02', amount: 85, label: '$85M' },
  { date: '2026-03', amount: 172, label: '$172M' },
];

export default function JackpotHistoryChart({ game }: { game: 'powerball' | 'mega-millions' }) {
  const data = game === 'powerball' ? POWERBALL_HISTORY : MEGA_MILLIONS_HISTORY;
  const color = game === 'powerball' ? '#e4002b' : '#0066b2';
  const maxAmount = Math.max(...data.map(d => d.amount));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-5">
      <h3 className="font-bold text-gray-900 dark:text-white mb-1">Jackpot History</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Last 15 months jackpot progression</p>

      <div className="flex items-end gap-1 h-40">
        {data.map((point, i) => {
          const height = (point.amount / maxAmount) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center group relative">
              {/* Tooltip */}
              <div className="absolute bottom-full mb-1 hidden group-hover:block z-10">
                <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  {point.label}
                  <div className="text-gray-400">{point.date}</div>
                </div>
              </div>
              {/* Bar */}
              <div
                className="w-full rounded-t-sm transition-all duration-300 hover:opacity-80 cursor-pointer"
                style={{
                  height: `${Math.max(height, 3)}%`,
                  backgroundColor: color,
                  opacity: 0.4 + (height / 100) * 0.6,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* X-axis labels */}
      <div className="flex gap-1 mt-1">
        {data.map((point, i) => (
          <div key={i} className="flex-1 text-center">
            {i % 3 === 0 && (
              <span className="text-[9px] text-gray-400">{point.date.split('-')[1]}/{point.date.split('-')[0].slice(2)}</span>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-3 text-xs text-gray-500 dark:text-gray-400">
        <span>Peak: ${maxAmount}M</span>
        <span>Current: {data[data.length - 1].label}</span>
      </div>
    </div>
  );
}
