'use client';

import { useTranslations } from 'next-intl';

type CalendarHeaderProps = {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
};

export function CalendarHeader({ currentDate, onPrevMonth, onNextMonth }: CalendarHeaderProps) {
  const t = useTranslations('Calendar');
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  return (
    <div className="mb-6 flex items-center justify-between">
      <h2 className="text-2xl font-bold text-gray-800">
        {monthName}
        {' '}
        {year}
      </h2>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onPrevMonth}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
        >
          ←
          {' '}
          {t('previous')}
        </button>
        <button
          type="button"
          onClick={onNextMonth}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
        >
          {t('next')}
          {' '}
          →
        </button>
      </div>
    </div>
  );
}
