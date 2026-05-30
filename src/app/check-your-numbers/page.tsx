import { Metadata } from 'next';
import Link from 'next/link';
import JsonLd, { getBreadcrumbSchema, getFAQSchema } from '@/components/JsonLd';
import CheckYourNumbers from '@/components/CheckYourNumbers';
import { getLatestResult, formatDate } from '@/lib/api/lottery-api';
import LotteryBalls from '@/components/LotteryBalls';


export const metadata: Metadata = {
  title: 'Check Your Lottery Numbers - Did You Win Powerball or Mega Millions?',
  description: 'Check your Powerball and Mega Millions numbers instantly. Enter your numbers and find out if you won. Free lottery number checker updated after every draw.',
  alternates: { canonical: 'https://lottonumbersusa.com/check-your-numbers' },
};

const faqs = [
  { question: 'How do I check my Powerball numbers?', answer: 'Enter your 5 white ball numbers (1-69) and your red Powerball number (1-26) into our checker above. Click "Check Numbers" and we will instantly compare your numbers against the latest drawing results and tell you if you won a prize.' },
  { question: 'How do I check my Mega Millions numbers?', answer: 'Enter your 5 white ball numbers (1-70) and your gold Mega Ball number (1-25) into our Mega Millions checker. Click "Check Numbers" and we will instantly show your matches and prize tier.' },
  { question: 'How soon after the drawing can I check my numbers?', answer: 'Our results are updated within minutes of the official draw. Powerball draws happen Monday, Wednesday, and Saturday at 10:59 PM ET. Mega Millions draws happen Tuesday and Friday at 11:00 PM ET.' },
  { question: 'What prizes can I win with Powerball?', answer: 'Powerball has 9 prize tiers. Match just the Powerball to win $4. Match all 5 numbers plus the Powerball to win the jackpot, which starts at $20 million and grows until someone wins.' },
  { question: 'What if I matched some but not all numbers?', answer: 'You can still win! Both Powerball and Mega Millions have 9 prize tiers. Even matching just the bonus ball (Powerball or Mega Ball) wins you a small prize. The more numbers you match, the bigger the prize.' },
];

export default async function CheckYourNumbersPage() {
  const [powerballResult, megaResult] = await Promise.all([
    getLatestResult('powerball'),
    getLatestResult('mega-millions'),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <JsonLd data={getBreadcrumbSchema([
        { name: 'Home', url: 'https://lottonumbersusa.com' },
        { name: 'Check Your Numbers', url: 'https://lottonumbersusa.com/check-your-numbers' },
      ])} />
      <JsonLd data={getFAQSchema(faqs)} />

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">Check Your Numbers</span>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-br from-purple-700 to-indigo-900 rounded-2xl p-6 sm:p-10 mb-8 text-white text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Check Your Lottery Numbers</h1>
        <p className="text-purple-200 text-lg max-w-2xl mx-auto">
          Enter your Powerball or Mega Millions numbers below to instantly find out if you won a prize
        </p>
      </div>

      {/* Two-column checker */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Powerball Checker */}
        <div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-5 mb-4 border border-red-100 dark:border-red-900/40">
            <h2 className="font-bold text-gray-900 dark:text-white mb-1">Latest Powerball Results</h2>
            {powerballResult && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{formatDate(powerballResult.drawDate)}</p>
                <LotteryBalls
                  numbers={powerballResult.numbers}
                  bonusBall={powerballResult.bonusBall}
                  bonusBallName="Powerball"
                  multiplier={powerballResult.multiplier}
                  multiplierName="Power Play"
                  size="md"
                  gameColor="#e4002b"
                />
                {powerballResult.jackpot && (
                  <p className="text-sm font-bold text-green-600 dark:text-green-400 mt-2">Jackpot: {powerballResult.jackpot}</p>
                )}
              </div>
            )}
          </div>
          {powerballResult && (
            <CheckYourNumbers
              gameSlug="powerball"
              latestNumbers={powerballResult.numbers}
              latestBonus={powerballResult.bonusBall}
            />
          )}
        </div>

        {/* Mega Millions Checker */}
        <div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 mb-4 border border-blue-100 dark:border-blue-900/40">
            <h2 className="font-bold text-gray-900 dark:text-white mb-1">Latest Mega Millions Results</h2>
            {megaResult && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{formatDate(megaResult.drawDate)}</p>
                <LotteryBalls
                  numbers={megaResult.numbers}
                  bonusBall={megaResult.bonusBall}
                  bonusBallName="Mega Ball"
                  multiplier={megaResult.multiplier}
                  multiplierName="Megaplier"
                  size="md"
                  gameColor="#0066b2"
                />
                {megaResult.jackpot && (
                  <p className="text-sm font-bold text-green-600 dark:text-green-400 mt-2">Jackpot: {megaResult.jackpot}</p>
                )}
              </div>
            )}
          </div>
          {megaResult && (
            <CheckYourNumbers
              gameSlug="mega-millions"
              latestNumbers={megaResult.numbers}
              latestBonus={megaResult.bonusBall}
            />
          )}
        </div>
      </div>

      {/* SEO Content */}
      <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8 mb-10">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Free Lottery Number Checker</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Use our free lottery number checker to instantly verify your <strong className="text-gray-900 dark:text-white">Powerball</strong> and <strong className="text-gray-900 dark:text-white">Mega Millions</strong> tickets.
            Simply enter the numbers from your ticket and our system will compare them against the latest
            official drawing results. You will see exactly how many numbers you matched, whether you hit
            the bonus ball, and what prize tier you fall into.
          </p>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-3">
            Our checker is updated within minutes of every official draw. <strong className="text-gray-900 dark:text-white">Powerball</strong> drawings happen every
            Monday, Wednesday, and Saturday at 10:59 PM ET. <strong className="text-gray-900 dark:text-white">Mega Millions</strong> drawings happen every Tuesday
            and Friday at 11:00 PM ET. Bookmark this page so you can quickly check your numbers after
            every drawing.
          </p>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Understanding Your Results</h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Both <strong className="text-gray-900 dark:text-white">Powerball</strong> and <strong className="text-gray-900 dark:text-white">Mega Millions</strong> have <strong className="text-gray-900 dark:text-white">9 prize tiers</strong>. You do not need to match all numbers to
            win. Even matching just the bonus ball (Powerball or Mega Ball) wins you a prize. The more
            numbers you match, the larger your prize. If you add <strong className="text-gray-900 dark:text-white">Power Play</strong> (Powerball) or <strong className="text-gray-900 dark:text-white">Megaplier</strong>
            (Mega Millions) to your ticket, your non-jackpot prizes are multiplied.
          </p>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">What to Do If You Win</h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            If our checker shows you have won, congratulations! Sign the back of your ticket immediately
            and store it in a safe place. For prizes under $600, you can typically claim at any authorized
            retailer. For larger prizes, visit your state lottery office. For jackpot wins, consider
            consulting a financial advisor and attorney before claiming your prize.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details key={index} className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              <summary className="flex items-center justify-between cursor-pointer p-5 font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                {faq.question}
                <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="px-5 pb-5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
