/**
 * User Statistics and Balance Actions
 * Handles vacation and flex time balance queries
 */

'use server';

import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { users } from '@/models/Users';
import { VACATION_DAYS_PER_YEAR } from '@/utils/HolidayConfig';

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

/**
 * Get remaining vacation days for the current user
 */
export async function getVacationBalance() {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    throw new Error('Unauthorized');
  }

  const user = await getDbUser(clerkId);

  // User sets their *current* remaining balance in profile.
  // Usage tracks simple decrement from that snapshot.
  const snapshotBalance = user.vacationDaysBalance || 0;
  const usedSinceSnapshot = user.vacationDaysUsed || 0;

  const currentRemaining = snapshotBalance - usedSinceSnapshot;

  return {
    total: VACATION_DAYS_PER_YEAR, // Fixed at 26
    used: VACATION_DAYS_PER_YEAR - currentRemaining, // Calculated for display
    remaining: Math.max(0, currentRemaining),
  };
}

/**
 * Get remaining flex time days for the current user
 */
export async function getFlexTimeBalance() {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    throw new Error('Unauthorized');
  }

  const user = await getDbUser(clerkId);

  // Flex is now in days
  const total = user.flexDaysBalance || 0;
  const used = user.flexTimeDaysUsed || 0;
  const remaining = total - used;

  return {
    total,
    used,
    remaining: Math.max(0, remaining),
  };
}

/**
 * Get all balance information at once
 */
export async function getAllBalances() {
  const vacation = await getVacationBalance();
  const flexTime = await getFlexTimeBalance();

  return {
    vacation,
    flexTime,
  };
}
