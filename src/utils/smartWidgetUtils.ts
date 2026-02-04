/**
 * SmartWidget Context Utilities
 *
 * Determines the appropriate context and display information for the SmartWidget
 * based on the user's current shift situation.
 */

import { calculateShift } from './ShiftCalculator';

// Types
export type ShiftType = 'I' | 'II' | 'III' | 'REST';
export type ShiftGroup = 'A' | 'B' | 'C' | 'D';

export type SmartWidgetContext
  = | 'NORMAL_WORKDAY' // Inside work block, not last day
    | 'LAST_WORKDAY' // Last day before OFF
    | 'OFF_DAY' // Single day off
    | 'MULTIPLE_OFF' // 2+ consecutive OFF days
    | 'VACATION' // User marked dopust
    | 'FLEX_TIME' // User using flex time
    | 'EXTRA_WORK' // Worked on normally OFF day (has nadure/ure)
    | 'NIGHT_SHIFT'; // Night shift (special handling)

export type TodayStats = {
  date: string;
  nadure: number;
  ure: number;
  isVacation: boolean;
  isFlexTime: boolean;
  isSickLeave: boolean;
  workedShiftType?: ShiftType | null;
};

export type ScheduleDay = {
  date: string;
  shift: ShiftType;
  isVacation?: boolean;
  isFlexTime?: boolean;
  nadure?: number;
  ure?: number;
};

export type WorkCycleProgress = {
  currentDay: number; // 1-indexed
  totalDays: number; // Total consecutive work days in this block
};

export type NextShiftInfo = {
  shiftType: ShiftType;
  date: Date;
  dayName: string; // e.g., 'ponedeljek', 'jutri'
  times: string; // e.g., '06:00–14:00'
};

export type SmartWidgetData = {
  context: SmartWidgetContext;
  currentShift: ShiftType;
  shiftLabel: string;
  shiftTimes: string;
  workCycle?: WorkCycleProgress;
  daysUntilOff?: number;
  consecutiveOffDays?: number;
  nextShift?: NextShiftInfo;
  extraWorkType?: 'nadure' | 'ure' | 'both';
};

const SHIFT_TIMES: Record<ShiftType, string> = {
  I: '06:00–14:00',
  II: '14:00–22:00',
  III: '22:00–06:00',
  REST: '-',
};

/**
 * Get the number of consecutive work days (non-REST) starting from a given date
 */
function getConsecutiveWorkDays(
  startDate: Date,
  shiftGroup: ShiftGroup,
  direction: 'forward' | 'backward',
): number {
  let count = 0;
  const date = new Date(startDate);
  const maxDays = 10; // Safety limit

  for (let i = 0; i < maxDays; i++) {
    const result = calculateShift(date, shiftGroup);
    if (result.shiftType === 'REST') {
      break;
    }
    count++;
    if (direction === 'forward') {
      date.setDate(date.getDate() + 1);
    } else {
      date.setDate(date.getDate() - 1);
    }
  }

  return count;
}

/**
 * Get consecutive OFF days starting from today
 */
export function getConsecutiveOffDays(
  today: Date,
  shiftGroup: ShiftGroup,
  schedule: ScheduleDay[],
): number {
  let count = 0;
  const date = new Date(today);
  const maxDays = 10;

  for (let i = 0; i < maxDays; i++) {
    const dateStr = date.toISOString().split('T')[0];
    const scheduleItem = schedule.find(s => s.date === dateStr);

    // Check if it's vacation or flex time (overrides base shift)
    if (scheduleItem?.isVacation || scheduleItem?.isFlexTime) {
      count++;
      date.setDate(date.getDate() + 1);
      continue;
    }

    const result = calculateShift(date, shiftGroup);
    if (result.shiftType !== 'REST') {
      break;
    }
    count++;
    date.setDate(date.getDate() + 1);
  }

  return count;
}

/**
 * Get the next working shift info after today
 */
export function getNextShiftInfo(
  today: Date,
  shiftGroup: ShiftGroup,
  schedule: ScheduleDay[],
  locale: string,
): NextShiftInfo | null {
  const date = new Date(today);
  date.setDate(date.getDate() + 1); // Start from tomorrow
  const maxDays = 10;

  const dayNames: Record<string, string[]> = {
    sl: ['nedelja', 'ponedeljek', 'torek', 'sreda', 'četrtek', 'petek', 'sobota'],
    en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  };

  for (let i = 0; i < maxDays; i++) {
    const dateStr = date.toISOString().split('T')[0];
    const scheduleItem = schedule.find(s => s.date === dateStr);

    // Skip vacation/flex days
    if (scheduleItem?.isVacation || scheduleItem?.isFlexTime) {
      date.setDate(date.getDate() + 1);
      continue;
    }

    const result = calculateShift(date, shiftGroup);
    if (result.shiftType !== 'REST') {
      const isTomorrow = i === 0;
      const days = dayNames[locale] || dayNames.en;
      const dayIndex = date.getDay();

      return {
        shiftType: result.shiftType,
        date: new Date(date),
        dayName: isTomorrow ? (locale === 'sl' ? 'jutri' : 'tomorrow') : (days?.[dayIndex] ?? ''),
        times: SHIFT_TIMES[result.shiftType],
      };
    }
    date.setDate(date.getDate() + 1);
  }

  return null;
}

/**
 * Calculate work cycle progress (Day X / Y)
 */
export function getWorkCycleProgress(
  today: Date,
  shiftGroup: ShiftGroup,
): WorkCycleProgress {
  // Count backwards to find start of work block
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const daysBefore = getConsecutiveWorkDays(yesterday, shiftGroup, 'backward');

  // Count forwards to find end of work block (excluding today)
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const daysAfter = getConsecutiveWorkDays(tomorrow, shiftGroup, 'forward');

  // Current day is 1-indexed position in the work block
  const currentDay = daysBefore + 1;
  const totalDays = daysBefore + 1 + daysAfter;

  return { currentDay, totalDays };
}

