import Link from 'next/link';
import { STATES } from '@/lib/data/states';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">LN</span>
              </div>
              <span className="text-lg font-bold text-white">
                Lotto Numbers <span className="text-blue-400">USA</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your trusted source for the latest US lottery results. Updated automatically after every draw.
            </p>
          </div>

          {/* National Games */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">National Games</h3>
            <ul className="space-y-2">
              <li><Link href="/powerball" className="text-sm hover:text-white transition-colors">Powerball Results</Link></li>
              <li><Link href="/mega-millions" className="text-sm hover:text-white transition-colors">Mega Millions Results</Link></li>
              <li><Link href="/jackpot-tracker" className="text-sm hover:text-white transition-colors">Jackpot Tracker</Link></li>
              <li><Link href="/number-frequency" className="text-sm hover:text-white transition-colors">Number Frequency</Link></li>
            </ul>
          </div>

          {/* State Lotteries */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">State Lotteries</h3>
            <ul className="space-y-2">
              {STATES.slice(0, 6).map(state => (
                <li key={state.slug}>
                  <Link href={`/${state.slug}`} className="text-sm hover:text-white transition-colors">
                    {state.name} Lottery
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/states" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                  View All States &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Info & Tools */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Tools & Info</h3>
            <ul className="space-y-2">
              <li><Link href="/check-your-numbers" className="text-sm hover:text-white transition-colors">Check Your Numbers</Link></li>
              <li><Link href="/number-generator" className="text-sm hover:text-white transition-colors">Number Generator</Link></li>
              <li><Link href="/odds-calculator" className="text-sm hover:text-white transition-colors">Odds Calculator</Link></li>
              <li><Link href="/blog" className="text-sm hover:text-white transition-colors">Lottery Blog</Link></li>
              <li><Link href="/about" className="text-sm hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-sm hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        {/* Responsible Gaming */}
        <div className="border-t border-gray-800 mt-10 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} LottoNumbersUSA.com. All rights reserved. Not affiliated with any state or national lottery organization.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Terms of Use</Link>
              <Link href="/disclaimer" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Disclaimer</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
