import { Metadata } from 'next';
import Link from 'next/link';
import JsonLd, { getBreadcrumbSchema } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Contact Us - Lotto Numbers USA',
  description: 'Contact LottoNumbersUSA.com for questions, feedback, or corrections about US lottery results. We are happy to help.',
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <JsonLd data={getBreadcrumbSchema([
        { name: 'Home', url: 'https://lottonumbersusa.com' },
        { name: 'Contact Us', url: 'https://lottonumbersusa.com/contact' },
      ])} />

      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">Contact Us</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
        Contact Us
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
        Have a question or feedback? We would love to hear from you.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Get in Touch</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">General Inquiries</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                For questions about our website, lottery results, or tools.
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">contact@lottonumbersusa.com</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Report an Error</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Found incorrect results or information? Please let us know so we can fix it promptly.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Advertising</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                For advertising opportunities and partnerships.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Links</h2>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                  About Lotto Numbers USA
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800 p-6">
            <h2 className="text-lg font-bold text-yellow-800 dark:text-yellow-200 mb-2">Important Note</h2>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              LottoNumbersUSA.com is an independent informational website. We are not affiliated with any state lottery commission, Powerball, or Mega Millions. We do not sell lottery tickets. Always verify your results with your official state lottery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
