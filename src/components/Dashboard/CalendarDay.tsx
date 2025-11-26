'use client';

type ShiftType = 'I' | 'II' | 'III' | 'REST';

type CalendarDayProps = {
  date: Date;
  shiftType: ShiftType;
  isVacation: boolean;
  isOverride: boolean;
  isCurrentMonth: boolean;
  onClick?: () => void;
};

const SHIFT_STYLES = {
  I: 'bg-purple-100 border-purple-300 text-purple-900 hover:bg-purple-200',
  II: 'bg-green-100 border-green-300 text-green-900 hover:bg-green-200',
  III: 'bg-yellow-100 border-yellow-300 text-yellow-900 hover:bg-yellow-200',
  REST: 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100',
};

const VACATION_STYLE = 'bg-blue-100 border-blue-300 text-blue-900 hover:bg-blue-200';

export function CalendarDay({
  date,
  shiftType,
  isVacation,
  isOverride,
  isCurrentMonth,
  onClick,
}: CalendarDayProps) {
  const dayNumber = date.getDate();

  // Determine style based on state
  let styleClass = SHIFT_STYLES[shiftType] || SHIFT_STYLES.REST;
  if (isVacation) {
    styleClass = VACATION_STYLE;
  }

  // Fade out days not in current month
  const opacityClass = isCurrentMonth ? 'opacity-100' : 'opacity-40';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex h-24 w-full flex-col items-start justify-between rounded-lg border p-2 transition-all ${styleClass} ${opacityClass}`}
    >
      <span className="text-sm font-semibold">{dayNumber}</span>

      <div className="flex w-full flex-col items-end">
        <span className="text-xs font-bold uppercase">
          {isVacation ? 'VAC' : shiftType}
        </span>
        {isOverride && (
          <span className="text-[10px] font-medium text-red-600 italic">
            * Override
          </span>
        )}
      </div>
    </button>
  );
}
