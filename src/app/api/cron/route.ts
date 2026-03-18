import { NextResponse } from 'next/server';

// This cron endpoint triggers ISR revalidation for lottery results
// Vercel Cron calls this endpoint on schedule

export async function GET(request: Request) {
  // Verify cron secret (set in Vercel environment variables)
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Revalidate key pages
    const pagesToRevalidate = [
      '/',
      '/powerball',
      '/mega-millions',
      '/jackpot-tracker',
      '/number-frequency',
      '/blog',
    ];

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lottonumbersusa.com';

    const results = await Promise.allSettled(
      pagesToRevalidate.map(async (path) => {
        const res = await fetch(`${baseUrl}/api/revalidate?path=${encodeURIComponent(path)}&secret=${process.env.REVALIDATE_SECRET}`);
        return { path, status: res.status };
      })
    );

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      revalidated: results.map(r => r.status === 'fulfilled' ? r.value : { error: 'failed' }),
    });
  } catch (error) {
    console.error('Cron job failed:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
