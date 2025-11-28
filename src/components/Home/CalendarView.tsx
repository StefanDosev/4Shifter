'use client';

import type { ScheduleItem } from './CalendarGrid';
import { addMonths, format, subMonths } from 'date-fns';
import { useLocale } from 'next-intl';
import { useEffect, useState } from 'react';
import { updateDailyStats } from '@/actions/DailyStatsActions';
import { getMonthlySchedule } from '@/actions/ShiftActions';
import { CalendarGrid } from './CalendarGrid';
import { CalendarHeader } from './CalendarHeader';

import { DayDetailModal } from './DayDetailModal';

type CalendarViewProps = {
  initialSchedule: any[]; // Using any[] to avoid strict type matching issues with server response
};

export function CalendarView({ initialSchedule }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalDate, setModalDate] = useState<string | null>(null);
  const locale = useLocale();

  // Initialize with props
  useEffect(() => {
    const mapped = initialSchedule.map(d => ({
      date: d.date,
      shiftType: d.shift as any,
      isVacation: d.isVacation || false,
      isOverride: d.isOverride,
      nadure: d.nadure || 0,
      ure: d.ure || 0,
      isSickLeave: d.isSickLeave || false,
    }));
    setSchedule(mapped);
  }, []); // Run once on mount to set initial

  useEffect(() => {
    // Skip first fetch if we have initial data and date matches (optimization)
    // But for simplicity, let's just fetch when date changes.
    // Actually, we need to detect if it's the initial render.

    const fetchSchedule = async () => {
      setLoading(true);
      try {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;

        // If it's the current month and we have initialSchedule, maybe we could use it?
        // But simpler to just fetch or check if date matches initial.

        const data = await getMonthlySchedule(month, year);
        const mappedData = data.map(d => ({
          date: d.date,
          shiftType: d.shift as any,
          isVacation: d.isVacation || false,
          isOverride: d.isOverride,
        }));
        setSchedule(mappedData);
      } catch (error) {
        console.error('Failed to fetch schedule', error);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if currentDate is NOT the initial month (which we passed in)
    // OR just fetch always to be safe and consistent.
    // Let's fetch if the month/year is different from today (initial)
    const today = new Date();
    if (currentDate.getMonth() !== today.getMonth() || currentDate.getFullYear() !== today.getFullYear()) {
      fetchSchedule();
    } else {
      // It's the current month, ensure we have data (from initial)
      // We set it in the other useEffect, but that might race.
      // Let's just set it directly here if it's empty?
      if (schedule.length === 0 && initialSchedule.length > 0) {
        const mapped = initialSchedule.map(d => ({
          date: d.date,
          shiftType: d.shift as any,
          isVacation: d.isVacation || false,
          isOverride: d.isOverride,
          nadure: d.nadure || 0,
          ure: d.ure || 0,
          isSickLeave: d.isSickLeave || false,
        }));
        setSchedule(mapped);
      }
    }
  }, [currentDate, initialSchedule]);

  const handlePrevMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  const handleModalClose = () => {
    setModalDate(null);
    // Refresh the page to update stats cards
    window.location.reload();
  };

  const handleDayClick = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    setModalDate(dateStr);
  };

  const handleUpdateDay = async (date: string, updates: any) => {
    try {
      // Optimistic update
      setSchedule(prev => prev.map((item) => {
        if (item.date === date) {
          return { ...item, ...updates };
        }
        return item;
      }));

      // If item doesn't exist in schedule (e.g. empty day), add it
      if (!schedule.find(s => s.date === date)) {
        setSchedule(prev => [...prev, { date, shiftType: 'REST', isVacation: false, ...updates } as any]);
      }

      await updateDailyStats(date, updates);

      // Refresh data to ensure consistency
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const data = await getMonthlySchedule(month, year);
      const mappedData = data.map(d => ({
        date: d.date,
        shiftType: d.shift as any,
        isVacation: d.isVacation || false,
        isOverride: d.isOverride,
        nadure: d.nadure || 0,
        ure: d.ure || 0,
        isSickLeave: d.isSickLeave || false,
      }));
      setSchedule(mappedData);
    } catch (error) {
      console.error('Failed to update day', error);
      // Revert on error (could be improved)
    }
  };

  const getDayData = (dateStr: string) => {
    const item = schedule.find(s => s.date === dateStr);
    return {
      date: dateStr,
      nadure: (item as any)?.nadure || 0,
      ure: (item as any)?.ure || 0,
      isVacation: item?.isVacation || false,
      isSickLeave: (item as any)?.isSickLeave || false,
    };
  };

  return (
    <div className="space-y-6">
      <CalendarHeader
        currentDate={currentDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
      />

      <div className={`transition-opacity duration-200 ${loading ? 'opacity-50' : 'opacity-100'}`}>
        <CalendarGrid
          currentDate={currentDate}
          schedule={schedule}
          onDayClick={handleDayClick}
        />
      </div>

      {modalDate && (() => {
        const item = schedule.find(s => s.date === modalDate);
        return (
          <DayDetailModal
            isOpen={!!modalDate}
            onClose={handleModalClose}
            dateStr={modalDate}
            data={getDayData(modalDate)}
            onUpdate={handleUpdateDay}
            locale={locale}
            shiftType={(item?.shiftType as any) || 'REST'}
          />
        );
      })()}

      {/* Legend */}
      <div className="rounded-xl border-2 border-black bg-white p-4 shadow-neo">
        <h3 className="mb-3 text-sm font-bold tracking-wide text-gray-900 uppercase">Legend</h3>
        <div className="flex flex-wrap gap-3 text-xs font-bold">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full border-2 border-black bg-[#ffc900]" />
            <span>Morning (I)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full border-2 border-black bg-[#23a094]" />
            <span>Afternoon (II)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full border-2 border-black bg-[#b597f6]" />
            <span>Night (III)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full border-2 border-black bg-white" />
            <span>Rest / Off</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full border-2 border-black bg-[#90c6ff]" />
            <span>Vacation</span>
          </div>
        </div>
      </div>
    </div>
  );
}
