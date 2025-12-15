'use server';

import { auth } from '@clerk/nextjs/server';
import { and, eq, sql } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { dailyStats } from '@/models/DailyStats';
import { users } from '@/models/Users';
import { FLEX_TIME_DAYS_PER_YEAR, VACATION_DAYS_PER_YEAR } from '@/utils/HolidayConfig';

async function getDbUser(clerkId: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);

  if (!user) {
    throw new Error('User not found');
  }

  return user;
}

export async function getDailyStats(date: string) {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    throw new Error('Unauthorized');
  }

  const user = await getDbUser(clerkId);
  const userId = user.id;

  const stats = await db
    .select()
    .from(dailyStats)
    .where(and(eq(dailyStats.userId, userId), eq(dailyStats.date, date)))
    .limit(1);

  return stats[0] || null;
}

export async function updateDailyStats(
  date: string,
  data: {
    nadure?: number;
    ure?: number;
    workedShiftType?: 'I' | 'II' | 'III' | null;
    isVacation?: boolean;
    isSickLeave?: boolean;
    isFlexTime?: boolean;
    isHoliday?: boolean;
  },
) {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    throw new Error('Unauthorized');
  }

  const user = await getDbUser(clerkId);
  const userId = user.id;

  // Check if record exists
  const existing = await getDailyStats(date);

  // Handle vacation balance updates
  if (data.isVacation !== undefined) {
    const wasVacation = existing?.isVacation || false;
    if (data.isVacation && !wasVacation) {
      // Selecting vacation - check balance and increment
      const remaining = VACATION_DAYS_PER_YEAR - (user.vacationDaysUsed || 0);
      if (remaining <= 0) {
        throw new Error('No vacation days remaining');
      }
      await db
        .update(users)
        .set({ vacationDaysUsed: (user.vacationDaysUsed || 0) + 1 })
        .where(eq(users.id, userId));
    } else if (!data.isVacation && wasVacation) {
      // Unselecting vacation - decrement
      await db
        .update(users)
        .set({ vacationDaysUsed: Math.max(0, (user.vacationDaysUsed || 0) - 1) })
        .where(eq(users.id, userId));
    }
  }

  // Handle flex time balance updates
  if (data.isFlexTime !== undefined) {
    const wasFlexTime = existing?.isFlexTime || false;
    if (data.isFlexTime && !wasFlexTime) {
      // Selecting flex time - check balance and increment
      const remaining = FLEX_TIME_DAYS_PER_YEAR - (user.flexTimeDaysUsed || 0);
      if (remaining <= 0) {
        throw new Error('No flex time days remaining');
      }
      await db
        .update(users)
        .set({ flexTimeDaysUsed: (user.flexTimeDaysUsed || 0) + 1 })
        .where(eq(users.id, userId));
    } else if (!data.isFlexTime && wasFlexTime) {
      // Unselecting flex time - decrement
      await db
        .update(users)
        .set({ flexTimeDaysUsed: Math.max(0, (user.flexTimeDaysUsed || 0) - 1) })
        .where(eq(users.id, userId));
    }
  }

  if (existing) {
    // Update existing record
    await db
      .update(dailyStats)
      .set(data)
      .where(and(eq(dailyStats.userId, userId), eq(dailyStats.date, date)));
  } else {
    // Insert new record
    await db.insert(dailyStats).values({
      userId,
      date,
      nadure: data.nadure || 0,
      ure: data.ure || 0,
      workedShiftType: data.workedShiftType,
      isVacation: data.isVacation || false,
      isSickLeave: data.isSickLeave || false,
      isFlexTime: data.isFlexTime || false,
      isHoliday: data.isHoliday || false,
    });
  }

  return getDailyStats(date);
}

export async function getMonthlyTotals(month: number, year: number) {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    throw new Error('Unauthorized');
  }

  const user = await getDbUser(clerkId);
  const userId = user.id;

  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${year}-${String(month).padStart(2, '0')}-${lastDay}`;

  const [nadureResult, ureResult] = await Promise.all([
    // Monthly Nadure
    db
      .select({
        total: sql<number>`COALESCE(SUM(${dailyStats.nadure}), 0)`,
      })
      .from(dailyStats)
      .where(
        and(
          eq(dailyStats.userId, userId),
          sql`${dailyStats.date} >= ${startDate}`,
          sql`${dailyStats.date} <= ${endDate}`,
        ),
      ),
    // Global Ure (Banked Hours)
    db
      .select({
        total: sql<number>`COALESCE(SUM(${dailyStats.ure}), 0)`,
      })
      .from(dailyStats)
      .where(eq(dailyStats.userId, userId)),
  ]);

  return {
    totalNadure: Number(nadureResult[0]?.total || 0),
    totalUre: Number(ureResult[0]?.total || 0),
  };
}

export async function getAllDailyStats(month: number, year: number) {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    throw new Error('Unauthorized');
  }

  const user = await getDbUser(clerkId);
  const userId = user.id;

  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${year}-${String(month).padStart(2, '0')}-${lastDay}`;

  const stats = await db
    .select()
    .from(dailyStats)
    .where(
      and(
        eq(dailyStats.userId, userId),
        sql`${dailyStats.date} >= ${startDate}`,
        sql`${dailyStats.date} <= ${endDate}`,
      ),
    );

  // Convert to map for easy lookup
  const statsMap: Record<string, typeof stats[0]> = {};
  stats.forEach((stat) => {
    statsMap[stat.date] = stat;
  });

  return statsMap;
}
