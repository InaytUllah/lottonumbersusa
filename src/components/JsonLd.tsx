interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Organization + WebSite schema (goes in layout)
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Lotto Numbers USA',
    url: 'https://lottonumbersusa.com',
    logo: 'https://lottonumbersusa.com/icon.png',
    sameAs: [],
    description: 'Your trusted source for the latest US lottery results including Powerball, Mega Millions, and state lottery games.',
  };
}

export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Lotto Numbers USA',
    url: 'https://lottonumbersusa.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://lottonumbersusa.com/states?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function getFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function getLotteryResultSchema(
  gameName: string,
  drawDate: string,
  numbers: number[],
  bonusBall?: number,
  jackpot?: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `${gameName} Drawing - ${drawDate}`,
    startDate: drawDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    location: {
      '@type': 'VirtualLocation',
      url: `https://lottonumbersusa.com/${gameName.toLowerCase().replace(/\s+/g, '-')}`,
    },
    organizer: {
      '@type': 'Organization',
      name: gameName,
    },
    description: `${gameName} winning numbers for ${drawDate}: ${numbers.join(', ')}${bonusBall ? ` + ${bonusBall}` : ''}${jackpot ? `. Jackpot: ${jackpot}` : ''}`,
  };
}
