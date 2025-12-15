'use client';

import { addMonths, subMonths } from 'date-fns';
import { useState } from 'react';
import { getMonthlySchedule } from '@/actions/ShiftActions';
import { CalendarView } from '@/components/Home/CalendarView';

type CalendarPageClientProps = {
  initialSchedule: any[];
  balances: {
    vacation: { used: number; total: number; remaining: number };
    flexTime: { used: number; total: number; remaining: number };
  };
};

export function CalendarPageClient({
  initialSchedule,
  balances,
}: CalendarPageClientProps) {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [schedule, setSchedule] = useState(initialSchedule);
  const [loading, setLoading] = useState(false);

  const fetchData = async (date: Date) => {
    setLoading(true);
    try {
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      const [newSchedule] = await Promise.all([
        getMonthlySchedule(month, year),
      ]);

      setSchedule(newSchedule);
    } catch (error) {
      console.error('Failed to fetch calendar data', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevMonth = () => {
    const newDate = subMonths(currentDate, 1);
    setCurrentDate(newDate);
    fetchData(newDate);
  };

  const handleNextMonth = () => {
    const newDate = addMonths(currentDate, 1);
    setCurrentDate(newDate);
    fetchData(newDate);
  };

  // Dummy handler for stats update since we don't display stats bar here
  const handleStatsUpdate = () => {};

  return (
    <CalendarView
      currentDate={currentDate}
      schedule={schedule}
      loading={loading}
      onPrevMonthAction={handlePrevMonth}
      onNextMonthAction={handleNextMonth}
      vacationBalance={balances.vacation}
      flexTimeBalance={balances.flexTime}
      onScheduleUpdateAction={setSchedule}
      onStatsUpdateAction={handleStatsUpdate}
    />
  );
}
