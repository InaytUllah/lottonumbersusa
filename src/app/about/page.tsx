import { Metadata } from 'next';
import Link from 'next/link';
import JsonLd, { getBreadcrumbSchema } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'About Us - Lotto Numbers USA',
  description: 'LottoNumbersUSA.com pulls lottery results from official state data feeds. Powerball, Mega Millions, and 40+ state games. Free, no registration.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <JsonLd data={getBreadcrumbSchema([
        { name: 'Home', url: 'https://lottonumbersusa.com' },
        { name: 'About Us', url: 'https://lottonumbersusa.com/about' },
      ])} />

      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">About Us</span>
      </nav>

      <article className="prose dark:prose-invert max-w-none">
        <h1>About Lotto Numbers USA</h1>

        <p>
          We built this site because checking lottery numbers shouldn&apos;t require clicking through five different state websites. LottoNumbersUSA.com pulls results from official state lottery data feeds and puts them in one place. Powerball, Mega Millions, and 40+ state games across 10 states. No registration, no app download, no paywall.
        </p>

        <h2>What you get</h2>
        <ul>
          <li>Results updated within minutes of each draw, automatically</li>
          <li>Powerball, Mega Millions, and state games from California, Texas, Florida, New York, Pennsylvania, Ohio, Georgia, Michigan, North Carolina, and New Jersey</li>
          <li>Number generator, odds calculator, frequency charts, and a jackpot tracker</li>
          <li>Past results archive going back hundreds of draws</li>
          <li>Works on your phone without squinting</li>
        </ul>

        <h2>Where the data comes from</h2>
        <p>
          Results come from official public data APIs run by state lottery commissions (like New York&apos;s Open Data portal). Our system checks for new draws multiple times per hour. When a new draw posts, the site updates within minutes. We recommend double-checking with your state lottery before claiming anything large.
        </p>

        <h2>States we cover</h2>
        <p>
          Right now: California, Texas, Florida, New York, Pennsylvania, Ohio, Georgia, Michigan, North Carolina, and New Jersey. More states are being added over time.
        </p>

        <h2>A note on playing</h2>
        <p>
          Lottery tickets are entertainment, not a retirement plan. The odds are not in your favor. Play what you can afford to lose and leave it at that.
        </p>

        <h2>Get in touch</h2>
        <p>
          Found a wrong number? Have a suggestion? Visit the <Link href="/contact">contact page</Link>. We read everything.
        </p>
      </article>
    </div>
  );
}
