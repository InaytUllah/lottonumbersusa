'use client';

import { useState, useEffect } from 'react';

export default function LastUpdated({ drawDate }: { drawDate: string }) {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    function calculate() {
      const now = new Date();
      // Draw date is YYYY-MM-DD — the draw happened that evening
      const drawTime = new Date(drawDate + 'T23:00:00-05:00'); // ~11PM ET
      const diffMs = now.getTime() - drawTime.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 0) {
        setTimeAgo('Upcoming');
      } else if (diffMins < 60) {
        setTimeAgo(`${diffMins}m ago`);
      } else if (diffHours < 24) {
        setTimeAgo(`${diffHours}h ago`);
      } else if (diffDays === 1) {
        setTimeAgo('Yesterday');
      } else {
        setTimeAgo(`${diffDays}d ago`);
      }
    }

    calculate();
    const interval = setInterval(calculate, 60000);
    return () => clearInterval(interval);
  }, [drawDate]);

  if (!timeAgo) return null;

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
      Last updated: {timeAgo}
    </span>
  );
}
