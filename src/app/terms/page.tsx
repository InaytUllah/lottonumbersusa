import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms of Use for LottoNumbersUSA.com. Please read these terms carefully before using our lottery results website.',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">Terms of Use</span>
      </nav>

      <article className="prose dark:prose-invert max-w-none">
        <h1>Terms of Use</h1>
        <p><strong>Last Updated:</strong> March 2026</p>

        <p>
          Welcome to LottoNumbersUSA.com. By accessing and using this website, you accept and agree to be bound by the following terms and conditions.
        </p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By using this website, you acknowledge that you have read, understood, and agree to these Terms of Use. If you do not agree, please discontinue use of this website immediately.
        </p>

        <h2>2. Description of Service</h2>
        <p>
          LottoNumbersUSA.com provides lottery results, statistics, tools, and related information for US lottery games. Our service includes displaying winning numbers, jackpot information, number generators, odds calculators, and educational content about lottery games.
        </p>

        <h2>3. Informational Purposes Only</h2>
        <p>
          All lottery results, numbers, and information on this website are provided for informational and entertainment purposes only. While we strive for accuracy, we make no guarantees about the completeness or accuracy of the information provided. <strong>Always verify your lottery numbers with your official state lottery.</strong>
        </p>

        <h2>4. Not a Lottery Operator</h2>
        <p>
          LottoNumbersUSA.com is NOT a lottery operator, ticket vendor, or gambling service. We do not sell lottery tickets, accept wagers, or facilitate any form of gambling. We are an independent informational resource not affiliated with any state lottery commission, Powerball, Mega Millions, or any lottery organization.
        </p>

        <h2>5. Age Restriction</h2>
        <p>
          This website is intended for users aged 18 and older. Lottery participation is subject to the laws of your jurisdiction. You are responsible for ensuring that your use of lottery-related information complies with applicable laws.
        </p>

        <h2>6. Intellectual Property</h2>
        <p>
          All content on this website, including text, graphics, logos, icons, images, and software, is the property of LottoNumbersUSA.com or its content suppliers and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our written permission.
        </p>

        <h2>7. User Conduct</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the website for any unlawful purpose</li>
          <li>Attempt to gain unauthorized access to our systems</li>
          <li>Use automated tools to scrape or download content</li>
          <li>Interfere with the proper functioning of the website</li>
          <li>Misrepresent our content as official lottery information</li>
        </ul>

        <h2>8. Disclaimer of Warranties</h2>
        <p>
          This website is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind. We disclaim all warranties, express or implied, including warranties of merchantability, fitness for a particular purpose, and non-infringement.
        </p>

        <h2>9. Limitation of Liability</h2>
        <p>
          LottoNumbersUSA.com shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of this website, including but not limited to reliance on lottery results or information provided.
        </p>

        <h2>10. Third-Party Links</h2>
        <p>
          Our website may contain links to third-party websites. We are not responsible for the content or practices of these external sites. Visiting third-party websites is at your own risk.
        </p>

        <h2>11. Changes to Terms</h2>
        <p>
          We reserve the right to modify these Terms of Use at any time. Changes take effect immediately upon posting. Continued use of the website constitutes acceptance of modified terms.
        </p>

        <h2>12. Responsible Gaming</h2>
        <p>
          We encourage responsible gaming. If you or someone you know has a gambling problem, please contact the National Council on Problem Gambling at 1-800-522-4700 or visit <a href="https://www.ncpgambling.org" target="_blank" rel="noopener noreferrer">ncpgambling.org</a>.
        </p>

        <h2>13. Contact</h2>
        <p>
          For questions about these Terms of Use, please visit our <Link href="/contact">Contact page</Link>.
        </p>
      </article>
    </div>
  );
}
