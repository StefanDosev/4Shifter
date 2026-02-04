'use client';

import type { ShiftGroup, TodayStats } from '@/utils/smartWidgetUtils';
import { addMonths, subMonths } from 'date-fns';
import { useLocale } from 'next-intl';
import { useMemo, useState } from 'react';
import { getMonthlyTotals } from '@/actions/DailyStatsActions';
import { getMonthlySchedule } from '@/actions/ShiftActions';
import { CalendarView } from './CalendarView';
import { SmartWidget } from './SmartWidget';
import { StatsBar } from './StatsBar';

type DashboardWrapperProps = {
  initialSchedule: any[];
  initialTotals: { totalNadure: number; totalUre: number };
  balances: {
    vacation: { used: number; total: number; remaining: number };
    flexTime: { used: number; total: number; remaining: number };
  };
  shiftGroup: ShiftGroup;
};

export function DashboardWrapper({
  initialSchedule,
  initialTotals,
  balances,
  shiftGroup,
}: DashboardWrapperProps) {
  const locale = useLocale();
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [schedule, setSchedule] = useState(initialSchedule);
  const [totals, setTotals] = useState(initialTotals);
  const [loading, setLoading] = useState(false);

  // Get today's stats for SmartWidget (reactive to schedule changes)
  const todayStats = useMemo<TodayStats | null>(() => {
    const today = new Date().toISOString().split('T')[0] ?? '';
    const todayItem = schedule.find((s: any) => s.date === today);
    if (!todayItem) {
      return null;
    }

    return {
      date: today,
      nadure: todayItem.nadure || 0,
      ure: todayItem.ure || 0,
      isVacation: todayItem.isVacation || false,
      isFlexTime: todayItem.isFlexTime || false,
      isSickLeave: todayItem.isSickLeave || false,
      workedShiftType: todayItem.workedShiftType || null,
    };
  }, [schedule]);

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
      {/* Smart Widget - Now reactive to schedule changes */}
      <SmartWidget
        schedule={schedule}
        todayStats={todayStats}
        shiftGroup={shiftGroup}
        locale={locale}
      />

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
        onScheduleUpdateAction={setSchedule}
        onStatsUpdateAction={setTotals}
      />
    </>
  );
}
