'use client';

import { useState, useEffect } from 'react';

interface CountdownProps {
  targetDate: string; // YYYY-MM-DD
  drawTime: string; // e.g., "10:59 PM ET"
  label?: string;
}

export default function Countdown({ targetDate, drawTime, label = 'Next Draw' }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const calculateTarget = () => {
      // Parse draw time
      const timeMatch = drawTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!timeMatch) return new Date(targetDate + 'T23:59:00');

      let hours = parseInt(timeMatch[1]);
      const minutes = parseInt(timeMatch[2]);
      const ampm = timeMatch[3].toUpperCase();

      if (ampm === 'PM' && hours !== 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;

      const target = new Date(targetDate + 'T00:00:00');
      target.setHours(hours, minutes, 0, 0);
      return target;
    };

    const target = calculateTarget();

    const timer = setInterval(() => {
      const now = new Date();
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, drawTime]);

  if (!mounted) {
    return (
      <div className="text-center">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">{label}</p>
        <div className="flex items-center justify-center gap-2">
          {['--', '--', '--', '--'].map((val, i) => (
            <div key={i} className="text-center">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 min-w-[48px]">
                <span className="text-xl font-bold text-gray-900 dark:text-white font-mono">{val}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const units = [
    { value: timeLeft.days, label: 'Days' },
    { value: timeLeft.hours, label: 'Hrs' },
    { value: timeLeft.minutes, label: 'Min' },
    { value: timeLeft.seconds, label: 'Sec' },
  ];

  return (
    <div className="text-center">
      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{label}</p>
      <div className="flex items-center justify-center gap-2">
        {units.map((unit, i) => (
          <div key={i} className="text-center">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 min-w-[48px]">
              <span className="text-xl font-bold text-gray-900 dark:text-white font-mono">
                {String(unit.value).padStart(2, '0')}
              </span>
            </div>
            <span className="text-[10px] text-gray-400 uppercase mt-1 block">{unit.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
