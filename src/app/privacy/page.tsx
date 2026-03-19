import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for LottoNumbersUSA.com. Learn how we collect, use, and protect your information.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">Privacy Policy</span>
      </nav>

      <article className="prose dark:prose-invert max-w-none">
        <h1>Privacy Policy</h1>
        <p><strong>Last Updated:</strong> March 2026</p>

        <p>
          LottoNumbersUSA.com (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website.
        </p>

        <h2>Information We Collect</h2>
        <p>
          We do not require registration or collect personal information to use our lottery results service. However, we may automatically collect certain non-personal information including:
        </p>
        <ul>
          <li>Browser type and version</li>
          <li>Operating system</li>
          <li>Pages visited and time spent on pages</li>
          <li>Referring website addresses</li>
          <li>IP address (anonymized)</li>
          <li>Device type (desktop, mobile, tablet)</li>
        </ul>

        <h2>How We Use Your Information</h2>
        <p>We use non-personal information to:</p>
        <ul>
          <li>Improve our website content and user experience</li>
          <li>Analyze website traffic and usage patterns</li>
          <li>Ensure the technical functionality of our website</li>
          <li>Serve relevant advertisements</li>
        </ul>

        <h2>Cookies and Tracking Technologies</h2>
        <p>
          We use cookies and similar tracking technologies to enhance your browsing experience. These include:
        </p>
        <ul>
          <li><strong>Essential cookies:</strong> Required for the website to function properly</li>
          <li><strong>Analytics cookies:</strong> Help us understand how visitors interact with our website (Google Analytics)</li>
          <li><strong>Advertising cookies:</strong> Used to deliver relevant advertisements (Google AdSense)</li>
        </ul>
        <p>
          You can control cookies through your browser settings. Disabling cookies may affect some website functionality.
        </p>

        <h2>Third-Party Services</h2>
        <p>We use the following third-party services:</p>
        <ul>
          <li><strong>Google Analytics:</strong> For website traffic analysis. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a></li>
          <li><strong>Google AdSense:</strong> For displaying advertisements. Google may use cookies to serve ads based on your browsing history.</li>
          <li><strong>Vercel:</strong> For website hosting and content delivery.</li>
        </ul>

        <h2>Google AdSense and Advertising</h2>
        <p>
          We use Google AdSense to display advertisements on our website. Google AdSense uses cookies to serve ads based on your prior visits to our website and other websites. You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.
        </p>

        <h2>Children&apos;s Privacy</h2>
        <p>
          Our website is not directed to children under 18. We do not knowingly collect personal information from children. Lottery participation is restricted to adults of legal age in their jurisdiction.
        </p>

        <h2>Data Security</h2>
        <p>
          We implement appropriate security measures to protect against unauthorized access, alteration, disclosure, or destruction of information. However, no internet transmission is completely secure.
        </p>

        <h2>Your Rights</h2>
        <p>Depending on your jurisdiction, you may have the right to:</p>
        <ul>
          <li>Access the personal information we hold about you</li>
          <li>Request correction or deletion of your information</li>
          <li>Opt out of certain data processing activities</li>
          <li>Withdraw consent for data processing</li>
        </ul>

        <h2>Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy, please visit our <Link href="/contact">Contact page</Link>.
        </p>
      </article>
    </div>
  );
}
