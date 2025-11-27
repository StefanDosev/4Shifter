'use server';

import { auth } from '@clerk/nextjs/server';
import { and, eq, sql } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { dailyStats } from '@/models/DailyStats';
import { users } from '@/models/Users';

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
    isVacation?: boolean;
    isSickLeave?: boolean;
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
      isVacation: data.isVacation || false,
      isSickLeave: data.isSickLeave || false,
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

  const result = await db
    .select({
      totalNadure: sql<number>`COALESCE(SUM(${dailyStats.nadure}), 0)`,
      totalUre: sql<number>`COALESCE(SUM(${dailyStats.ure}), 0)`,
    })
    .from(dailyStats)
    .where(
      and(
        eq(dailyStats.userId, userId),
        sql`${dailyStats.date} >= ${startDate}`,
        sql`${dailyStats.date} <= ${endDate}`,
      ),
    );

  return {
    totalNadure: Number(result[0]?.totalNadure || 0),
    totalUre: Number(result[0]?.totalUre || 0),
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
