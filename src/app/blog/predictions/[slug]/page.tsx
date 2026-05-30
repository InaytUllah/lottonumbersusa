import { Metadata } from 'next';
import Link from 'next/link';
import LotteryBalls from '@/components/LotteryBalls';
import JsonLd, { getBreadcrumbSchema, getFAQSchema } from '@/components/JsonLd';
import { formatDate } from '@/lib/api/lottery-api';
import {
  isPredictionGameSlug,
  getGameConfigBySlug,
  generatePredictions,
  generatePredictionBlogPosts,
  getPredictionPostBySlug,
  getHotColdNumbers,
  getOverdueNumbers,
  getNextDrawDate,
} from '@/lib/predictions';
import { notFound } from 'next/navigation';


export async function generateStaticParams() {
  // Game slugs for landing pages
  const gameSlugs = [
    'powerball', 'mega-millions', 'superlotto-plus', 'lotto-texas',
    'florida-lotto', 'new-york-lotto', 'classic-lotto', 'lotto-47',
    'fantasy-5', 'cash-five', 'cash-5', 'jersey-cash-5',
    'texas-two-step', 'rolling-cash-5', 'match-6', 'treasure-hunt',
  ].filter(isPredictionGameSlug).map(s => ({ slug: s }));

  // Prediction blog post slugs
  const posts = generatePredictionBlogPosts();
  const postSlugs = posts.map(p => ({ slug: p.slug }));

  return [...gameSlugs, ...postSlugs];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  if (isPredictionGameSlug(slug)) {
    const game = getGameConfigBySlug(slug);
    if (!game) return {};
    const gameName = game.state ? `${game.state} ${game.name}` : game.name;
    return {
      title: `${gameName} Predictions Today - Hot Numbers & Analysis`,
      description: `Free ${gameName} predictions for the next draw. Hot numbers, cold numbers, overdue numbers, and 3 expert prediction sets based on statistical analysis.`,
      alternates: { canonical: `/blog/predictions/${slug}` },
    };
  }

  const post = getPredictionPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/predictions/${slug}` },
  };
}

// ============================================
// GAME-SPECIFIC PREDICTION LANDING PAGE
// ============================================

function GamePredictionPage({ slug }: { slug: string }) {
  const game = getGameConfigBySlug(slug)!;
  const gameName = game.state ? `${game.state} ${game.name}` : game.name;
  const nextDraw = getNextDrawDate(game.drawDays);
  const nextDrawFormatted = formatDate(nextDraw);
  const predictions = generatePredictions(game, nextDraw);
  const { hot, cold } = getHotColdNumbers(game, nextDraw);
  const overdue = getOverdueNumbers(game, nextDraw);

  const faqs = [
    {
      question: `What are the ${gameName} predictions for today?`,
      answer: `Our ${gameName} predictions for today include 3 sets: Hot Numbers Pick (${predictions[0].numbers.join(', ')}), Balanced Selection (${predictions[1].numbers.join(', ')}), and Quick Pick Plus (${predictions[2].numbers.join(', ')}). These are based on statistical analysis of recent draws.`,
    },
    {
      question: `How are ${gameName} predictions calculated?`,
      answer: `Our predictions use statistical analysis of the last 100 draws, including hot numbers (most frequently drawn), cold numbers (least drawn), and overdue numbers (longest since last appearance) to generate optimized number combinations.`,
    },
    {
      question: `Can predictions guarantee a ${gameName} win?`,
      answer: `No prediction system can guarantee a lottery win. Every number combination has exactly the same probability of being drawn. Our predictions are for entertainment and informational purposes. The odds of winning the ${gameName} jackpot are ${Object.values(game.odds)[0]}.`,
    },
    {
      question: `When is the next ${gameName} draw?`,
      answer: `${gameName} draws take place ${game.drawDays.join(', ')} at ${game.drawTime}. Check back after each draw for updated predictions.`,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <JsonLd data={getBreadcrumbSchema([
        { name: 'Home', url: 'https://lottonumbersusa.com' },
        { name: 'Predictions', url: 'https://lottonumbersusa.com/blog/predictions' },
        { name: `${gameName} Predictions`, url: `https://lottonumbersusa.com/blog/predictions/${slug}` },
      ])} />
      <JsonLd data={getFAQSchema(faqs)} />

      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/blog/predictions" className="hover:text-blue-600 transition-colors">Predictions</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">{gameName}</span>
      </nav>

      {/* Hero */}
      <div className="rounded-2xl p-6 sm:p-10 mb-8 text-white" style={{ background: `linear-gradient(135deg, ${game.color}, ${game.color}dd)` }}>
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">{gameName} Predictions Today</h1>
        <p className="text-white/80 text-lg">Predictions for the <strong className="text-white">{nextDrawFormatted}</strong> draw</p>
        <div className="flex flex-wrap items-center gap-3 mt-3">
          <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur rounded-full px-3 py-1 text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/></svg>
            {nextDrawFormatted}
          </span>
          <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur rounded-full px-3 py-1 text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/></svg>
            {game.drawTime}
          </span>
        </div>
      </div>

      {/* 3 Prediction Sets */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Prediction Sets</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">For the {nextDrawFormatted} draw</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {predictions.map((pred, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-1.5" style={{ backgroundColor: game.color }}>
                <p className="text-xs font-bold text-white text-center">{pred.name}</p>
              </div>
              <div className="p-5">
                <LotteryBalls
                  numbers={pred.numbers}
                  bonusBall={pred.bonusBall}
                  bonusBallName={game.bonusBallName}
                  size="md"
                  gameColor={game.color}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">{pred.method}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Hot Numbers */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Hot Numbers (Most Drawn)</h3>
            <div className="flex flex-wrap gap-2">
              {hot.slice(0, 8).map(n => (
                <div key={n.number} className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
                  <span className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold">{n.number}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">{n.count}x ({n.percentage}%)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cold Numbers */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Cold Numbers (Least Drawn)</h3>
            <div className="flex flex-wrap gap-2">
              {cold.slice(0, 8).map(n => (
                <div key={n.number} className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg px-3 py-2">
                  <span className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">{n.number}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">{n.count}x ({n.percentage}%)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Overdue Numbers */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Overdue Numbers</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Numbers with the longest gap since last appearance</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {overdue.slice(0, 8).map(n => (
                <div key={n.number} className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-3 py-2">
                  <span className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white text-xs font-bold">{n.number}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">{n.drawsSince} draws ago</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3">Quick Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Numbers Range</span>
                <span className="font-medium text-gray-900 dark:text-white">{game.mainRange[0]}-{game.mainRange[1]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Numbers Picked</span>
                <span className="font-medium text-gray-900 dark:text-white">{game.mainNumbers}</span>
              </div>
              {game.bonusBall && (
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">{game.bonusBallName} Range</span>
                  <span className="font-medium text-gray-900 dark:text-white">{game.bonusRange?.[0]}-{game.bonusRange?.[1]}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Jackpot Odds</span>
                <span className="font-mono text-xs text-gray-900 dark:text-white">{Object.values(game.odds)[0]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Ticket Price</span>
                <span className="font-medium text-gray-900 dark:text-white">${game.ticketPrice}</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href={`/${game.slug}`} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">{gameName} Results</Link></li>
              <li><Link href="/number-generator" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Number Generator</Link></li>
              <li><Link href="/number-frequency" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Number Frequency</Link></li>
              <li><Link href="/check-your-numbers" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Check Your Numbers</Link></li>
              <li><Link href="/blog/predictions" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">All Predictions</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* SEO Content */}
      <section className="mt-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{gameName} Predictions &amp; Analysis</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Our <strong className="text-gray-900 dark:text-white">{gameName} predictions</strong> are updated before every draw. We analyze the last 100 draws to identify <strong className="text-gray-900 dark:text-white">hot numbers</strong> that appear frequently, <strong className="text-gray-900 dark:text-white">cold numbers</strong> that are drawn less often, and <strong className="text-gray-900 dark:text-white">overdue numbers</strong> that haven&#39;t appeared in many draws. While no prediction can guarantee a win, understanding number patterns can add a strategic element to your lottery play.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{gameName} Draw Schedule</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              <strong className="text-gray-900 dark:text-white">{gameName}</strong> draws take place <strong className="text-gray-900 dark:text-white">{game.drawDays.join(', ')}</strong> at <strong className="text-gray-900 dark:text-white">{game.drawTime}</strong>. Players pick {game.mainNumbers} numbers from {game.mainRange[0]} to {game.mainRange[1]}{game.bonusBall ? ` plus one ${game.bonusBallName} from ${game.bonusRange?.[0]} to ${game.bonusRange?.[1]}` : ''}. Tickets cost ${game.ticketPrice} per play.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{gameName} Predictions FAQ</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details key={index} className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              <summary className="flex items-center justify-between cursor-pointer p-5 font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                {faq.question}
                <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="px-5 pb-5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

// ============================================
// DATE-SPECIFIC PREDICTION BLOG POST
// ============================================

function PredictionBlogPostPage({ slug }: { slug: string }) {
  const post = getPredictionPostBySlug(slug)!;
  const game = getGameConfigBySlug(post.gameSlug);
  const { hot, cold } = getHotColdNumbers(game!, post.drawDate);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Organization', name: 'Lotto Numbers USA' },
    publisher: {
      '@type': 'Organization',
      name: 'Lotto Numbers USA',
      url: 'https://lottonumbersusa.com',
    },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <JsonLd data={getBreadcrumbSchema([
        { name: 'Home', url: 'https://lottonumbersusa.com' },
        { name: 'Predictions', url: 'https://lottonumbersusa.com/blog/predictions' },
        { name: post.title, url: `https://lottonumbersusa.com/blog/predictions/${slug}` },
      ])} />
      <JsonLd data={articleSchema} />

      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/blog/predictions" className="hover:text-blue-600 transition-colors">Predictions</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">{post.game}</span>
      </nav>

      <article>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: post.gameColor }}>
            {post.game}
          </span>
          <time className="text-sm text-gray-500 dark:text-gray-400">Draw: {formatDate(post.drawDate)}</time>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">{post.title}</h1>

        {/* Prediction Sets */}
        <div className="space-y-4 mb-8">
          {post.predictions.map((pred, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-2.5" style={{ backgroundColor: post.gameColor }}>
                <span className="text-sm font-bold text-white">Set {i + 1}: {pred.name}</span>
              </div>
              <div className="p-5">
                <LotteryBalls
                  numbers={pred.numbers}
                  bonusBall={pred.bonusBall}
                  bonusBallName={game?.bonusBallName}
                  size="lg"
                  gameColor={post.gameColor}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">{pred.method}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Hot & Cold Numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-5">
            <h3 className="font-bold text-red-800 dark:text-red-400 mb-3">Hot Numbers</h3>
            <div className="flex flex-wrap gap-2">
              {hot.slice(0, 6).map(n => (
                <span key={n.number} className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white text-sm font-bold">{n.number}</span>
              ))}
            </div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5">
            <h3 className="font-bold text-blue-800 dark:text-blue-400 mb-3">Cold Numbers</h3>
            <div className="flex flex-wrap gap-2">
              {cold.slice(0, 6).map(n => (
                <span key={n.number} className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">{n.number}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Methodology */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8 mb-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How We Generate {post.game} Predictions</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Our <strong className="text-gray-900 dark:text-white">{post.game} predictions</strong> for {formatDate(post.drawDate)} are generated using statistical analysis of historical draw data. We create <strong className="text-gray-900 dark:text-white">3 unique prediction sets</strong> using different methodologies to give you diverse number combinations.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-3">
                The <strong className="text-gray-900 dark:text-white">{post.game}</strong> draw takes place at <strong className="text-gray-900 dark:text-white">{post.drawTime}</strong>. Remember that every number combination has an equal chance of being drawn. These predictions are for informational and entertainment purposes.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link href="/blog/predictions" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            &larr; All predictions
          </Link>
          {game && (
            <Link href={`/blog/predictions/${post.gameSlug}`} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              {post.game} predictions page &rarr;
            </Link>
          )}
        </div>
      </article>
    </div>
  );
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default async function PredictionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (isPredictionGameSlug(slug)) {
    const game = getGameConfigBySlug(slug);
    if (!game) notFound();
    return <GamePredictionPage slug={slug} />;
  }

  const post = getPredictionPostBySlug(slug);
  if (!post) notFound();
  return <PredictionBlogPostPage slug={slug} />;
}
