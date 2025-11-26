'use client';

import type { ScheduleItem } from './CalendarGrid';
import { addMonths, subMonths } from 'date-fns';
import { useEffect, useState } from 'react';
import { getMonthlySchedule } from '@/actions/ShiftActions';
import { CalendarGrid } from './CalendarGrid';
import { CalendarHeader } from './CalendarHeader';

type CalendarViewProps = {
  initialSchedule: any[]; // Using any[] to avoid strict type matching issues with server response
};

export function CalendarView({ initialSchedule }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Initialize with props
  useEffect(() => {
    const mapped = initialSchedule.map(d => ({
      date: d.date,
      shiftType: d.shift as any,
      isVacation: d.isVacation || false,
      isOverride: d.isOverride,
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
        />
      </div>

      {/* Legend */}
      <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-900/5">
        <h3 className="mb-3 text-sm font-semibold text-gray-900">Legend</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded border border-purple-300 bg-purple-100" />
            <span className="text-xs text-gray-600">First Shift (I)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded border border-green-300 bg-green-100" />
            <span className="text-xs text-gray-600">Second Shift (II)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded border border-yellow-300 bg-yellow-100" />
            <span className="text-xs text-gray-600">Night Shift (III)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded border border-gray-200 bg-gray-50" />
            <span className="text-xs text-gray-600">Rest / Off</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded border border-blue-300 bg-blue-100" />
            <span className="text-xs text-gray-600">Vacation</span>
          </div>
        </div>
      </div>
    </div>
  );
}
