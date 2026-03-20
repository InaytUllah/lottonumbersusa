import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// This cron endpoint triggers ISR revalidation for lottery results
// Vercel Cron calls this endpoint on schedule

export async function GET(request: Request) {
  // Verify cron secret (set in Vercel environment variables)
  // Only check if CRON_SECRET is actually configured
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
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

    for (const path of pagesToRevalidate) {
      revalidatePath(path, 'layout');
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      revalidated: pagesToRevalidate,
    });
  } catch (error) {
    console.error('Cron job failed:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
