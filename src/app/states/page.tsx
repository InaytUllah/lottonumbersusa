import { Metadata } from 'next';
import Link from 'next/link';
import AdSlot from '@/components/AdSlot';
import { STATES } from '@/lib/data/states';

export const metadata: Metadata = {
  title: 'All US State Lottery Results',
  description: 'Browse lottery results for all US states. Find Powerball, Mega Millions, and state-specific lottery games for California, Texas, Florida, New York, and more.',
};

export default function StatesPage() {
  const regions = ['West', 'South', 'Northeast', 'Midwest'];
  const statesByRegion = regions.map(region => ({
    region,
    states: STATES.filter(s => s.region === region),
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">All States</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
        US State Lottery Results
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
        Select your state to check the latest lottery winning numbers
      </p>

      <AdSlot slot="states-top" format="horizontal" className="mb-8" />

      {statesByRegion.map(({ region, states }) => (
        <section key={region} className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{region}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {states.map(state => (
              <Link
                key={state.slug}
                href={`/${state.slug}`}
                className="group bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {state.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {state.games.length} games &bull; {state.abbreviation}
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
