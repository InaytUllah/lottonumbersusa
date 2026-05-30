import { MetadataRoute } from 'next';

// Required under output: 'export' so robots.txt is emitted as a static file.
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/private/'],
      },
    ],
    sitemap: 'https://lottonumbersusa.com/sitemap.xml',
  };
}
