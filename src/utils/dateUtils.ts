import type { ShiftGroup, ShiftType } from '@/types';
import { eachDayOfInterval, endOfMonth, format, startOfMonth } from 'date-fns';

export function getMonthDays(date: Date): Date[] {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return eachDayOfInterval({ start, end });
}

export function formatDateKey(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function getShiftForDate(date: Date, group: ShiftGroup): ShiftType {
  const SHIFT_EPOCH = new Date('2024-01-01T00:00:00');
  // Cycle: I, I, II, II, III, III, REST, REST
  const SHIFT_CYCLE: ShiftType[] = ['I', 'I', 'II', 'II', 'III', 'III', 'REST', 'REST'];

  const GROUP_OFFSETS: Record<ShiftGroup, number> = {
    A: 0,
    B: 2,
    C: 4,
    D: 6,
  };

  const offset = GROUP_OFFSETS[group];

  // Calculate days from epoch
  // Use UTC to avoid DST issues when calculating day difference
  const utcDate = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const utcEpoch = Date.UTC(SHIFT_EPOCH.getFullYear(), SHIFT_EPOCH.getMonth(), SHIFT_EPOCH.getDate());

  const msPerDay = 1000 * 60 * 60 * 24;
  const daysSinceEpoch = Math.floor((utcDate - utcEpoch) / msPerDay);

  // Handle negative days (dates before epoch)
  let adjustedDay = (daysSinceEpoch + offset) % 8;
  if (adjustedDay < 0) {
    adjustedDay += 8;
  }

  return SHIFT_CYCLE[adjustedDay] || 'REST';
}

export function calculateNextOff(currentDate: Date, group: ShiftGroup): number {
  const SHIFT_EPOCH = new Date('2024-01-01T00:00:00');
  const SHIFT_CYCLE: ShiftType[] = ['I', 'I', 'II', 'II', 'III', 'III', 'REST', 'REST'];

  const GROUP_OFFSETS: Record<ShiftGroup, number> = {
    A: 0,
    B: 2,
    C: 4,
    D: 6,
  };

  const offset = GROUP_OFFSETS[group];

  const utcDate = Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
  const utcEpoch = Date.UTC(SHIFT_EPOCH.getFullYear(), SHIFT_EPOCH.getMonth(), SHIFT_EPOCH.getDate());
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysSinceEpoch = Math.floor((utcDate - utcEpoch) / msPerDay);

  let adjustedDay = (daysSinceEpoch + offset) % 8;
  if (adjustedDay < 0) {
    adjustedDay += 8;
  }

  // Find next REST in the cycle
  let daysUntilRest = 0;
  for (let i = 0; i <= 8; i++) {
    const nextDayIndex = (adjustedDay + i) % 8;
    if (SHIFT_CYCLE[nextDayIndex] === 'REST') {
      daysUntilRest = i;
      break;
    }
  }

  return daysUntilRest;
}
