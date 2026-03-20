import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist. Check our latest Powerball, Mega Millions, and state lottery results.',
};

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      {/* Fun lottery ball 404 */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg">4</div>
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg">0</div>
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg">4</div>
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
        Page Not Found
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        The page you are looking for might have been moved or does not exist. Check out our latest lottery results instead.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
        <Link
          href="/"
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
        >
          Go to Homepage
        </Link>
        <Link
          href="/powerball"
          className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
        >
          Powerball Results
        </Link>
        <Link
          href="/mega-millions"
          className="px-6 py-3 bg-blue-800 text-white font-semibold rounded-xl hover:bg-blue-900 transition-colors"
        >
          Mega Millions Results
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
        <h2 className="font-bold text-gray-900 dark:text-white mb-3">Popular Pages</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { name: 'Powerball', href: '/powerball' },
            { name: 'Mega Millions', href: '/mega-millions' },
            { name: 'Number Generator', href: '/number-generator' },
            { name: 'Jackpot Tracker', href: '/jackpot-tracker' },
            { name: 'All States', href: '/states' },
            { name: 'Number Frequency', href: '/number-frequency' },
          ].map(link => (
            <Link key={link.href} href={link.href} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
