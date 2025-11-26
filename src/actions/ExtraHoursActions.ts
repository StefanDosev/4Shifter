'use server';

import { auth } from '@clerk/nextjs/server';
import { and, eq, sql } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { extraHours } from '@/models/ExtraHours';
import { getCurrentUser } from './UserActions';

export async function logExtraHours(
  date: string,
  hours: number,
  type: 'NADURE_ISPLACILO' | 'URE_KORISCENJE_BANK',
  reason?: string,
) {
  const user = await getCurrentUser();

  await db.insert(extraHours).values({
    userId: user.id,
    date,
    hours,
    type,
    reason,
    status: 'PENDING',
  });

  return { success: true };
}

export async function getUreBalance() {
  const user = await getCurrentUser();

  // Get all approved URE hours
  const result = await db
    .select({
      totalHours: sql<number>`COALESCE(SUM(${extraHours.hours}), 0)`,
    })
    .from(extraHours)
    .where(
      and(
        eq(extraHours.userId, user.id),
        eq(extraHours.type, 'URE_KORISCENJE_BANK'),
        eq(extraHours.status, 'APPROVED'),
      ),
    );

  return {
    totalUreHours: result[0]?.totalHours || 0,
  };
}

export async function approveExtraHours(extraHoursId: string) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    throw new Error('Unauthorized');
  }

  // TODO: Add role check for managers/admins
  await db.update(extraHours).set({ status: 'APPROVED' }).where(eq(extraHours.id, extraHoursId));

  return { success: true };
}
