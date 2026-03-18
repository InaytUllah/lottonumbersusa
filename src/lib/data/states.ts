import { StateConfig } from '../types';
import { STATE_GAMES, NATIONAL_GAMES } from './games';

export const STATES: StateConfig[] = [
  {
    name: 'California',
    slug: 'california',
    abbreviation: 'CA',
    games: [...NATIONAL_GAMES, ...(STATE_GAMES['california'] || [])],
    officialSite: 'https://www.calottery.com',
    population: 39538223,
    region: 'West',
  },
  {
    name: 'Texas',
    slug: 'texas',
    abbreviation: 'TX',
    games: [...NATIONAL_GAMES, ...(STATE_GAMES['texas'] || [])],
    officialSite: 'https://www.texaslottery.com',
    population: 29145505,
    region: 'South',
  },
  {
    name: 'Florida',
    slug: 'florida',
    abbreviation: 'FL',
    games: [...NATIONAL_GAMES, ...(STATE_GAMES['florida'] || [])],
    officialSite: 'https://www.flalottery.com',
    population: 21538187,
    region: 'South',
  },
  {
    name: 'New York',
    slug: 'new-york',
    abbreviation: 'NY',
    games: [...NATIONAL_GAMES, ...(STATE_GAMES['new-york'] || [])],
    officialSite: 'https://nylottery.ny.gov',
    population: 20201249,
    region: 'Northeast',
  },
  {
    name: 'Pennsylvania',
    slug: 'pennsylvania',
    abbreviation: 'PA',
    games: [...NATIONAL_GAMES, ...(STATE_GAMES['pennsylvania'] || [])],
    officialSite: 'https://www.palottery.state.pa.us',
    population: 13002700,
    region: 'Northeast',
  },
  {
    name: 'Ohio',
    slug: 'ohio',
    abbreviation: 'OH',
    games: [...NATIONAL_GAMES, ...(STATE_GAMES['ohio'] || [])],
    officialSite: 'https://www.ohiolottery.com',
    population: 11799448,
    region: 'Midwest',
  },
  {
    name: 'Georgia',
    slug: 'georgia',
    abbreviation: 'GA',
    games: [...NATIONAL_GAMES, ...(STATE_GAMES['georgia'] || [])],
    officialSite: 'https://www.galottery.com',
    population: 10711908,
    region: 'South',
  },
  {
    name: 'Michigan',
    slug: 'michigan',
    abbreviation: 'MI',
    games: [...NATIONAL_GAMES, ...(STATE_GAMES['michigan'] || [])],
    officialSite: 'https://www.michiganlottery.com',
    population: 10077331,
    region: 'Midwest',
  },
  {
    name: 'North Carolina',
    slug: 'north-carolina',
    abbreviation: 'NC',
    games: [...NATIONAL_GAMES, ...(STATE_GAMES['north-carolina'] || [])],
    officialSite: 'https://www.nclottery.com',
    population: 10439388,
    region: 'South',
  },
  {
    name: 'New Jersey',
    slug: 'new-jersey',
    abbreviation: 'NJ',
    games: [...NATIONAL_GAMES, ...(STATE_GAMES['new-jersey'] || [])],
    officialSite: 'https://www.njlottery.com',
    population: 9288994,
    region: 'Northeast',
  },
];

export function getStateBySlug(slug: string): StateConfig | undefined {
  return STATES.find(s => s.slug === slug);
}

export function getAllStateSlugs(): string[] {
  return STATES.map(s => s.slug);
}

export const STATE_SLUGS = STATES.map(s => s.slug);
