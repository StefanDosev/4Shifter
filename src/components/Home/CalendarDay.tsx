'use client';

import { Briefcase, Palmtree, Pill, Sun } from 'lucide-react';
import { SHIFT_COLORS } from './constants';

type ShiftType = 'I' | 'II' | 'III' | 'REST';

type CalendarDayProps = {
  date: Date;
  shiftType: ShiftType;
  isVacation: boolean;
  isSickLeave?: boolean;
  isFlexTime?: boolean;
  isHoliday?: boolean;
  holidayName?: string | null;
  nadure?: number;
  ure?: number;
  workedShiftType?: ShiftType;
  isOverride: boolean;
  isCurrentMonth: boolean;
  onClickAction?: () => void;
};

const VACATION_COLOR = 'bg-[#90c6ff]'; // neo-blue
const SICK_COLOR = 'bg-red-300';
const FLEX_TIME_COLOR = 'bg-purple-200';
const HOLIDAY_COLOR = 'bg-pink-200';

export function CalendarDay({
  date,
  shiftType,
  isVacation,
  isSickLeave = false,
  isFlexTime = false,
  isHoliday = false,
  holidayName,
  nadure = 0,
  ure = 0,
  workedShiftType,
  isOverride,
  isCurrentMonth,
  onClickAction,
}: CalendarDayProps) {
  const dayNumber = date.getDate();
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();

  // Determine background color - priority: sick > vacation > overtime > shift
  let bgClass: string = SHIFT_COLORS[shiftType] || SHIFT_COLORS.REST;

  if (nadure > 0 || ure > 0) {
    // If there's overtime, use a highlighted background
    bgClass = 'bg-[#fff5e6]'; // Light orange/cream for days with overtime
  }

  if (isVacation) {
    bgClass = VACATION_COLOR;
  }

  if (isFlexTime) {
    bgClass = FLEX_TIME_COLOR;
  }

  if (isSickLeave) {
    bgClass = SICK_COLOR;
  }

  if (isHoliday) {
    bgClass = HOLIDAY_COLOR;
  }

  // Opacity for non-current month days
  const opacityClass = isCurrentMonth ? 'opacity-100' : 'opacity-40';

  return (
    <button
      type="button"
      onClick={onClickAction}
      className={`
        relative flex aspect-4/5 w-full flex-col justify-between rounded-xl border-2 border-black p-1 transition-all hover:-translate-y-1 hover:shadow-neo-hover sm:aspect-square sm:p-2
        ${bgClass} ${opacityClass}
        ${isToday ? 'ring-4 ring-black ring-offset-2' : ''}
      `}
    >
      <div className="flex w-full items-start justify-between">
        <span className={`text-sm font-bold ${shiftType === 'REST' ? 'text-gray-400' : 'text-black'}`}>
          {dayNumber}
        </span>
        {workedShiftType && (
          <span className="rounded border border-black bg-green-400 px-1 text-[10px] font-black shadow-sm">
            {workedShiftType}
          </span>
        )}
        {!workedShiftType && shiftType !== 'REST' && !isVacation && !isSickLeave && !isFlexTime && !isHoliday && (
          <span className="rounded border border-black bg-white px-1 text-[10px] font-black">
            {shiftType}
          </span>
        )}
      </div>

      <div className="flex w-full flex-col items-start gap-1">
        {/* Indicators for data */}
        {nadure > 0 && (
          <span className="flex items-center gap-1 rounded-sm border border-black bg-white px-1 text-[10px] font-bold shadow-sm">
            +
            {nadure}
            {' '}
            <Sun size={8} />
          </span>
        )}
        {ure > 0 && (
          <span className="flex items-center gap-1 rounded-sm border border-black bg-black px-1 text-[10px] font-bold text-white shadow-sm">
            +
            {ure}
            {' '}
            <Briefcase size={8} />
          </span>
        )}
        {isVacation && <Palmtree size={16} className="mx-auto text-black" />}
        {isSickLeave && <Pill size={16} className="mx-auto text-black" />}
        {isFlexTime && <span className="mx-auto text-[10px] font-bold">FLEX</span>}
        {isHoliday && (
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold">HOL</span>
            {holidayName && (
              <span className="text-center text-[8px] leading-tight">
                {holidayName.substring(0, 8)}
                ...
              </span>
            )}
          </div>
        )}
        {isOverride && (
          <span className="rounded-sm border border-black bg-red-500 px-1 text-[10px] font-bold text-white">
            *
          </span>
        )}
      </div>
    </button>
  );
}
