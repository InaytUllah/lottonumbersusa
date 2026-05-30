import { Metadata } from 'next';
import Link from 'next/link';
import JsonLd, { getBreadcrumbSchema, getFAQSchema } from '@/components/JsonLd';
import TaxCalculatorClient from '@/components/TaxCalculatorClient';

export const metadata: Metadata = {
  title: 'Lottery Tax Calculator: Lump Sum vs Annuity Federal & State Taxes',
  description: 'Calculate your real lottery winnings after federal and state taxes. Compare lump sum cash payout vs annuity payments. Free Powerball and Mega Millions tax calculator with all 50 state rates.',
  alternates: { canonical: 'https://lottonumbersusa.com/tax-calculator' },
};

const taxFAQs = [
  {
    question: 'How much tax do you pay on a $1 million lottery win?',
    answer: 'On a $1 million lottery prize, the IRS withholds 24% federally ($240,000), but your actual federal tax can climb to 37% in the top bracket. State tax adds 0% to 10.9% depending on where you live. After federal and state taxes, you typically take home $580,000 to $760,000 from a $1 million prize.',
  },
  {
    question: 'Should I take the lump sum or annuity for a lottery jackpot?',
    answer: 'The lump sum is roughly 50-60% of the advertised jackpot but you get it all at once. The annuity pays the full advertised amount over 30 years (29 graduated payments + an initial one). Most financial advisors recommend the lump sum if you can reasonably invest it at over 5% return per year. The annuity is better if you worry about overspending or want guaranteed income.',
  },
  {
    question: 'Which states do not tax lottery winnings?',
    answer: 'Eight states have no state income tax on lottery winnings: California, Florida, New Hampshire, South Dakota, Tennessee, Texas, Washington, and Wyoming. Delaware and Pennsylvania exempt state lottery winnings only.',
  },
  {
    question: 'What is the federal tax rate on lottery winnings?',
    answer: 'The IRS automatically withholds 24% on prizes over $5,000. But lottery winnings are taxed as ordinary income, so the actual rate can reach 37% if your income lands you in the top bracket. You owe the difference at tax time.',
  },
  {
    question: 'Are lottery winnings taxed twice?',
    answer: 'No, but they are taxed at multiple levels: federal income tax, state income tax (in most states), and sometimes local/city tax. Yonkers and New York City both tax winnings on top of New York State tax.',
  },
];

