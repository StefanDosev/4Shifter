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
import { useTranslations } from 'next-intl';
import { CalendarDay } from './CalendarDay';

type ShiftType = 'I' | 'II' | 'III' | 'REST';

export type ScheduleItem = {
  date: string; // YYYY-MM-DD
  shiftType: ShiftType;
  isVacation: boolean;
  isSickLeave?: boolean;
  isFlexTime?: boolean;
  isHoliday?: boolean;
  isWorkingHoliday?: boolean;
  holidayName?: string | null;
  nadure?: number;
  ure?: number;
  workedShiftType?: 'I' | 'II' | 'III' | 'REST';
  isOverride?: boolean;
};

type CalendarGridProps = {
  currentDate: Date;
  schedule: ScheduleItem[];
  onDayClickAction?: (date: Date) => void;
};

export function CalendarGrid({ currentDate, schedule, onDayClickAction }: CalendarGridProps) {
  // Calculate the days to display
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  // Use Monday as the first day of week (European calendar)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const t = useTranslations('Calendar');
  const WEEKDAY_NAMES = [t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat'), t('sun')];

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

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
              isWorkingHoliday={scheduleItem?.isWorkingHoliday || false}
              holidayName={scheduleItem?.holidayName}
              nadure={scheduleItem?.nadure || 0}
              ure={scheduleItem?.ure || 0}
              workedShiftType={scheduleItem?.workedShiftType} // Added workedShiftType
              isOverride={scheduleItem?.isOverride || false}
              isCurrentMonth={isCurrentMonth}
              onClickAction={() => onDayClickAction?.(day)}
            />
          );
        })}
      </div>
    </div>
  );
}
