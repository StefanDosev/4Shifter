'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export function MonthSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentMonth = Number(searchParams.get('month')) || new Date().getMonth() + 1;
  const currentYear = Number(searchParams.get('year')) || new Date().getFullYear();

  const date = new Date(currentYear, currentMonth - 1);

  const handleChange = (newDate: Date) => {
    const params = new URLSearchParams(searchParams);
    params.set('month', (newDate.getMonth() + 1).toString());
    params.set('year', newDate.getFullYear().toString());
    router.push(`?${params.toString()}`);
  };

  const handlePrevMonth = () => {
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() - 1);
    handleChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() + 1);
    handleChange(newDate);
  };

  const monthName = date.toLocaleString('default', { month: 'long' });

  return (
    <div className="flex items-center gap-4 rounded-xl border-2 border-black bg-white p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <button
        type="button"
        onClick={handlePrevMonth}
        className="rounded-lg p-2 hover:bg-slate-100 active:translate-y-0.5"
      >
        <ChevronLeft className="size-6" />
      </button>

      <div className="min-w-[140px] text-center">
        <span className="text-lg font-black">
          {monthName}
          {' '}
          {currentYear}
        </span>
      </div>

      <button
        type="button"
        onClick={handleNextMonth}
        className="rounded-lg p-2 hover:bg-slate-100 active:translate-y-0.5"
      >
        <ChevronRight className="size-6" />
      </button>
    </div>
  );
}
