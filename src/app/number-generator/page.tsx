import { Metadata } from 'next';
import Link from 'next/link';
import JsonLd, { getBreadcrumbSchema, getFAQSchema } from '@/components/JsonLd';
import NumberGeneratorClient from '@/components/NumberGeneratorClient';

export const metadata: Metadata = {
  title: 'Free Lottery Number Generator - Random Numbers for Any US Game',
  description: 'Generate random lottery numbers for Powerball, Mega Millions, and all US state lottery games. Free, fast, and no signup required. Pick your lucky numbers now.',
  alternates: { canonical: 'https://lottonumbersusa.com/number-generator' },
};

const generatorFAQs = [
  { question: 'Is this lottery number generator truly random?', answer: 'Yes, our generator uses a random algorithm to produce numbers with equal probability. Each number in the valid range has the same chance of being selected.' },
  { question: 'Can a number generator help me win the lottery?', answer: 'No tool can predict lottery outcomes or improve your odds of winning. Every combination has an equal chance. Our generator simply provides a convenient way to pick random numbers instead of choosing them yourself.' },
  { question: 'Which lottery games can I generate numbers for?', answer: 'You can generate numbers for Powerball, Mega Millions, and all state-specific games including SuperLotto Plus (CA), Lotto Texas, Florida Lotto, New York Lotto, and dozens more.' },
  { question: 'How many number sets can I generate at once?', answer: 'You can generate 1, 3, 5, 10, or 20 sets of numbers at a time. Each set is independently generated with unique combinations.' },
];

export default function NumberGeneratorPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <JsonLd data={getBreadcrumbSchema([
        { name: 'Home', url: 'https://lottonumbersusa.com' },
        { name: 'Number Generator', url: 'https://lottonumbersusa.com/number-generator' },
      ])} />
      <JsonLd data={getFAQSchema(generatorFAQs)} />

      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">Number Generator</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
        Free Lottery Number Generator
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
        Generate random lottery numbers for Powerball, Mega Millions, or any US lottery game
      </p>

      <NumberGeneratorClient />

      {/* SSR-visible SEO content - visible to search engine bots */}
      <section className="mt-12 prose dark:prose-invert max-w-none">
        <h2>About Our Lottery Number Generator</h2>
        <p>
          Use our free lottery number generator to pick random numbers for any US lottery game including{' '}
          <Link href="/powerball">Powerball</Link>, <Link href="/mega-millions">Mega Millions</Link>,
          SuperLotto Plus, Lotto Texas, Florida Lotto, and dozens more. Numbers are generated using a random
          algorithm ensuring fair and unbiased results.
        </p>
        <p>
          Each number within the valid range has an equal probability of being chosen. Our generator respects
          the exact rules of each game — the correct number count, number range, and bonus ball rules are all
          built in automatically when you select your game.
        </p>
        <h3>How It Works</h3>
        <p>
          Select your lottery game from the dropdown menu, choose how many lines you want to generate (1 to 20),
          and click &quot;Generate Numbers.&quot; The generator instantly creates random combinations following the
          exact format of your chosen game. For games with bonus balls (like the red Powerball or
          Mega Ball), those are generated separately from the correct bonus number pool.
        </p>
        <h3>Supported Games</h3>
        <p>
          We support all major US lottery games including national games (Powerball and Mega Millions) and
          state-specific games from California, Texas, Florida, New York, Pennsylvania, Ohio, Georgia, Michigan,
          North Carolina, and New Jersey. Each game uses its official number ranges and rules.
        </p>
      </section>

      {/* FAQ */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Number Generator FAQ</h2>
        <div className="space-y-4">
          {generatorFAQs.map((faq, index) => (
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
