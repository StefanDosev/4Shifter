'use client';

import { addMonths, subMonths } from 'date-fns';
import { useState } from 'react';
import { getMonthlyTotals } from '@/actions/DailyStatsActions';
import { getMonthlySchedule } from '@/actions/ShiftActions';
import { CalendarView } from './CalendarView';
import { StatsBar } from './StatsBar';

type DashboardWrapperProps = {
  initialSchedule: any[];
  initialTotals: { totalNadure: number; totalUre: number };
  balances: {
    vacation: { used: number; total: number; remaining: number };
    flexTime: { used: number; total: number; remaining: number };
  };
};

export function DashboardWrapper({
  initialSchedule,
  initialTotals,
  balances,
}: DashboardWrapperProps) {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [schedule, setSchedule] = useState(initialSchedule);
  const [totals, setTotals] = useState(initialTotals);
  const [loading, setLoading] = useState(false);

  const fetchData = async (date: Date) => {
    setLoading(true);
    try {
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      const [newSchedule, newTotals] = await Promise.all([
        getMonthlySchedule(month, year),
        getMonthlyTotals(month, year),
      ]);

      setSchedule(newSchedule);
      setTotals(newTotals);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
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

  return (
    <>
      {/* Stats Bar - Dynamic based on current month */}
      <StatsBar
        nadureTotal={totals.totalNadure}
        ureTotal={totals.totalUre}
        vacationBalance={balances.vacation}
        flexTimeBalance={balances.flexTime}
      />

      {/* Calendar View - Controlled */}
      <CalendarView
        currentDate={currentDate}
        schedule={schedule}
        loading={loading}
        onPrevMonthAction={handlePrevMonth}
        onNextMonthAction={handleNextMonth}
        vacationBalance={balances.vacation}
        flexTimeBalance={balances.flexTime}
        onScheduleUpdateAction={setSchedule} // Allow CalendarView to update schedule (e.g. after modal edit)
        onStatsUpdateAction={setTotals} // Allow CalendarView to update stats (e.g. after modal edit)
      />
    </>
  );
}