/**
 * Calculate days until next REST day
 */
export function getDaysUntilOff(
  today: Date,
  shiftGroup: ShiftGroup,
  schedule: ScheduleDay[],
): number {
  const date = new Date(today);
  date.setDate(date.getDate() + 1); // Start from tomorrow
  const maxDays = 10;

  for (let i = 1; i <= maxDays; i++) {
    const dateStr = date.toISOString().split('T')[0];
    const scheduleItem = schedule.find(s => s.date === dateStr);

    // Vacation/flex count as off
    if (scheduleItem?.isVacation || scheduleItem?.isFlexTime) {
      return i;
    }

    const result = calculateShift(date, shiftGroup);
    if (result.shiftType === 'REST') {
      return i;
    }
    date.setDate(date.getDate() + 1);
  }

  return maxDays;
}

/**
 * Main function: Determine SmartWidget context and gather all relevant data
 */
export function getSmartWidgetData(
  today: Date,
  shiftGroup: ShiftGroup,
  schedule: ScheduleDay[],
  todayStats: TodayStats | null,
  locale: string,
): SmartWidgetData {
  const todayStr = today.toISOString().split('T')[0];
  const scheduleItem = schedule.find(s => s.date === todayStr);
  const baseShift = calculateShift(today, shiftGroup);
  const currentShift = baseShift.shiftType;

  // Check for user overrides first (priority order)

  // 1. Vacation
  if (todayStats?.isVacation || scheduleItem?.isVacation) {
    return {
      context: 'VACATION',
      currentShift: 'REST',
      shiftLabel: locale === 'sl' ? 'Dopust' : 'Vacation',
      shiftTimes: '-',
      nextShift: getNextShiftInfo(today, shiftGroup, schedule, locale) || undefined,
    };
  }

  // 2. Flex Time
  if (todayStats?.isFlexTime || scheduleItem?.isFlexTime) {
    return {
      context: 'FLEX_TIME',
      currentShift: 'REST',
      shiftLabel: locale === 'sl' ? 'Fleksi dan' : 'Flex Day',
      shiftTimes: '-',
    };
  }

  // 3. Extra work on REST day
  if (currentShift === 'REST') {
    const hasExtraWork = (todayStats?.nadure || 0) > 0 || (todayStats?.ure || 0) > 0;
    if (hasExtraWork) {
      let extraType: 'nadure' | 'ure' | 'both' = 'both';
      if ((todayStats?.nadure || 0) > 0 && (todayStats?.ure || 0) === 0) {
        extraType = 'nadure';
      } else if ((todayStats?.ure || 0) > 0 && (todayStats?.nadure || 0) === 0) {
        extraType = 'ure';
      }

      return {
        context: 'EXTRA_WORK',
        currentShift: 'REST',
        shiftLabel: locale === 'sl' ? 'Extra delo' : 'Extra Work',
        shiftTimes: '-',
        extraWorkType: extraType,
      };
    }

    // Check for multiple consecutive OFF days
    const consecutiveOff = getConsecutiveOffDays(today, shiftGroup, schedule);
    if (consecutiveOff > 1) {
      return {
        context: 'MULTIPLE_OFF',
        currentShift: 'REST',
        shiftLabel: locale === 'sl' ? 'Prosti dnevi' : 'Days Off',
        shiftTimes: '-',
        consecutiveOffDays: consecutiveOff,
        nextShift: getNextShiftInfo(today, shiftGroup, schedule, locale) || undefined,
      };
    }

    // Single OFF day
    return {
      context: 'OFF_DAY',
      currentShift: 'REST',
      shiftLabel: locale === 'sl' ? 'Danes si prost' : 'You\'re off today',
      shiftTimes: '-',
      nextShift: getNextShiftInfo(today, shiftGroup, schedule, locale) || undefined,
    };
  }

  // Working day scenarios
  const daysUntilOff = getDaysUntilOff(today, shiftGroup, schedule);
  const workCycle = getWorkCycleProgress(today, shiftGroup);
  const isNightShift = currentShift === 'III';
  const isLastWorkday = daysUntilOff === 1;

  const shiftLabels: Record<string, Record<ShiftType, string>> = {
    sl: { I: 'Jutranja', II: 'Popoldanska', III: 'Nočna', REST: 'Prosto' },
    en: { I: 'Morning', II: 'Afternoon', III: 'Night', REST: 'Off' },
  };
  const labels = shiftLabels[locale] || shiftLabels.en;

  // Night shift (could also be last workday)
  if (isNightShift) {
    return {
      context: isLastWorkday ? 'LAST_WORKDAY' : 'NIGHT_SHIFT',
      currentShift,
      shiftLabel: labels?.[currentShift] ?? currentShift,
      shiftTimes: SHIFT_TIMES[currentShift],
      workCycle,
      daysUntilOff,
    };
  }

  // Last workday before OFF
  if (isLastWorkday) {
    return {
      context: 'LAST_WORKDAY',
      currentShift,
      shiftLabel: labels?.[currentShift] ?? currentShift,
      shiftTimes: SHIFT_TIMES[currentShift],
      workCycle,
      daysUntilOff: 1,
    };
  }

  // Normal workday
  return {
    context: 'NORMAL_WORKDAY',
    currentShift,
    shiftLabel: labels?.[currentShift] ?? currentShift,
    shiftTimes: SHIFT_TIMES[currentShift],
    workCycle,
    daysUntilOff,
  };
}
