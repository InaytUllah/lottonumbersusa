import { Metadata } from 'next';
import Link from 'next/link';
import JsonLd, { getBreadcrumbSchema } from '@/components/JsonLd';
import { STATES, getStateBySlug } from '@/lib/data/states';
import { getStateSEO } from '@/lib/data/seo';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return STATES.map(state => ({ state: state.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }): Promise<Metadata> {
  const { state: stateSlug } = await params;
  const state = getStateBySlug(stateSlug);
  if (!state) return {};
  const seo = getStateSEO(state.name);
  return { title: seo.title, description: seo.description, alternates: { canonical: seo.canonical } };
}

export default async function StatePage({ params }: { params: Promise<{ state: string }> }) {
  const { state: stateSlug } = await params;
  const state = getStateBySlug(stateSlug);
  if (!state) notFound();

  const stateGames = state.games.filter(g => g.stateSlug === stateSlug);
  const nationalGames = state.games.filter(g => !g.stateSlug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <JsonLd data={getBreadcrumbSchema([
        { name: 'Home', url: 'https://lottonumbersusa.com' },
        { name: 'States', url: 'https://lottonumbersusa.com/states' },
        { name: `${state.name} Lottery`, url: `https://lottonumbersusa.com/${stateSlug}` },
      ])} />

      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/states" className="hover:text-blue-600 transition-colors">States</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">{state.name}</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {state.name} Lottery Results
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Browse all {state.name} lottery games and check results. Click any game below for the latest winning numbers.
        </p>
      </div>

      {/* National Games */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">National Games</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {nationalGames.map(game => (
            <Link
              key={game.slug}
              href={`/${game.slug}`}
              className="group bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: game.color }}
                >
                  {game.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    {game.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{game.drawDays.join(', ')}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{game.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* State Games */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{state.name} Games</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stateGames.map(game => (
            <Link
              key={game.slug}
              href={`/${stateSlug}/${game.slug}`}
              className="group bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: game.color }}
                >
                  {game.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    {game.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{game.drawDays.join(', ')} &bull; ${game.ticketPrice}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{game.description}</p>
              <div className="mt-3 text-xs text-gray-400">
                Odds: {Object.values(game.odds)[0]}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Info Card */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">About {state.name} Lottery</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500 dark:text-gray-400">Official Website:</span>
            <a href={state.officialSite} target="_blank" rel="noopener noreferrer" className="block text-blue-600 dark:text-blue-400 hover:underline mt-1">
              {state.officialSite.replace('https://', '')}
            </a>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Total Games:</span>
            <p className="font-medium text-gray-900 dark:text-white mt-1">{state.games.length} games available</p>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Region:</span>
            <p className="font-medium text-gray-900 dark:text-white mt-1">{state.region}</p>
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="mt-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{state.name} Lottery Winning Numbers</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Check the latest {state.name} lottery results right here at <strong className="text-gray-900 dark:text-white">LottoNumbersUSA.com</strong>. The <strong className="text-gray-900 dark:text-white">{state.name} Lottery</strong>
            {' '}offers {stateGames.length} state-specific {stateGames.length === 1 ? 'game' : 'games'}
            {stateGames.length > 0 && <> including {stateGames.map(g => g.name).join(', ')}</>}, in addition to
            national multi-state games like <strong className="text-gray-900 dark:text-white">Powerball</strong> and <strong className="text-gray-900 dark:text-white">Mega Millions</strong>. All {state.name} lottery results are updated
            automatically after each official draw.
          </p>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Playing the Lottery in {state.name}</h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            {state.name} lottery players have access to a total of <strong className="text-gray-900 dark:text-white">{state.games.length} games</strong>, ranging from daily
            draw games to multi-state jackpot games. Whether you prefer the excitement of <strong className="text-gray-900 dark:text-white">Powerball</strong> and <strong className="text-gray-900 dark:text-white">Mega Millions</strong>
            {' '}or the better odds offered by {state.name}&apos;s own state games, you can find all the latest winning
            numbers and results on this page. Tickets can be purchased at authorized retailers throughout {state.name}.
          </p>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">About the {state.name} Lottery</h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            The <strong className="text-gray-900 dark:text-white">{state.name} Lottery</strong> is operated by the state and generates revenue that supports public programs
            and services. Like all US state lotteries, the {state.name} Lottery is regulated to ensure fair play and
            transparent results. Players must be at least 18 years old to purchase lottery tickets in {state.name}.
            For official rules, prize claim deadlines, and retailer locations, visit the {state.name} Lottery&apos;s
            official website at {state.officialSite.replace('https://', '')}.
          </p>
        </div>
      </section>
    </div>
  );
}
