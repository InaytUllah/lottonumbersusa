'use client';

import { useState, useMemo } from 'react';

// State tax rates on lottery winnings (top marginal rate, 2026)
const STATE_TAX_RATES: { name: string; rate: number; note?: string }[] = [
  { name: 'Alabama', rate: 0, note: 'No state lottery' },
  { name: 'Alaska', rate: 0, note: 'No state lottery' },
  { name: 'Arizona', rate: 2.5 },
  { name: 'Arkansas', rate: 4.4 },
  { name: 'California', rate: 0, note: 'Exempt' },
  { name: 'Colorado', rate: 4.4 },
  { name: 'Connecticut', rate: 6.99 },
  { name: 'Delaware', rate: 0, note: 'In-state exempt' },
  { name: 'Florida', rate: 0 },
  { name: 'Georgia', rate: 5.39 },
  { name: 'Hawaii', rate: 0, note: 'No state lottery' },
  { name: 'Idaho', rate: 5.3 },
  { name: 'Illinois', rate: 4.95 },
  { name: 'Indiana', rate: 3.0 },
  { name: 'Iowa', rate: 3.8 },
  { name: 'Kansas', rate: 5.58 },
  { name: 'Kentucky', rate: 4.0 },
  { name: 'Louisiana', rate: 3.0 },
  { name: 'Maine', rate: 7.15 },
  { name: 'Maryland', rate: 8.95 },
  { name: 'Massachusetts', rate: 5.0 },
  { name: 'Michigan', rate: 4.25 },
  { name: 'Minnesota', rate: 9.85 },
  { name: 'Mississippi', rate: 5.0 },
  { name: 'Missouri', rate: 4.7 },
  { name: 'Montana', rate: 5.9 },
  { name: 'Nebraska', rate: 5.84 },
  { name: 'Nevada', rate: 0, note: 'No state lottery' },
  { name: 'New Hampshire', rate: 0 },
  { name: 'New Jersey', rate: 10.75 },
  { name: 'New Mexico', rate: 5.9 },
  { name: 'New York', rate: 10.9 },
  { name: 'North Carolina', rate: 4.5 },
  { name: 'North Dakota', rate: 2.5 },
  { name: 'Ohio', rate: 3.5 },
  { name: 'Oklahoma', rate: 4.75 },
  { name: 'Oregon', rate: 9.9 },
  { name: 'Pennsylvania', rate: 3.07 },
  { name: 'Rhode Island', rate: 5.99 },
  { name: 'South Carolina', rate: 6.4 },
  { name: 'South Dakota', rate: 0 },
  { name: 'Tennessee', rate: 0 },
  { name: 'Texas', rate: 0 },
  { name: 'Utah', rate: 0, note: 'No state lottery' },
  { name: 'Vermont', rate: 8.75 },
  { name: 'Virginia', rate: 5.75 },
  { name: 'Washington', rate: 0 },
  { name: 'West Virginia', rate: 5.12 },
  { name: 'Wisconsin', rate: 7.65 },
  { name: 'Wyoming', rate: 0 },
];

const FEDERAL_RATE = 0.37;        // top bracket
const FEDERAL_WITHHOLDING = 0.24;  // initial IRS withholding
const CASH_OPTION_RATIO = 0.482;   // typical lump-sum to advertised ratio

function formatMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

