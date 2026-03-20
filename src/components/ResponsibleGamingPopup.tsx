'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ResponsibleGamingPopup() {
  const [visible, setVisible] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const dismissed = sessionStorage.getItem('responsible-gaming-dismissed');
    if (dismissed) return;

    const showTimer = setTimeout(() => {
      setVisible(true);
    }, 5000);

    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!visible || fadingOut) return;

    const autoDismiss = setTimeout(() => {
      dismiss();
    }, 10000);

    return () => clearTimeout(autoDismiss);
  }, [visible, fadingOut]);

  const dismiss = () => {
    setFadingOut(true);
    setTimeout(() => {
      setVisible(false);
      setFadingOut(false);
      sessionStorage.setItem('responsible-gaming-dismissed', 'true');
    }, 500);
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 sm:right-4 left-4 sm:left-auto z-[999] w-auto sm:w-[380px] transition-all duration-500 ${
        fadingOut ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
      }`}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Amber accent bar */}
        <div className="h-1 bg-amber-500" />

        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Warning icon */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center mt-0.5">
              <svg className="w-4.5 h-4.5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                Gambling is considered sinful in many faiths and traditions. If your beliefs discourage it, please honor them. No tool or strategy can change lottery odds — play responsibly or not at all.
              </p>
              <Link
                href="/responsible-gaming"
                onClick={dismiss}
                className="inline-block mt-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Get Help &amp; Support
              </Link>
            </div>

            {/* Close button */}
            <button
              onClick={dismiss}
              className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Dismiss"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-gray-100 dark:bg-gray-700">
          <div className="h-full bg-amber-500 animate-shrink-bar" />
        </div>
      </div>
    </div>
  );
}
