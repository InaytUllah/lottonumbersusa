'use client';

interface LotteryBallsProps {
  numbers: number[];
  bonusBall?: number;
  bonusBallName?: string;
  multiplier?: number;
  multiplierName?: string;
  size?: 'sm' | 'md' | 'lg';
  gameColor?: string;
}

const sizeClasses = {
  sm: 'w-10 h-10 text-sm',
  md: 'w-14 h-14 text-lg',
  lg: 'w-18 h-18 text-2xl',
};

export default function LotteryBalls({
  numbers,
  bonusBall,
  bonusBallName,
  multiplier,
  multiplierName,
  size = 'md',
  gameColor,
}: LotteryBallsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      {numbers.map((num, index) => (
        <div
          key={`main-${index}`}
          className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold text-white shadow-lg transition-transform hover:scale-110`}
          style={{
            background: `linear-gradient(135deg, #4a5568 0%, #2d3748 100%)`,
            boxShadow: '0 4px 14px rgba(0,0,0,0.25), inset 0 2px 4px rgba(255,255,255,0.15)',
          }}
        >
          {num}
        </div>
      ))}

      {bonusBall !== undefined && (
        <>
          <div className="text-gray-400 font-light text-xl mx-1">+</div>
          <div
            className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold text-white shadow-lg transition-transform hover:scale-110`}
            style={{
              background: `linear-gradient(135deg, ${gameColor || '#e4002b'} 0%, ${gameColor ? adjustColor(gameColor, -30) : '#b8001e'} 100%)`,
              boxShadow: `0 4px 14px ${gameColor || '#e4002b'}40, inset 0 2px 4px rgba(255,255,255,0.2)`,
            }}
            title={bonusBallName}
          >
            {bonusBall}
          </div>
        </>
      )}

      {multiplier !== undefined && multiplier > 0 && (
        <div
          className={`ml-2 px-3 py-1 rounded-full text-sm font-bold text-yellow-900 bg-gradient-to-r from-yellow-300 to-yellow-500 shadow-md`}
          title={multiplierName}
        >
          {multiplierName?.replace(' ', '') || 'x'}{multiplier}x
        </div>
      )}
    </div>
  );
}

function adjustColor(hex: string, amount: number): string {
  const color = hex.replace('#', '');
  const r = Math.max(0, Math.min(255, parseInt(color.substring(0, 2), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(color.substring(2, 4), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(color.substring(4, 6), 16) + amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
