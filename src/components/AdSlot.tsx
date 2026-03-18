'use client';

import { useEffect, useRef } from 'react';

interface AdSlotProps {
  slot: string; // Your AdSense ad slot ID
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  responsive?: boolean;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: Record<string, unknown>[];
  }
}

export default function AdSlot({
  slot,
  format = 'auto',
  responsive = true,
  className = '',
}: AdSlotProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch {
      // Ad blocker or AdSense not loaded
    }
  }, []);

  // Don't render in development
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className={`bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center p-4 ${className}`}>
        <span className="text-sm text-gray-400">Ad Slot: {slot || 'Configure in AdSense'}</span>
      </div>
    );
  }

  return (
    <div ref={adRef} className={`ad-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || ''}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}
