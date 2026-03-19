import { Metadata } from 'next';
import Link from 'next/link';
import JsonLd, { getBreadcrumbSchema } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'About Us - Lotto Numbers USA',
  description: 'Learn about LottoNumbersUSA.com, your trusted source for the latest US lottery results. Free lottery results, tools, and analysis for Powerball, Mega Millions, and state lotteries.',
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
          LottoNumbersUSA.com is a free, independent lottery results website dedicated to providing the most accurate and up-to-date US lottery winning numbers. We cover Powerball, Mega Millions, and lottery games from all major US states.
        </p>

        <h2>Our Mission</h2>
        <p>
          Our mission is simple: make it easy for anyone to check their lottery numbers quickly and reliably. We believe lottery results should be free, fast, and accessible to everyone without requiring registration or downloads.
        </p>

        <h2>What We Offer</h2>
        <ul>
          <li><strong>Instant Results:</strong> Lottery winning numbers are updated automatically within minutes of each official draw</li>
          <li><strong>Complete Coverage:</strong> Powerball, Mega Millions, and 40+ state-specific lottery games across 10 major US states</li>
          <li><strong>Free Tools:</strong> Number generator, odds calculator, frequency analysis, and jackpot tracker</li>
          <li><strong>Historical Data:</strong> Full results archive so you can look up past drawings</li>
          <li><strong>Mobile Friendly:</strong> Optimized for checking results on your phone</li>
        </ul>

        <h2>How Our Data Works</h2>
        <p>
          We source our lottery results from official public data APIs provided by state lottery commissions. Our automated systems check for new results multiple times per hour to ensure you always see the latest winning numbers. All results are unofficial — always verify with your state lottery before claiming prizes.
        </p>

        <h2>States We Cover</h2>
        <p>
          We currently provide results for lottery games in California, Texas, Florida, New York, Pennsylvania, Ohio, Georgia, Michigan, North Carolina, and New Jersey. We are continuously expanding our coverage to include more states.
        </p>

        <h2>Responsible Gaming</h2>
        <p>
          We take responsible gaming seriously. Lottery games are a form of entertainment, not an investment strategy. Please play within your means. If you or someone you know has a gambling problem, call 1-800-522-4700 for confidential help.
        </p>

        <h2>Contact Us</h2>
        <p>
          Have a question, suggestion, or found an error? Visit our <Link href="/contact">Contact page</Link> to get in touch. We value feedback from our users and are always working to improve our service.
        </p>
      </article>
    </div>
  );
}
