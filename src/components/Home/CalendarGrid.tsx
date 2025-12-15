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
  isSickLeave?: boolean;
  isFlexTime?: boolean;
  isHoliday?: boolean;
  holidayName?: string | null;
  nadure?: number;
  ure?: number;
  workedShiftType?: 'I' | 'II' | 'III' | 'REST';
  isOverride?: boolean;
};

type CalendarGridProps = {
  currentDate: Date;
  schedule: ScheduleItem[];
  onDayClick?: (date: Date) => void;
};

export function CalendarGrid({ currentDate, schedule, onDayClick }: CalendarGridProps) {
  // Calculate the days to display
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const WEEKDAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Helper to find schedule for a specific date
  const getScheduleForDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return schedule.find(s => s.date === dateString);
  };

  return (
    <div className="rounded-xl border-2 border-black bg-white p-4 shadow-neo sm:p-6">
      {/* Weekday Headers */}
      <div className="mb-2 grid grid-cols-7 gap-2 sm:mb-4">
        {WEEKDAY_NAMES.map(day => (
          <div
            key={day}
            className="text-center text-xs font-bold text-gray-400 uppercase sm:text-sm"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-2 sm:gap-4">
        {days.map((day) => {
          const scheduleItem = getScheduleForDate(day);
          const isCurrentMonth = isSameMonth(day, monthStart);

          return (
            <CalendarDay
              key={day.toISOString()}
              date={day}
              shiftType={scheduleItem?.shiftType || 'REST'}
              isVacation={scheduleItem?.isVacation || false}
              isSickLeave={scheduleItem?.isSickLeave || false}
              isFlexTime={scheduleItem?.isFlexTime || false}
              isHoliday={scheduleItem?.isHoliday || false}
              holidayName={scheduleItem?.holidayName}
              nadure={scheduleItem?.nadure || 0}
              ure={scheduleItem?.ure || 0}
              workedShiftType={scheduleItem?.workedShiftType} // Added workedShiftType
              isOverride={scheduleItem?.isOverride || false}
              isCurrentMonth={isCurrentMonth}
              onClickAction={() => onDayClick?.(day)}
            />
          );
        })}
      </div>
    </div>
  );
}
