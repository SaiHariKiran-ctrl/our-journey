'use client';

import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

interface DaysCounterProps {
  startDate: string; // Format: YYYY-MM-DD
}

export default function DaysCounter({ startDate }: DaysCounterProps) {
  const [days, setDays] = useState<number>(0);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    
    const start = dayjs(startDate);
    const today = dayjs();
    const daysDiff = today.diff(start, 'day');
    
    setDays(daysDiff);
    
    const tomorrow = today.add(1, 'day').startOf('day');
    const msUntilMidnight = tomorrow.diff(today);
    
    const timer = setTimeout(() => {
      setDays(days + 1);
    }, msUntilMidnight);
    
    return () => clearTimeout(timer);
  }, [startDate, days]);

  if (!mounted) return null;

  return (
    <div className="bg-white bg-opacity-20 py-2 px-4 rounded-full backdrop-blur-sm">
      <div className="flex items-center">
        <div className="mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <span className="font-bold">{days}</span> days together
        </div>
      </div>
    </div>
  );
}