'use client';

import Link from 'next/link';
import { useState } from 'react';
import { STATES } from '@/lib/data/states';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [statesDropdownOpen, setStatesDropdownOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LN</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">
              Lotto Numbers <span className="text-blue-600">USA</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/powerball"
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Powerball
            </Link>
            <Link
              href="/mega-millions"
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Mega Millions
            </Link>

            {/* States Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setStatesDropdownOpen(true)}
              onMouseLeave={() => setStatesDropdownOpen(false)}
            >
              <button className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-1">
                States
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {statesDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                  {STATES.map(state => (
                    <Link
                      key={state.slug}
                      href={`/${state.slug}`}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      {state.name}
                    </Link>
                  ))}
                  <div className="border-t border-gray-100 dark:border-gray-700 mt-1 pt-1">
                    <Link
                      href="/states"
                      className="block px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      View All States
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/number-generator"
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Generator
            </Link>
            <Link
              href="/jackpot-tracker"
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Jackpots
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 dark:border-gray-800 mt-2 pt-2">
            <Link href="/powerball" className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setMobileMenuOpen(false)}>
              Powerball
            </Link>
            <Link href="/mega-millions" className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setMobileMenuOpen(false)}>
              Mega Millions
            </Link>
            <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">States</div>
            {STATES.map(state => (
              <Link
                key={state.slug}
                href={`/${state.slug}`}
                className="block px-6 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                {state.name}
              </Link>
            ))}
            <div className="border-t border-gray-100 dark:border-gray-800 mt-2 pt-2">
              <Link href="/number-generator" className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setMobileMenuOpen(false)}>
                Number Generator
              </Link>
              <Link href="/jackpot-tracker" className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setMobileMenuOpen(false)}>
                Jackpot Tracker
              </Link>
              <Link href="/odds-calculator" className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setMobileMenuOpen(false)}>
                Odds Calculator
              </Link>
              <Link href="/number-frequency" className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setMobileMenuOpen(false)}>
                Number Frequency
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
