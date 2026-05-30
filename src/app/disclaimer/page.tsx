import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: 'Important disclaimer for LottoNumbersUSA.com. Lottery results are for informational purposes only.',
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">Disclaimer</span>
      </nav>

      <article className="prose dark:prose-invert max-w-none">
        <h1>Disclaimer</h1>
        <p><strong>Last Updated:</strong> March 2026</p>

        <h2>General Disclaimer</h2>
        <p>
          The information provided on LottoNumbersUSA.com is for general informational and entertainment purposes only. All lottery results, winning numbers, jackpot amounts, and related data are obtained from publicly available sources and third-party APIs.
        </p>

        <h2>Accuracy of Results</h2>
        <p>
          We make every effort to ensure accuracy and timeliness of lottery results by sourcing directly from official state lottery data feeds. Results are typically updated within minutes of each draw.
        </p>
        <p>
          <strong>Always verify your lottery numbers with your official state lottery commission before claiming any prize.</strong> Official results can be found on your state lottery&apos;s website.
        </p>

        <h2>Not a Lottery Service</h2>
        <p>
          LottoNumbersUSA.com is an independent informational website. We are:
        </p>
        <ul>
          <li><strong>NOT</strong> a lottery operator or ticket seller</li>
          <li><strong>NOT</strong> affiliated with Powerball, Mega Millions, or any state lottery commission</li>
          <li><strong>NOT</strong> a gambling service of any kind</li>
          <li><strong>NOT</strong> providing financial, legal, or investment advice</li>
        </ul>

        <h2>Number Generator Disclaimer</h2>
        <p>
          Our lottery number generator produces random numbers using mathematical algorithms. Generated numbers are for entertainment purposes only and do not increase your chances of winning. Every combination in a lottery draw has an equal probability of being selected.
        </p>

        <h2>Statistical Analysis Disclaimer</h2>
        <p>
          Number frequency analysis, hot and cold numbers, and prediction tools on this website are based on historical data. Past lottery results do not predict or influence future draws. Each lottery drawing is an independent random event.
        </p>

        <h2>Responsible Gaming</h2>
        <p>
          Lottery games should be played for entertainment only. Never spend more than you can afford to lose. If you or someone you know has a gambling problem:
        </p>
        <ul>
          <li>National Council on Problem Gambling: <strong>1-800-522-4700</strong></li>
          <li>Website: <a href="https://www.ncpgambling.org" target="_blank" rel="noopener noreferrer">ncpgambling.org</a></li>
          <li>Text: Send &quot;HELP&quot; to 233-500</li>
        </ul>

        <h2>External Links</h2>
        <p>
          This website may contain links to external websites. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party websites.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          Under no circumstances shall LottoNumbersUSA.com be liable for any loss or damage arising from the use of information on this website. This includes, but is not limited to, any financial loss resulting from reliance on lottery results or statistical data provided on this site.
        </p>

        <h2>Contact</h2>
        <p>
          If you have concerns about the information on this website, please visit our <Link href="/contact">Contact page</Link>.
        </p>
      </article>
    </div>
  );
}