export default function TaxCalculatorPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <JsonLd data={getBreadcrumbSchema([
        { name: 'Home', url: 'https://lottonumbersusa.com' },
        { name: 'Lottery Tax Calculator', url: 'https://lottonumbersusa.com/tax-calculator' },
      ])} />
      <JsonLd data={getFAQSchema(taxFAQs)} />

      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">Lottery Tax Calculator</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Lottery Tax Calculator: Lump Sum vs Annuity
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
          See exactly what you&apos;d take home from a Powerball or Mega Millions jackpot after federal and state taxes.
          Compare the lump sum cash payout against the 30-year annuity option.
        </p>
      </header>

      {/* AEO direct-answer */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-5 mb-8">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0">
            <span className="text-amber-700 dark:text-amber-400 font-bold text-sm">$</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Quick answer: How much do you actually take home?</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              On a $100 million advertised jackpot, the lump sum is roughly $48 million cash. Federal tax (37%) takes about $17.8M. State tax adds another $0 to $5.2M depending on your state.
              You walk away with somewhere between <strong className="text-gray-900 dark:text-white">$25M and $30M</strong>. Use the calculator below for your exact state and prize amount.
            </p>
          </div>
        </div>
      </div>

      <TaxCalculatorClient />

      {/* Tax tiers reference */}
      <section className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Federal Tax Brackets (2026)</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            The IRS withholds 24% on lottery prizes over $5,000, but your actual rate depends on your bracket.
          </p>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Bracket</th>
                <th className="px-3 py-2 text-right text-xs font-semibold text-gray-600 dark:text-gray-300">Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              <tr><td className="px-3 py-2 text-gray-700 dark:text-gray-300">$0 – $11,925</td><td className="px-3 py-2 text-right">10%</td></tr>
              <tr><td className="px-3 py-2 text-gray-700 dark:text-gray-300">$11,925 – $48,475</td><td className="px-3 py-2 text-right">12%</td></tr>
              <tr><td className="px-3 py-2 text-gray-700 dark:text-gray-300">$48,475 – $103,350</td><td className="px-3 py-2 text-right">22%</td></tr>
              <tr><td className="px-3 py-2 text-gray-700 dark:text-gray-300">$103,350 – $197,300</td><td className="px-3 py-2 text-right">24%</td></tr>
              <tr><td className="px-3 py-2 text-gray-700 dark:text-gray-300">$197,300 – $250,525</td><td className="px-3 py-2 text-right">32%</td></tr>
              <tr><td className="px-3 py-2 text-gray-700 dark:text-gray-300">$250,525 – $626,350</td><td className="px-3 py-2 text-right">35%</td></tr>
              <tr className="bg-red-50 dark:bg-red-900/20"><td className="px-3 py-2 font-medium text-gray-900 dark:text-white">Over $626,350</td><td className="px-3 py-2 text-right font-bold">37%</td></tr>
            </tbody>
          </table>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">States with No Lottery Tax</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Eight states do not tax lottery winnings. If you live in one of these, you only pay federal tax.
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {['California', 'Florida', 'New Hampshire', 'South Dakota', 'Tennessee', 'Texas', 'Washington', 'Wyoming'].map(state => (
              <div key={state} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                <span className="font-medium">{state}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            Delaware and Pennsylvania also exempt their own state lottery winnings (but tax other state lottery prizes).
          </p>
        </div>
      </section>

      {/* SEO content */}
      <section className="mt-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8">
        <div className="space-y-6 max-w-4xl">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Lump Sum vs Annuity: Which Should You Take?</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
              The biggest financial decision after winning a Powerball or Mega Millions jackpot. The lump sum is the cash value — typically <strong className="text-gray-900 dark:text-white">50% to 60% of the advertised jackpot</strong>. The annuity pays the full advertised amount, but spread over 30 years as 29 yearly graduated payments plus one immediate payment.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm mt-3">
              Most lottery winners take the lump sum (about 95% of jackpot winners do). The math favors lump sum when invested wisely — historical S&amp;P 500 returns average 8-10% per year, beating the annuity&apos;s implied 4-5% growth rate. The annuity only wins if you would otherwise blow the cash quickly. It also continues to your estate if you die, but at the cost of giving up flexibility.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">How federal tax works on lottery winnings</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
              The IRS automatically withholds <strong className="text-gray-900 dark:text-white">24% federally</strong> on any lottery prize over $5,000. That&apos;s only the down payment though — lottery winnings count as ordinary income. A jackpot puts you straight into the top federal bracket of 37%, so you owe the difference at tax time. On a $100 million lump sum, the IRS keeps roughly $24M up front and you owe another $13M when you file.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">State taxes vary by where you live, not where you bought the ticket</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
              Most states tax lottery winnings, but not all. New York hits hardest at <strong className="text-gray-900 dark:text-white">10.9%</strong>. New Jersey is 10.75%. Maryland is 8.95%. California, Florida, Texas, Washington, Tennessee, South Dakota, New Hampshire, and Wyoming charge zero state tax on lottery prizes. If you bought your winning ticket in one state but live in another, your <em>home</em> state&apos;s tax usually applies — though some non-resident states also withhold first.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Hidden costs nobody mentions</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><strong className="text-gray-900 dark:text-white">Estate tax:</strong> If you take the annuity and die early, remaining payments may face estate tax even though you never received them.</li>
              <li><strong className="text-gray-900 dark:text-white">Local/city tax:</strong> NYC adds 3.876% on top of state tax. Yonkers adds 1.477%.</li>
              <li><strong className="text-gray-900 dark:text-white">Gift tax:</strong> Sharing your win with friends or family can trigger gift tax over $19,000 per recipient per year (2026 limit).</li>
              <li><strong className="text-gray-900 dark:text-white">Investment income tax:</strong> The interest, dividends, and capital gains you earn on your winnings get taxed every year going forward.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-10">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-5">Lottery tax questions</h2>
        <div className="space-y-3">
          {taxFAQs.map((faq, index) => (
            <details key={index} className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              <summary className="flex items-center justify-between cursor-pointer p-4 sm:p-5 font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors list-none">
                <span>{faq.question}</span>
                <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="px-4 sm:px-5 pb-4 sm:pb-5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <div className="mt-8 text-xs text-gray-500 dark:text-gray-400 italic">
        Tax rates current as of 2026 tax year. This calculator provides estimates for planning purposes only and is not tax advice. Consult a CPA or tax attorney before claiming a major lottery prize.
      </div>
    </div>
  );
}
