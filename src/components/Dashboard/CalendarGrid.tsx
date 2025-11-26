'use client';

import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { CalendarDay } from './CalendarDay';

type ShiftType = 'I' | 'II' | 'III' | 'REST';

export type ScheduleItem = {
  date: string; // YYYY-MM-DD
  shiftType: ShiftType;
  isVacation: boolean;
  isOverride?: boolean;
};

type CalendarGridProps = {
  currentDate: Date;
  schedule: ScheduleItem[];
};

export function CalendarGrid({ currentDate, schedule }: CalendarGridProps) {
  // Calculate the days to display
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Helper to find schedule for a specific date
  const getScheduleForDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return schedule.find(s => s.date === dateString);
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
      {/* Weekday Headers */}
      <div className="mb-4 grid grid-cols-7 gap-2">
        {WEEKDAY_NAMES.map(day => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const scheduleItem = getScheduleForDate(day);
          const isCurrentMonth = isSameMonth(day, monthStart);

          return (
            <CalendarDay
              key={day.toISOString()}
              date={day}
              shiftType={scheduleItem?.shiftType || 'REST'}
              isVacation={scheduleItem?.isVacation || false}
              isOverride={scheduleItem?.isOverride || false}
              isCurrentMonth={isCurrentMonth}
            />
          );
        })}
      </div>
    </div>
  );
}
