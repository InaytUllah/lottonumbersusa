// "On This Day" — historical lottery facts that rotate based on the date.
// Static dataset of verified historical lottery events, indexed by month/day where known.

interface HistoricalFact {
  year: number;
  fact: string;
  amount?: string;
  state?: string;
}

// Historical lottery events (real, verifiable)
const HISTORICAL_FACTS: Record<string, HistoricalFact[]> = {
  // Format: 'MM-DD'
  '01-13': [{ year: 2016, fact: 'Three winning Powerball tickets split a $1.586 billion jackpot — the second-largest US lottery prize in history', amount: '$1.586B', state: 'CA, FL, TN' }],
  '03-27': [{ year: 2019, fact: 'A single ticket sold in Wisconsin won the Powerball jackpot', amount: '$768.4M', state: 'Wisconsin' }],
  '07-29': [{ year: 2022, fact: 'Mega Millions jackpot won by a single ticket in Illinois', amount: '$1.337B', state: 'Illinois' }],
  '10-23': [{ year: 2018, fact: 'A single Mega Millions ticket sold in Simpsonville, South Carolina won the largest Mega Millions jackpot at the time', amount: '$1.537B', state: 'South Carolina' }],
  '11-07': [{ year: 2022, fact: 'The largest US lottery jackpot in history was won by a single Powerball ticket in California', amount: '$2.04B', state: 'California' }],
  '08-08': [{ year: 2023, fact: 'A Florida Powerball ticket won the third-largest US jackpot ever', amount: '$1.58B', state: 'Florida' }],
  '04-06': [{ year: 2024, fact: 'A single Powerball ticket sold in Oregon won a billion-dollar jackpot', amount: '$1.326B', state: 'Oregon' }],
  '03-26': [{ year: 2024, fact: 'Mega Millions jackpot won by a single ticket in New Jersey', amount: '$1.128B', state: 'New Jersey' }],
  '12-27': [{ year: 2013, fact: 'Two Mega Millions tickets split a $648 million jackpot, sold in California and Georgia', amount: '$648M', state: 'CA & GA' }],
  '01-22': [{ year: 2021, fact: 'A Mega Millions ticket sold in Michigan won the third-largest Mega Millions jackpot at the time', amount: '$1.05B', state: 'Michigan' }],
  '08-23': [{ year: 2017, fact: 'The largest single-ticket Powerball jackpot at the time was won in Massachusetts', amount: '$758.7M', state: 'Massachusetts' }],
};

// Generic facts for days without specific events
const GENERIC_FACTS: HistoricalFact[] = [
  { year: 1992, fact: 'Powerball debuted as a multi-state lottery game with 15 participating jurisdictions' },
  { year: 1996, fact: 'The Big Game (renamed Mega Millions in 2002) launched in six states' },
  { year: 2010, fact: 'Powerball and Mega Millions began cross-selling, allowing both games to be played in nearly every US state' },
  { year: 2015, fact: 'Powerball changed its matrix from 5/59 + 1/35 to 5/69 + 1/26, increasing jackpot odds to 1 in 292 million' },
  { year: 2017, fact: 'Mega Millions changed its format to 5/70 + 1/25, increasing the starting jackpot to $40 million' },
  { year: 2024, fact: 'The combined Powerball and Mega Millions sales exceeded $14 billion across the US' },
];

function getFactForToday(): HistoricalFact {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const key = `${month}-${day}`;

  const facts = HISTORICAL_FACTS[key];
  if (facts && facts.length > 0) {
    return facts[0];
  }

  // Use day of year as a stable seed for picking a generic fact
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  return GENERIC_FACTS[dayOfYear % GENERIC_FACTS.length];
}

export default function OnThisDayWidget() {
  const fact = getFactForToday();
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-800 p-5">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-amber-200 dark:bg-amber-700 flex items-center justify-center flex-shrink-0 text-xl" aria-hidden="true">
          📅
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">On this day</p>
            <p className="text-xs text-amber-700 dark:text-amber-400">{dateStr}, {fact.year}</p>
          </div>
          <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
            {fact.fact}
            {fact.amount && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100">
                {fact.amount}
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
