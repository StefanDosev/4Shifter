'use client';

import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';

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
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="flex items-center gap-2 text-2xl font-black sm:text-3xl">
        <Calendar className="mt-1" size={28} />
        {monthName}
        {' '}
        {year}
      </h2>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" onClick={onPrevMonth}>
          <ChevronLeft size={18} />
          <span className="hidden sm:inline">{t('previous')}</span>
        </Button>
        <Button variant="secondary" size="sm" onClick={onNextMonth}>
          <span className="hidden sm:inline">{t('next')}</span>
          <ChevronRight size={18} />
        </Button>
      </div>
    </div>
  );
}
