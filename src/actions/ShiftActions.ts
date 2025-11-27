'use server';

import { eachDayOfInterval, endOfMonth, format, startOfMonth } from 'date-fns';
import { and, eq, gte, lte } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { dailyStats } from '@/models/DailyStats';
import { shiftOverrides } from '@/models/Shifts';
import { calculateShift } from '@/utils/ShiftCalculator';

import { getCurrentUser } from './UserActions';

export async function getMonthlySchedule(month: number, year: number) {
  const user = await getCurrentUser();

  const startDate = startOfMonth(new Date(year, month - 1));
  const endDate = endOfMonth(new Date(year, month - 1));

  // Get all shift overrides for the month
  const overrides = await db
    .select()
    .from(shiftOverrides)
    .where(
      and(
        eq(shiftOverrides.userId, user.id),
        gte(shiftOverrides.date, format(startDate, 'yyyy-MM-dd')),
        lte(shiftOverrides.date, format(endDate, 'yyyy-MM-dd')),
      ),
    );

  // Get all daily stats for the month
  const stats = await db
    .select()
    .from(dailyStats)
    .where(
      and(
        eq(dailyStats.userId, user.id),
        gte(dailyStats.date, format(startDate, 'yyyy-MM-dd')),
        lte(dailyStats.date, format(endDate, 'yyyy-MM-dd')),
      ),
    );

  // Build the schedule for each day
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const schedule = days.map((date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const override = overrides.find(o => o.date === dateStr);
    const stat = stats.find(s => s.date === dateStr);

    let shiftType = 'REST';
    let isOverride = false;
    let reason: string | undefined;

    if (override) {
      shiftType = override.newShift;
      isOverride = true;
      reason = override.reason || undefined;
    } else {
      const result = calculateShift(date, user.shiftGroup);
      shiftType = result.shiftType;
    }

    return {
      date: dateStr,
      shift: shiftType,
      isOverride,
      reason,
      nadure: stat?.nadure || 0,
      ure: stat?.ure || 0,
      isVacation: stat?.isVacation || false,
      isSickLeave: stat?.isSickLeave || false,
    };
  });

  return schedule;
}

export async function requestShiftSwap(date: string, targetShift: 'A' | 'B' | 'C' | 'D' | 'OFF', reason?: string) {
  const user = await getCurrentUser();

  await db.insert(shiftOverrides).values({
    userId: user.id,
    date,
    newShift: targetShift,
    reason,
  });

  return { success: true };
}

export async function getShiftStats(month: number, year: number) {
  // const user = await getCurrentUser(); // Unused

  const schedule = await getMonthlySchedule(month, year);

  const stats = schedule.reduce((acc, day) => {
    if (day.shift !== 'OFF') {
      acc[day.shift] = (acc[day.shift] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  return stats;
}
