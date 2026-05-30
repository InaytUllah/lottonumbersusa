'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { STATES } from '@/lib/data/states';

const NAV_LINK = 'px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors';
const NAV_TRIGGER = `${NAV_LINK} flex items-center gap-1`;
const CHEVRON = (
  <svg className="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

function MegaMenuItem({ icon, title, desc, href }: { icon: string; title: string; desc: string; href: string }) {
  return (
    <Link href={href} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group">
      <span className="text-lg mt-0.5">{icon}</span>
      <div>
        <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{title}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{desc}</p>
      </div>
    </Link>
  );
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const menuTimeout = useRef<ReturnType<typeof setTimeout>>(null);

  const openMenu = (menu: string) => {
    if (menuTimeout.current) clearTimeout(menuTimeout.current);
    setActiveMenu(menu);
  };

  const closeMenu = () => {
    menuTimeout.current = setTimeout(() => setActiveMenu(null), 150);
  };

  useEffect(() => {
    return () => { if (menuTimeout.current) clearTimeout(menuTimeout.current); };
  }, []);

  const closeMobile = () => setMobileMenuOpen(false);

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
          <nav className="hidden lg:flex items-center gap-0.5">
            {/* Results Mega Menu */}
            <div
              className="relative"
              onMouseEnter={() => openMenu('results')}
              onMouseLeave={closeMenu}
            >
              <button className={NAV_TRIGGER}>
                Results {CHEVRON}
              </button>
              {activeMenu === 'results' && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[580px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-5 z-50">
                  <div className="grid grid-cols-2 gap-6">
                    {/* National Games */}
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-3">National Games</p>
                      <MegaMenuItem icon="🔴" title="Powerball Results" desc="Mon, Wed, Sat at 10:59 PM ET" href="/powerball" />
                      <MegaMenuItem icon="🔵" title="Mega Millions Results" desc="Tue, Fri at 11:00 PM ET" href="/mega-millions" />
                      <MegaMenuItem icon="💰" title="Jackpot Tracker" desc="All current jackpot amounts" href="/jackpot-tracker" />
                    </div>
                    {/* State Lotteries */}
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-3">State Lotteries</p>
                      <div className="grid grid-cols-2 gap-1">
                        {STATES.map(state => (
                          <Link key={state.slug} href={`/${state.slug}`} className="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            {state.name}
                          </Link>
                        ))}
                      </div>
                      <Link href="/states" className="block px-3 py-1.5 mt-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline">
                        View all states &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Predictions */}
            <div
              className="relative"
              onMouseEnter={() => openMenu('predictions')}
              onMouseLeave={closeMenu}
            >
              <button className={NAV_TRIGGER}>
                Predictions {CHEVRON}
              </button>
              {activeMenu === 'predictions' && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[400px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-5 z-50">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-3">Game Predictions</p>
                  <MegaMenuItem icon="🔴" title="Powerball Predictions" desc="Hot numbers, cold numbers & analysis" href="/blog/predictions/powerball" />
                  <MegaMenuItem icon="🔵" title="Mega Millions Predictions" desc="Statistical predictions for every draw" href="/blog/predictions/mega-millions" />
                  <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
                    <MegaMenuItem icon="📊" title="All Predictions" desc="Predictions for all US lottery games" href="/blog/predictions" />
                  </div>
                </div>
              )}
            </div>

            {/* Tools Mega Menu */}
            <div
              className="relative"
              onMouseEnter={() => openMenu('tools')}
              onMouseLeave={closeMenu}
            >
              <button className={NAV_TRIGGER}>
                Tools {CHEVRON}
              </button>
              {activeMenu === 'tools' && (
                <div className="absolute top-full right-0 mt-1 w-[380px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-5 z-50">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-3">Free Lottery Tools</p>
                  <MegaMenuItem icon="🔍" title="Check Your Numbers" desc="Verify if your ticket is a winner" href="/check-your-numbers" />
                  <MegaMenuItem icon="🎲" title="Number Generator" desc="Random numbers for any game" href="/number-generator" />
                  <MegaMenuItem icon="🔥" title="Number Frequency" desc="Hot and cold number analysis" href="/number-frequency" />
                  <MegaMenuItem icon="📊" title="Odds Calculator" desc="Calculate your winning chances" href="/odds-calculator" />
                  <MegaMenuItem icon="💵" title="Tax Calculator" desc="After-tax winnings by state" href="/tax-calculator" />
                  <MegaMenuItem icon="💰" title="Jackpot Tracker" desc="Track all current jackpots" href="/jackpot-tracker" />
                </div>
              )}
            </div>

            {/* Direct links */}
            <Link href="/check-your-numbers" className={NAV_LINK}>
              Check Numbers
            </Link>
            <Link href="/blog" className={NAV_LINK}>
              Blog
            </Link>
          </nav>

          {/* Tablet nav (md only, simplified) */}
          <nav className="hidden md:flex lg:hidden items-center gap-0.5">
            <Link href="/powerball" className={NAV_LINK}>Powerball</Link>
            <Link href="/mega-millions" className={NAV_LINK}>Mega Millions</Link>
            <Link href="/blog/predictions" className={NAV_LINK}>Predictions</Link>
            <Link href="/check-your-numbers" className={NAV_LINK}>Check</Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
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
          <div className="md:hidden pb-4 border-t border-gray-100 dark:border-gray-800 mt-2 pt-2 max-h-[80vh] overflow-y-auto">
            {/* Results Section */}
            <button
              onClick={() => setMobileExpanded(mobileExpanded === 'results' ? null : 'results')}
              className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold text-gray-900 dark:text-white"
            >
              <span>Results</span>
              <svg className={`w-4 h-4 text-gray-400 transition-transform ${mobileExpanded === 'results' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {mobileExpanded === 'results' && (
              <div className="pl-3 pb-2">
                <Link href="/powerball" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" onClick={closeMobile}>
                  <span className="text-base">🔴</span> Powerball
                </Link>
                <Link href="/mega-millions" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" onClick={closeMobile}>
                  <span className="text-base">🔵</span> Mega Millions
                </Link>
                <Link href="/jackpot-tracker" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" onClick={closeMobile}>
                  <span className="text-base">💰</span> Jackpot Tracker
                </Link>
                <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">States</div>
                {STATES.map(state => (
                  <Link key={state.slug} href={`/${state.slug}`} className="block px-6 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" onClick={closeMobile}>
                    {state.name}
                  </Link>
                ))}
                <Link href="/states" className="block px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 mt-1" onClick={closeMobile}>
                  View all states &rarr;
                </Link>
              </div>
            )}

            {/* Predictions Section */}
            <button
              onClick={() => setMobileExpanded(mobileExpanded === 'predictions' ? null : 'predictions')}
              className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold text-gray-900 dark:text-white"
            >
              <span>Predictions</span>
              <svg className={`w-4 h-4 text-gray-400 transition-transform ${mobileExpanded === 'predictions' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {mobileExpanded === 'predictions' && (
              <div className="pl-3 pb-2">
                <Link href="/blog/predictions/powerball" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" onClick={closeMobile}>
                  <span className="text-base">🔴</span> Powerball Predictions
                </Link>
                <Link href="/blog/predictions/mega-millions" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" onClick={closeMobile}>
                  <span className="text-base">🔵</span> Mega Millions Predictions
                </Link>
                <Link href="/blog/predictions" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" onClick={closeMobile}>
                  <span className="text-base">📊</span> All Predictions
                </Link>
              </div>
            )}

            {/* Tools Section */}
            <button
              onClick={() => setMobileExpanded(mobileExpanded === 'tools' ? null : 'tools')}
              className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold text-gray-900 dark:text-white"
            >
              <span>Tools</span>
              <svg className={`w-4 h-4 text-gray-400 transition-transform ${mobileExpanded === 'tools' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {mobileExpanded === 'tools' && (
              <div className="pl-3 pb-2">
                <Link href="/check-your-numbers" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" onClick={closeMobile}>
                  <span className="text-base">🔍</span> Check Your Numbers
                </Link>
                <Link href="/number-generator" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" onClick={closeMobile}>
                  <span className="text-base">🎲</span> Number Generator
                </Link>
                <Link href="/number-frequency" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" onClick={closeMobile}>
                  <span className="text-base">🔥</span> Number Frequency
                </Link>
                <Link href="/odds-calculator" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" onClick={closeMobile}>
                  <span className="text-base">📊</span> Odds Calculator
                </Link>
                <Link href="/jackpot-tracker" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" onClick={closeMobile}>
                  <span className="text-base">💰</span> Jackpot Tracker
                </Link>
              </div>
            )}

            {/* Direct links */}
            <div className="border-t border-gray-100 dark:border-gray-800 mt-2 pt-2">
              <Link href="/blog" className="block px-3 py-2.5 text-sm font-semibold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" onClick={closeMobile}>
                Blog
              </Link>
              <Link href="/about" className="block px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" onClick={closeMobile}>
                About
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
