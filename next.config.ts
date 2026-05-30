import type { NextConfig } from 'next';

// Static export for Cloudflare Pages. Security headers were moved to
// `public/_headers` and the slug redirects to `public/_redirects` —
// next.config.ts no longer supports headers()/redirects() under
// output: 'export'. The www → non-www and *.vercel.app redirects are
// dropped (handled at the DNS/Cloudflare layer once migrated).
const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
