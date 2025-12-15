'use client';

import { format } from 'date-fns';
import { useLocale } from 'next-intl';
import { useState } from 'react';
import { getMonthlyTotals, updateDailyStats } from '@/actions/DailyStatsActions';
import { getMonthlySchedule } from '@/actions/ShiftActions';
import { getHolidayName, isHoliday } from '@/utils/HolidayConfig';
import { CalendarGrid } from './CalendarGrid';

import { CalendarHeader } from './CalendarHeader';
import { DayDetailModal } from './DayDetailModal';

type CalendarViewProps = {
  currentDate: Date;
  schedule: any[];
  loading: boolean;
  onPrevMonthAction: () => void;
  onNextMonthAction: () => void;
  vacationBalance: { used: number; total: number; remaining: number };
  flexTimeBalance: { used: number; total: number; remaining: number };
  onScheduleUpdateAction: (schedule: any[]) => void;
  onStatsUpdateAction: (totals: { totalNadure: number; totalUre: number }) => void;
};

export function CalendarView({
  currentDate,
  schedule,
  loading,
  onPrevMonthAction,
  onNextMonthAction,
  vacationBalance,
  flexTimeBalance,
  onScheduleUpdateAction,
  onStatsUpdateAction,
}: CalendarViewProps) {
  const [modalDate, setModalDate] = useState<string | null>(null);
  const locale = useLocale();
  // Map raw schedule to CalendarGrid format
  const mappedSchedule = schedule.map(d => ({
    date: d.date,
    shiftType: d.shift as any,
    isVacation: d.isVacation || false,
    isFlexTime: d.isFlexTime || false,
    isHoliday: d.isHoliday || isHoliday(new Date(d.date)),
    holidayName: d.isHoliday || isHoliday(new Date(d.date)) ? getHolidayName(new Date(d.date), locale as any) : null,
    isOverride: d.isOverride,
    nadure: d.nadure || 0,
    ure: d.ure || 0,
    isSickLeave: d.isSickLeave || false,
    workedShiftType: d.workedShiftType,
  }));

  const handleModalClose = () => {
    setModalDate(null);
  };

  const handleDayClick = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    setModalDate(dateStr);
  };

  const handleUpdateDay = async (date: string, updates: any) => {
    try {
      // Optimistic update for local state
      const updatedSchedule = schedule.map((item) => {
        if (item.date === date) {
          return { ...item, ...updates };
        }
        return item;
      });

      // If item doesn't exist in schedule (e.g. empty day), add it
      if (!schedule.find(s => s.date === date)) {
        updatedSchedule.push({ date, shift: 'REST', isVacation: false, ...updates });
      }

      onScheduleUpdateAction(updatedSchedule);

      await updateDailyStats(date, updates);

      // Refresh data to ensure consistency (especially stats)
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const [newSchedule, newTotals] = await Promise.all([
        getMonthlySchedule(month, year),
        getMonthlyTotals(month, year),
      ]);

      onScheduleUpdateAction(newSchedule);
      onStatsUpdateAction(newTotals);
    } catch (error) {
      console.error('Failed to update day', error);
      // Revert on error (could be improved)
    }
  };

  const getDayData = (dateStr: string) => {
    const item = mappedSchedule.find(s => s.date === dateStr);
    return {
      date: dateStr,
      nadure: (item as any)?.nadure || 0,
      ure: (item as any)?.ure || 0,
      isVacation: item?.isVacation || false,
      isFlexTime: (item as any)?.isFlexTime || false,
      isHoliday: (item as any)?.isHoliday || isHoliday(new Date(dateStr)),
      isSickLeave: (item as any)?.isSickLeave || false,
      workedShiftType: (item as any)?.workedShiftType,
    };
  };

  return (
    <div className="space-y-6">
      <CalendarHeader
        currentDate={currentDate}
        onPrevMonth={onPrevMonthAction}
        onNextMonth={onNextMonthAction}
      />

      <div className={`transition-opacity duration-200 ${loading ? 'opacity-50' : 'opacity-100'}`}>
        <CalendarGrid
          currentDate={currentDate}
          schedule={mappedSchedule}
          onDayClick={handleDayClick}
        />
      </div>

      {modalDate && (() => {
        const item = mappedSchedule.find(s => s.date === modalDate);
        return (
          <DayDetailModal
            isOpen={!!modalDate}
            onClose={handleModalClose}
            dateStr={modalDate}
            data={getDayData(modalDate)}
            onUpdate={handleUpdateDay}
            locale={locale}
            shiftType={(item?.shiftType as any) || 'REST'}
            vacationBalance={vacationBalance}
            flexTimeBalance={flexTimeBalance}
          />
        );
      })()}

      {/* Legend */}
      <div className="rounded-xl border-2 border-black bg-white p-4 shadow-neo">
        <h3 className="mb-3 text-sm font-bold tracking-wide text-gray-900 uppercase">Legend</h3>
        <div className="flex flex-wrap gap-3 text-xs font-bold">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full border-2 border-black bg-neo-yellow" />
            <span>Morning (I)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full border-2 border-black bg-neo-cyan" />
            <span>Afternoon (II)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full border-2 border-black bg-neo-violet" />
            <span>Night (III)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full border-2 border-black bg-white" />
            <span>Rest / Off</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full border-2 border-black bg-neo-blue" />
            <span>Vacation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full border-2 border-black bg-purple-200" />
            <span>Flex Time</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full border-2 border-black bg-pink-200" />
            <span>Holiday</span>
          </div>
        </div>
      </div>
    </div>
  );
}
