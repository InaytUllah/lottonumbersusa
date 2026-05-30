#!/usr/bin/env node
/**
 * Submit canonical lottonumbersusa URLs to Google Indexing API.
 *
 * Runs from GitHub Actions (workflow: deploy.yml, job: notify-google) on a
 * once-a-day schedule. Replaces the old /api/notify-google route, which was
 * deleted when the site moved to a static export on Cloudflare Pages.
 *
 * Required env: GOOGLE_SERVICE_ACCOUNT_JSON (stringified service account
 * credentials with `indexing` scope access on the verified property).
 */

import { GoogleAuth } from 'google-auth-library';

const SITE_URL = process.env.SITE_URL || 'https://lottonumbersusa.com';
const INDEXING_API_URL = 'https://indexing.googleapis.com/v3/urlNotifications:publish';
const BATCH_SIZE = 10;
const BATCH_DELAY_MS = 500;

function fmt(d) {
  return d.toISOString().substring(0, 10);
}

function buildUrls() {
  const urls = new Set();

  // ---- STATIC + HUB PAGES ----
  const staticPages = [
    '/', '/powerball', '/mega-millions', '/states',
    '/check-your-numbers', '/number-generator', '/odds-calculator', '/tax-calculator',
    '/jackpot-tracker', '/number-frequency',
    '/blog', '/blog/predictions',
    '/about', '/contact', '/privacy', '/terms', '/disclaimer',
  ];
  staticPages.forEach(p => urls.add(`${SITE_URL}${p}`));

  // ---- BLOG GUIDES (long-form, high priority) ----
  const blogGuides = [
    'lotto-47-numbers-michigan-guide',
    'texas-two-step-numbers-strategy',
    'texas-pick-3-numbers-guide',
    'lottery-number-generator-guide',
    'mega-millions-number-generator-guide',
    'usa-lottery-results-complete-guide',
    'lotto-america-numbers-guide',
    'michigan-lottery-complete-guide',
    'how-to-pick-lottery-numbers',
    'lottery-strategy-wheeling-systems',
  ];
  blogGuides.forEach(slug => urls.add(`${SITE_URL}/blog/guides/${slug}`));

  // ---- STATE PAGES ----
  const states = [
    'california', 'texas', 'florida', 'new-york', 'pennsylvania',
    'ohio', 'georgia', 'michigan', 'north-carolina', 'new-jersey',
  ];
  states.forEach(s => urls.add(`${SITE_URL}/${s}`));

  // ---- STATE GAME PAGES ----
  const stateGames = {
    california: ['superlotto-plus', 'fantasy-5', 'daily-3', 'daily-4'],
    texas: ['lotto-texas', 'texas-two-step', 'cash-five', 'pick-3'],
    florida: ['florida-lotto', 'fantasy-5', 'pick-3', 'pick-4', 'pick-5'],
    'new-york': ['new-york-lotto', 'take-5', 'numbers', 'win-4'],
    pennsylvania: ['cash-5', 'match-6', 'treasure-hunt'],
    ohio: ['classic-lotto', 'rolling-cash-5', 'pick-3', 'pick-4', 'pick-5'],
    georgia: ['fantasy-5', 'cash-3', 'cash-4', 'georgia-five'],
    michigan: ['lotto-47', 'fantasy-5', 'daily-3', 'daily-4'],
    'north-carolina': ['cash-5', 'pick-3', 'pick-4'],
    'new-jersey': ['jersey-cash-5', 'pick-3', 'pick-4', 'pick-6'],
  };
  Object.entries(stateGames).forEach(([state, games]) => {
    games.forEach(g => urls.add(`${SITE_URL}/${state}/${g}`));
  });

  // ---- PREDICTION LANDING PAGES ----
  const predictionGames = [
    'powerball', 'mega-millions', 'superlotto-plus', 'lotto-texas',
    'florida-lotto', 'new-york-lotto', 'classic-lotto', 'lotto-47',
  ];
  predictionGames.forEach(g => urls.add(`${SITE_URL}/blog/predictions/${g}`));

  // ---- DAILY DYNAMIC CONTENT ----
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const todayStr = fmt(today);
  const yesterdayStr = fmt(yesterday);
  const tomorrowStr = fmt(tomorrow);

  // Today + yesterday result pages for the two national games
  for (const game of ['powerball', 'mega-millions']) {
    urls.add(`${SITE_URL}/${game}/results/${todayStr}`);
    urls.add(`${SITE_URL}/${game}/results/${yesterdayStr}`);
  }

  // Today + tomorrow prediction blog posts (one per prediction game)
  for (const game of predictionGames) {
    urls.add(`${SITE_URL}/blog/predictions/${game}-predictions-${todayStr}`);
    urls.add(`${SITE_URL}/blog/predictions/${game}-predictions-${tomorrowStr}`);
  }

  return [...urls];
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function notifyUrl(accessToken, url) {
  try {
    const response = await fetch(INDEXING_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ url, type: 'URL_UPDATED' }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      return { url, success: false, error: `${response.status}: ${errorText}` };
    }
    return { url, success: true };
  } catch (err) {
    return { url, success: false, error: String(err) };
  }
}

async function main() {
  const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!serviceAccountJson) {
    console.error('FATAL: GOOGLE_SERVICE_ACCOUNT_JSON is not set');
    process.exit(1);
  }

  let credentials;
  try {
    credentials = JSON.parse(serviceAccountJson);
  } catch (err) {
    console.error(`FATAL: Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON: ${err}`);
    process.exit(1);
  }

  const auth = new GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/indexing'],
  });

  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();
  const accessToken = typeof tokenResponse === 'string' ? tokenResponse : tokenResponse?.token;
  if (!accessToken) {
    console.error('FATAL: Failed to obtain Google access token');
    process.exit(1);
  }

  const urls = buildUrls();
  console.log(`Submitting ${urls.length} URLs to Google Indexing API...`);

  const results = [];
  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(batch.map(url => notifyUrl(accessToken, url)));
    results.push(...batchResults);
    if (i + BATCH_SIZE < urls.length) await sleep(BATCH_DELAY_MS);
  }

  const succeeded = results.filter(r => r.success).length;
  const failed = results.length - succeeded;
  console.log(`Done: ${succeeded} succeeded, ${failed} failed`);

  if (failed > 0) {
    console.log('Failed URLs:');
    for (const r of results.filter(x => !x.success)) {
      console.log(`  ${r.url} — ${r.error}`);
    }
  }

  if (succeeded === 0 && failed > 0) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
});
