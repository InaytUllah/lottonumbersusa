import Link from 'next/link';
import { fetchPastResults } from '@/lib/api/lottery-api';

interface NumberStat {
  number: number;
  count: number;
  lastDrawnDate?: string;
  daysSinceDrawn: number;
}

async function getMostDue(game: string, maxNum: number): Promise<{
  mostDue: NumberStat[];
  leastDue: NumberStat[];
}> {
  const results = await fetchPastResults(game, 100);
  const today = new Date();

  const stats = new Map<number, NumberStat>();
  for (let i = 1; i <= maxNum; i++) {
    stats.set(i, { number: i, count: 0, daysSinceDrawn: 999 });
  }

  results.forEach(result => {
    const drawDate = new Date(result.drawDate + 'T00:00:00');
    const daysAgo = Math.floor((today.getTime() - drawDate.getTime()) / (1000 * 60 * 60 * 24));
    result.numbers.forEach(n => {
      const stat = stats.get(n);
      if (stat) {
        stat.count++;
        if (daysAgo < stat.daysSinceDrawn) {
          stat.daysSinceDrawn = daysAgo;
          stat.lastDrawnDate = result.drawDate;
        }
      }
    });
  });

  const allStats = Array.from(stats.values());
  const mostDue = [...allStats].sort((a, b) => b.daysSinceDrawn - a.daysSinceDrawn).slice(0, 5);
  const leastDue = [...allStats].sort((a, b) => a.daysSinceDrawn - b.daysSinceDrawn).slice(0, 5);

  return { mostDue, leastDue };
}

export default async function MostDueWidget() {
  const [pb, mm] = await Promise.all([
    getMostDue('powerball', 69),
    getMostDue('mega-millions', 70),
  ]);

  return (
    <section className="mb-10">
      <div className="mb-5">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Most overdue lottery numbers</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Numbers that haven&apos;t been drawn in the longest time, based on the last 100 draws</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Powerball */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-5 py-3 bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-900/30">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">Powerball</h3>
              <Link href="/number-frequency" className="text-xs text-red-700 dark:text-red-400 font-medium hover:underline">
                Full analysis →
              </Link>
            </div>
          </div>
          <div className="p-5 grid grid-cols-2 gap-5">
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Most due</p>
              <div className="flex gap-2 flex-wrap">
                {pb.mostDue.map(s => (
                  <div key={s.number} className="text-center">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 font-bold text-sm">
                      {s.number}
                    </span>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                      {s.daysSinceDrawn === 999 ? 'Never' : `${s.daysSinceDrawn}d ago`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Least due (hot)</p>
              <div className="flex gap-2 flex-wrap">
                {pb.leastDue.map(s => (
                  <div key={s.number} className="text-center">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 font-bold text-sm">
                      {s.number}
                    </span>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                      {s.daysSinceDrawn === 0 ? 'Today' : `${s.daysSinceDrawn}d ago`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mega Millions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-5 py-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-900/30">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">Mega Millions</h3>
              <Link href="/number-frequency" className="text-xs text-blue-700 dark:text-blue-400 font-medium hover:underline">
                Full analysis →
              </Link>
            </div>
          </div>
          <div className="p-5 grid grid-cols-2 gap-5">
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Most due</p>
              <div className="flex gap-2 flex-wrap">
                {mm.mostDue.map(s => (
                  <div key={s.number} className="text-center">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold text-sm">
                      {s.number}
                    </span>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                      {s.daysSinceDrawn === 999 ? 'Never' : `${s.daysSinceDrawn}d ago`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Least due (hot)</p>
              <div className="flex gap-2 flex-wrap">
                {mm.leastDue.map(s => (
                  <div key={s.number} className="text-center">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 font-bold text-sm">
                      {s.number}
                    </span>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                      {s.daysSinceDrawn === 0 ? 'Today' : `${s.daysSinceDrawn}d ago`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
        Each lottery number has the same probability of being drawn — these stats are for entertainment only.
      </p>
    </section>
  );
}