function formatFullMoney(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

export default function TaxCalculatorClient() {
  const [jackpot, setJackpot] = useState(100_000_000);
  const [stateName, setStateName] = useState('California');

  const stateTax = useMemo(() => {
    const found = STATE_TAX_RATES.find(s => s.name === stateName);
    return found || STATE_TAX_RATES[0];
  }, [stateName]);

  const calc = useMemo(() => {
    // Lump sum
    const lumpGross = jackpot * CASH_OPTION_RATIO;
    const lumpFederal = lumpGross * FEDERAL_RATE;
    const lumpState = lumpGross * (stateTax.rate / 100);
    const lumpNet = lumpGross - lumpFederal - lumpState;

    // Annuity (30 years, 29 graduated payments + initial)
    // Simplified: assume each year's payment is roughly jackpot/30, taxed in top bracket
    const annuityPerYear = jackpot / 30;
    const annuityFederalPerYear = annuityPerYear * FEDERAL_RATE;
    const annuityStatePerYear = annuityPerYear * (stateTax.rate / 100);
    const annuityNetPerYear = annuityPerYear - annuityFederalPerYear - annuityStatePerYear;
    const annuityTotalNet = annuityNetPerYear * 30;

    return {
      lumpGross,
      lumpFederal,
      lumpState,
      lumpNet,
      annuityPerYear,
      annuityNetPerYear,
      annuityTotalNet,
    };
  }, [jackpot, stateTax]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
      {/* Inputs */}
      <div className="p-5 sm:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="jackpot-amount" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Advertised jackpot amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
              <input
                id="jackpot-amount"
                type="number"
                min={1_000_000}
                step={1_000_000}
                value={jackpot}
                onChange={(e) => setJackpot(Math.max(1_000_000, parseInt(e.target.value) || 0))}
                className="w-full pl-8 pr-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-base font-semibold focus:border-blue-500 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[10_000_000, 50_000_000, 100_000_000, 500_000_000, 1_000_000_000].map(amt => (
                <button
                  key={amt}
                  onClick={() => setJackpot(amt)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    jackpot === amt
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                >
                  {formatMoney(amt)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="state-select" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Your state of residence
            </label>
            <select
              id="state-select"
              value={stateName}
              onChange={(e) => setStateName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-base font-semibold focus:border-blue-500 focus:outline-none"
            >
              {STATE_TAX_RATES.filter(s => !s.note?.includes('No state lottery')).map(s => (
                <option key={s.name} value={s.name}>
                  {s.name} — {s.rate}% state tax{s.note ? ` (${s.note})` : ''}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              State tax is based on where you <em>live</em>, not where you bought the ticket.
            </p>
          </div>
        </div>
      </div>

      {/* Results comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-gray-200 dark:bg-gray-700">
        {/* Lump Sum */}
        <div className="bg-white dark:bg-gray-800 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Lump Sum</p>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Cash payout, taken now</h3>
            </div>
            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400">
              Most popular
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Cash value (~48.2% of jackpot)</span>
              <span className="font-semibold text-gray-900 dark:text-white">{formatFullMoney(calc.lumpGross)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Federal tax (37%)</span>
              <span className="font-semibold text-red-600 dark:text-red-400">−{formatFullMoney(calc.lumpFederal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">State tax ({stateTax.rate}%)</span>
              <span className="font-semibold text-red-600 dark:text-red-400">−{formatFullMoney(calc.lumpState)}</span>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-medium text-gray-900 dark:text-white">You take home</span>
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatFullMoney(calc.lumpNet)}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {((calc.lumpNet / jackpot) * 100).toFixed(1)}% of advertised jackpot
              </p>
            </div>
          </div>
        </div>

        {/* Annuity */}
        <div className="bg-white dark:bg-gray-800 p-5 sm:p-6">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-400">Annuity</p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">30-year payment plan</h3>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Per year (gross, 30 years)</span>
              <span className="font-semibold text-gray-900 dark:text-white">{formatFullMoney(calc.annuityPerYear)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Federal tax per year (37%)</span>
              <span className="font-semibold text-red-600 dark:text-red-400">−{formatFullMoney(calc.annuityPerYear * FEDERAL_RATE)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">State tax per year ({stateTax.rate}%)</span>
              <span className="font-semibold text-red-600 dark:text-red-400">−{formatFullMoney(calc.annuityPerYear * (stateTax.rate / 100))}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Net per year</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">{formatFullMoney(calc.annuityNetPerYear)}</span>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-medium text-gray-900 dark:text-white">Total over 30 years</span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formatFullMoney(calc.annuityTotalNet)}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {((calc.annuityTotalNet / jackpot) * 100).toFixed(1)}% of advertised jackpot
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom line */}
      <div className="p-5 sm:p-6 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-sm">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-gray-900 dark:text-white">Bottom line:</span>
          </div>
          <p className="text-gray-700 dark:text-gray-300">
            On a {formatFullMoney(jackpot)} jackpot in {stateName}, you take home about <strong className="text-emerald-600 dark:text-emerald-400">{formatFullMoney(calc.lumpNet)}</strong> with the lump sum,
            or <strong className="text-blue-600 dark:text-blue-400">{formatFullMoney(calc.annuityNetPerYear)}/year</strong> for 30 years with the annuity ({formatFullMoney(calc.annuityTotalNet)} total).
          </p>
        </div>
      </div>
    </div>
  );
}
