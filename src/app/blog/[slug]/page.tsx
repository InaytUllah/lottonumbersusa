import { Metadata } from 'next';
import Link from 'next/link';
import LotteryBalls from '@/components/LotteryBalls';
import JsonLd, { getBreadcrumbSchema } from '@/components/JsonLd';
import { fetchPastResults, formatDate } from '@/lib/api/lottery-api';
import { POWERBALL, MEGA_MILLIONS } from '@/lib/data/games';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

interface BlogPostData {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  game: string;
  gameSlug: string;
  numbers: number[];
  bonusBall?: number;
  multiplier?: number;
  jackpot?: string;
}

async function getPostBySlug(slug: string): Promise<BlogPostData | null> {
  const [pbResults, mmResults] = await Promise.all([
    fetchPastResults('powerball', 20),
    fetchPastResults('mega-millions', 20),
  ]);

  const allPosts: BlogPostData[] = [
    ...pbResults.map(r => ({
      title: `Powerball Results for ${formatDate(r.drawDate)}: Winning Numbers ${r.numbers.join(', ')}`,
      slug: `powerball-results-${r.drawDate}`,
      date: r.drawDate,
      excerpt: `The Powerball winning numbers for ${formatDate(r.drawDate)} are ${r.numbers.join(', ')} with Powerball ${r.bonusBall}.`,
      game: 'Powerball',
      gameSlug: 'powerball',
      numbers: r.numbers,
      bonusBall: r.bonusBall,
      multiplier: r.multiplier,
      jackpot: r.jackpot,
    })),
    ...mmResults.map(r => ({
      title: `Mega Millions Results for ${formatDate(r.drawDate)}: Numbers ${r.numbers.join(', ')}`,
      slug: `mega-millions-results-${r.drawDate}`,
      date: r.drawDate,
      excerpt: `The Mega Millions winning numbers for ${formatDate(r.drawDate)} are ${r.numbers.join(', ')} with Mega Ball ${r.bonusBall}.`,
      game: 'Mega Millions',
      gameSlug: 'mega-millions',
      numbers: r.numbers,
      bonusBall: r.bonusBall,
      multiplier: r.multiplier,
      jackpot: r.jackpot,
    })),
  ];

  return allPosts.find(p => p.slug === slug) || null;
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const gameConfig = post.game === 'Powerball' ? POWERBALL : MEGA_MILLIONS;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <JsonLd data={getBreadcrumbSchema([
        { name: 'Home', url: 'https://lottonumbersusa.com' },
        { name: 'Blog', url: 'https://lottonumbersusa.com/blog' },
        { name: post.title, url: `https://lottonumbersusa.com/blog/${post.slug}` },
      ])} />

      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-blue-600 transition-colors">Blog</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">{post.game} Results</span>
      </nav>

      <article>
        <div className="flex items-center gap-2 mb-4">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            post.game === 'Powerball'
              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
          }`}>
            {post.game}
          </span>
          <time className="text-sm text-gray-500 dark:text-gray-400">{formatDate(post.date)}</time>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">{post.title}</h1>

        {/* Winning Numbers Display */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 sm:p-8 mb-8">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Winning Numbers</p>
          <LotteryBalls
            numbers={post.numbers}
            bonusBall={post.bonusBall}
            bonusBallName={gameConfig.bonusBallName}
            multiplier={post.multiplier}
            multiplierName={gameConfig.multiplierName}
            size="lg"
            gameColor={gameConfig.color}
          />
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">White Balls</p>
              <p className="font-bold text-gray-900 dark:text-white">{post.numbers.join(', ')}</p>
            </div>
            {post.bonusBall && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">{gameConfig.bonusBallName}</p>
                <p className="font-bold" style={{ color: gameConfig.color }}>{post.bonusBall}</p>
              </div>
            )}
            {post.multiplier && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">{gameConfig.multiplierName}</p>
                <p className="font-bold text-yellow-600">{post.multiplier}x</p>
              </div>
            )}
          </div>
        </div>

        {/* Article Content */}
        <div className="prose dark:prose-invert max-w-none">
          <p>
            The {post.game} drawing held on {formatDate(post.date)} produced the winning numbers{' '}
            <strong>{post.numbers.join(', ')}</strong> with {gameConfig.bonusBallName}{' '}
            <strong>{post.bonusBall}</strong>.
            {post.multiplier ? ` The ${gameConfig.multiplierName} was ${post.multiplier}x.` : ''}
          </p>
          <p>
            {post.game} drawings take place {gameConfig.drawDays.join(', ')} at {gameConfig.drawTime}.
            Players pick {gameConfig.mainNumbers} numbers from {gameConfig.mainRange[0]} to {gameConfig.mainRange[1]},
            plus one {gameConfig.bonusBallName} from {gameConfig.bonusRange?.[0]} to {gameConfig.bonusRange?.[1]}.
            Check your tickets against these numbers to see if you have won a prize.
          </p>
          <h2>How to Check Your {post.game} Ticket</h2>
          <p>
            Compare the numbers on your ticket with the winning numbers above. You need to match all{' '}
            {gameConfig.mainNumbers} white balls plus the {gameConfig.bonusBallName} to win the jackpot.
            However, there are {Object.keys(gameConfig.odds).length} prize tiers in total, so you may have won
            a smaller prize even if you did not match all numbers.
          </p>
          <p>
            View the <Link href={`/${post.gameSlug}`}>full {post.game} results history</Link>, check
            our <Link href="/number-frequency">number frequency analysis</Link>, or generate your next set of
            numbers with our <Link href="/number-generator">free number generator</Link>.
          </p>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <Link href="/blog" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            &larr; Back to all posts
          </Link>
          <Link href={`/${post.gameSlug}/results/${post.date}`} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            View full results page &rarr;
          </Link>
        </div>
      </article>
    </div>
  );
}
