import { Metadata } from 'next';
import Link from 'next/link';
import { fetchPastResults } from '@/lib/api/lottery-api';


export const metadata: Metadata = {
  title: 'Number Frequency Analysis - Hot & Cold Lottery Numbers',
  description: 'See which lottery numbers are drawn most and least often. Analyze Powerball and Mega Millions number frequency to help pick your numbers.',
};

function analyzeFrequency(results: { numbers: number[]; bonusBall?: number }[], maxNum: number) {
  const freq: Record<number, number> = {};
  for (let i = 1; i <= maxNum; i++) freq[i] = 0;
  results.forEach(r => r.numbers.forEach(n => { if (freq[n] !== undefined) freq[n]++; }));

  const sorted = Object.entries(freq)
    .map(([num, count]) => ({ number: parseInt(num), count }))
    .sort((a, b) => b.count - a.count);

  return sorted;
}

export default async function NumberFrequencyPage() {
  const [pbResults, mmResults] = await Promise.all([
    fetchPastResults('powerball', 100),
    fetchPastResults('mega-millions', 100),
  ]);

  const pbFrequency = analyzeFrequency(pbResults, 69);
  const mmFrequency = analyzeFrequency(mmResults, 70);
  const pbBonusFreq = analyzeFrequency(
    pbResults.map(r => ({ numbers: r.bonusBall ? [r.bonusBall] : [], bonusBall: undefined })),
    26
  );
  const mmBonusFreq = analyzeFrequency(
    mmResults.map(r => ({ numbers: r.bonusBall ? [r.bonusBall] : [], bonusBall: undefined })),
    25
  );

  const maxPbCount = Math.max(...pbFrequency.map(f => f.count), 1);
  const maxMmCount = Math.max(...mmFrequency.map(f => f.count), 1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">Number Frequency</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
        Lottery Number Frequency Analysis
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
        See which numbers are drawn most and least often based on the last 100 draws
      </p>

      {/* Powerball Frequency */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Powerball Main Numbers</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Hot Numbers */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-5">
            <h3 className="font-bold text-red-600 dark:text-red-400 mb-3">Hot Numbers (Most Drawn)</h3>
            <div className="flex flex-wrap gap-2">
              {pbFrequency.slice(0, 10).map(f => (
                <div key={f.number} className="flex items-center gap-1 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
                  <span className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center text-sm font-bold">{f.number}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">{f.count}x</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cold Numbers */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-5">
            <h3 className="font-bold text-blue-600 dark:text-blue-400 mb-3">Cold Numbers (Least Drawn)</h3>
            <div className="flex flex-wrap gap-2">
              {pbFrequency.slice(-10).reverse().map(f => (
                <div key={f.number} className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg px-3 py-2">
                  <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">{f.number}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">{f.count}x</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Frequency Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-5 overflow-x-auto">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">All Numbers Frequency</h3>
          <div className="flex gap-1 items-end min-w-[600px]" style={{ height: 150 }}>
            {pbFrequency.sort((a, b) => a.number - b.number).map(f => (
              <div key={f.number} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-gradient-to-t from-red-600 to-red-400 rounded-t-sm transition-all hover:from-red-700 hover:to-red-500"
                  style={{ height: `${(f.count / maxPbCount) * 120}px`, minHeight: 2 }}
                  title={`#${f.number}: ${f.count} times`}
                />
                <span className="text-[8px] text-gray-400">{f.number}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Powerball Bonus */}
        <div className="mt-4 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-5">
          <h3 className="font-bold text-gray-900 dark:text-white mb-3">Powerball (Red Ball) Frequency</h3>
          <div className="flex flex-wrap gap-2">
            {pbBonusFreq.slice(0, 10).map(f => (
              <div key={f.number} className="flex items-center gap-1 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
                <span className="w-7 h-7 rounded-full bg-red-700 text-white flex items-center justify-center text-xs font-bold">{f.number}</span>
                <span className="text-xs text-gray-600 dark:text-gray-400">{f.count}x</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mega Millions Frequency */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Mega Millions Main Numbers</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-5">
            <h3 className="font-bold text-red-600 dark:text-red-400 mb-3">Hot Numbers</h3>
            <div className="flex flex-wrap gap-2">
              {mmFrequency.slice(0, 10).map(f => (
                <div key={f.number} className="flex items-center gap-1 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
                  <span className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center text-sm font-bold">{f.number}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">{f.count}x</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-5">
            <h3 className="font-bold text-blue-600 dark:text-blue-400 mb-3">Cold Numbers</h3>
            <div className="flex flex-wrap gap-2">
              {mmFrequency.slice(-10).reverse().map(f => (
                <div key={f.number} className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg px-3 py-2">
                  <span className="w-8 h-8 rounded-full bg-gray-500 text-white flex items-center justify-center text-sm font-bold">{f.number}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">{f.count}x</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-5 overflow-x-auto">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">All Numbers Frequency</h3>
          <div className="flex gap-1 items-end min-w-[600px]" style={{ height: 150 }}>
            {mmFrequency.sort((a, b) => a.number - b.number).map(f => (
              <div key={f.number} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-gradient-to-t from-blue-700 to-blue-400 rounded-t-sm transition-all hover:from-blue-800 hover:to-blue-500"
                  style={{ height: `${(f.count / maxMmCount) * 120}px`, minHeight: 2 }}
                  title={`#${f.number}: ${f.count} times`}
                />
                <span className="text-[8px] text-gray-400">{f.number}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mega Ball */}
        <div className="mt-4 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-5">
          <h3 className="font-bold text-gray-900 dark:text-white mb-3">Mega Ball (Gold Ball) Frequency</h3>
          <div className="flex flex-wrap gap-2">
            {mmBonusFreq.slice(0, 10).map(f => (
              <div key={f.number} className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg px-3 py-2">
                <span className="w-7 h-7 rounded-full bg-yellow-600 text-white flex items-center justify-center text-xs font-bold">{f.number}</span>
                <span className="text-xs text-gray-600 dark:text-gray-400">{f.count}x</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Lottery Number Frequency Analysis</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Our number frequency analysis shows how often each number has been drawn in recent <strong className="text-gray-900 dark:text-white">Powerball</strong> and
            <strong className="text-gray-900 dark:text-white"> Mega Millions</strong> draws. Hot numbers are those drawn most frequently, while cold numbers appear less often.
            While past frequency does not predict future draws, many players use this data to inform their number selections.
          </p>
        </div>
      </section>
    </div>
  );
}
