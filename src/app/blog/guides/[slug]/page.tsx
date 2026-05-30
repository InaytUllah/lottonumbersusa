import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import JsonLd, { getBreadcrumbSchema, getFAQSchema } from '@/components/JsonLd';
import { getGuideBySlug, getAllGuideSlugs, getAllGuides, BlogGuide, BlogSection } from '@/lib/data/blog-guides';


export async function generateStaticParams() {
  return getAllGuideSlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};
  return {
    title: guide.metaTitle,
    description: guide.metaDescription,
    alternates: { canonical: `https://lottonumbersusa.com/blog/guides/${guide.slug}` },
    openGraph: {
      title: guide.metaTitle,
      description: guide.metaDescription,
      type: 'article',
      publishedTime: guide.publishedAt,
      modifiedTime: guide.updatedAt,
      authors: [guide.author],
    },
    keywords: guide.keywords,
  };
}

function renderSection(section: BlogSection, idx: number) {
  switch (section.type) {
    case 'paragraph':
      return (
        <p key={idx} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          {section.content}
        </p>
      );
    case 'heading':
      if (section.level === 2) {
        return (
          <h2 key={idx} id={section.id} className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-10 mb-4 scroll-mt-20">
            {section.content}
          </h2>
        );
      }
      return (
        <h3 key={idx} id={section.id} className="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-3 scroll-mt-20">
          {section.content}
        </h3>
      );
    case 'list':
      const ListTag = section.ordered ? 'ol' : 'ul';
      return (
        <ListTag key={idx} className={`${section.ordered ? 'list-decimal' : 'list-disc'} list-outside ml-6 space-y-2 mb-4 text-gray-700 dark:text-gray-300`}>
          {section.items.map((item, i) => (
            <li key={i} className="leading-relaxed">{item}</li>
          ))}
        </ListTag>
      );
    case 'table':
      return (
        <div key={idx} className="my-6 overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {section.headers.map((h, i) => (
                  <th key={i} className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {section.rows.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                  {row.map((cell, j) => (
                    <td key={j} className="px-4 py-2.5 text-gray-700 dark:text-gray-300">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'callout':
      const calloutColors = {
        info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100',
        warning: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-100',
        success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100',
        tip: 'bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800 text-violet-900 dark:text-violet-100',
      };
      return (
        <div key={idx} className={`my-6 p-5 rounded-xl border ${calloutColors[section.variant]}`}>
          {section.title && <p className="font-semibold mb-1">{section.title}</p>}
          <p className="text-sm leading-relaxed">{section.content}</p>
        </div>
      );
    case 'quote':
      return (
        <blockquote key={idx} className="my-6 pl-6 border-l-4 border-gray-300 dark:border-gray-600 italic text-gray-700 dark:text-gray-300">
          <p>{section.content}</p>
          {section.cite && <cite className="block mt-2 text-sm not-italic text-gray-500">— {section.cite}</cite>}
        </blockquote>
      );
    case 'numbersList':
      return (
        <div key={idx} className="my-4 flex items-center gap-3 flex-wrap">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{section.label}:</span>
          {section.numbers.map((n, i) => (
            <span
              key={i}
              className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 font-bold text-sm text-gray-800 dark:text-white"
            >
              {n}
            </span>
          ))}
        </div>
      );
  }
}

export default async function BlogGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  // Find related guides (same category, excluding self)
  const relatedGuides = getAllGuides()
    .filter(g => g.slug !== guide.slug && g.category === guide.category)
    .slice(0, 3);

  // Article schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.metaDescription,
    author: {
      '@type': 'Organization',
      name: 'LottoNumbersUSA',
      url: 'https://lottonumbersusa.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'LottoNumbersUSA',
      logo: {
        '@type': 'ImageObject',
        url: 'https://lottonumbersusa.com/og-image.png',
      },
    },
    datePublished: guide.publishedAt,
    dateModified: guide.updatedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://lottonumbersusa.com/blog/guides/${guide.slug}`,
    },
    keywords: guide.keywords.join(', '),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <JsonLd data={articleSchema} />
      <JsonLd data={getBreadcrumbSchema([
        { name: 'Home', url: 'https://lottonumbersusa.com' },
        { name: 'Blog', url: 'https://lottonumbersusa.com/blog' },
        { name: 'Guides', url: 'https://lottonumbersusa.com/blog#guides' },
        { name: guide.title, url: `https://lottonumbersusa.com/blog/guides/${guide.slug}` },
      ])} />
      <JsonLd data={getFAQSchema(guide.faq)} />

      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-blue-600 transition-colors">Blog</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">{guide.category}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Article */}
        <article className="lg:col-span-8">
          <header className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                {guide.category}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {guide.readingMinutes} min read
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">·</span>
              <time className="text-xs text-gray-500 dark:text-gray-400" dateTime={guide.publishedAt}>
                Updated {new Date(guide.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </time>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight tracking-tight">
              {guide.title}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              {guide.excerpt}
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white text-xs font-bold">
                LN
              </div>
              <span>By {guide.author}</span>
            </div>
          </header>

          {/* Article body */}
          <div className="prose-content">
            {guide.sections.map(renderSection)}
          </div>

          {/* FAQ section */}
          {guide.faq && guide.faq.length > 0 && (
            <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Frequently asked questions</h2>
              <div className="space-y-3">
                {guide.faq.map((item, i) => (
                  <details key={i} className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <summary className="flex items-center justify-between cursor-pointer p-4 sm:p-5 font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors list-none">
                      <span>{item.question}</span>
                      <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <p className="px-4 sm:px-5 pb-4 sm:pb-5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Related games and tools */}
          {(guide.relatedGames || guide.relatedTools) && (
            <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Related on LottoNumbersUSA</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {guide.relatedGames?.map(game => (
                  <Link
                    key={game}
                    href={`/${game}`}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
                  >
                    <span className="text-blue-600 dark:text-blue-400">→</span>
                    <span className="text-gray-700 dark:text-gray-300 capitalize">
                      {game.replace(/-/g, ' ').replace(/\//g, ' · ')}
                    </span>
                  </Link>
                ))}
                {guide.relatedTools?.map(tool => (
                  <Link
                    key={tool}
                    href={tool}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
                  >
                    <span className="text-emerald-600 dark:text-emerald-400">→</span>
                    <span className="text-gray-700 dark:text-gray-300 capitalize">
                      {tool.replace(/^\//, '').replace(/-/g, ' ')}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Table of contents */}
          <div className="lg:sticky lg:top-24 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">In this guide</h3>
            <nav className="space-y-1.5">
              {guide.sections
                .filter((s): s is { type: 'heading'; level: 2; content: string; id?: string } => s.type === 'heading' && s.level === 2)
                .map((s, i) => (
                  <a
                    key={i}
                    href={`#${s.id}`}
                    className="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1 leading-snug"
                  >
                    {s.content}
                  </a>
                ))}
            </nav>
          </div>

          {/* Related guides */}
          {relatedGuides.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">More in {guide.category}</h3>
              <ul className="space-y-3">
                {relatedGuides.map(rg => (
                  <li key={rg.slug}>
                    <Link
                      href={`/blog/guides/${rg.slug}`}
                      className="block group"
                    >
                      <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                        {rg.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{rg.readingMinutes} min</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
