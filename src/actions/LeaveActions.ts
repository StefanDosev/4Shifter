'use server';

import { auth } from '@clerk/nextjs/server';
import { and, eq, gte, lte } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { leaves } from '@/models/Leaves';
import { getCurrentUser } from './UserActions';

export async function requestLeave(
  startDate: string,
  endDate: string,
  type: 'SICK' | 'VACATION' | 'URE_KORISCENJE' | 'OTHER',
  reason?: string,
) {
  const user = await getCurrentUser();

  await db.insert(leaves).values({
    userId: user.id,
    startDate,
    endDate,
    type,
    reason,
    status: 'PENDING',
  });

  return { success: true };
}

export async function approveLeave(leaveId: string) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    throw new Error('Unauthorized');
  }

  // TODO: Add role check for managers/admins
  await db.update(leaves).set({ status: 'APPROVED' }).where(eq(leaves.id, leaveId));

  return { success: true };
}

export async function getLeaveBalance(year: number) {
  const user = await getCurrentUser();

  // Get all approved leaves for the year
  const userLeaves = await db
    .select()
    .from(leaves)
    .where(
      and(
        eq(leaves.userId, user.id),
        eq(leaves.status, 'APPROVED'),
        gte(leaves.startDate, `${year}-01-01`),
        lte(leaves.endDate, `${year}-12-31`),
      ),
    );

  // Calculate vacation days used
  const vacationDays = userLeaves
    .filter(l => l.type === 'VACATION')
    .reduce((sum, leave) => {
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      const days = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return sum + days;
    }, 0);

  return {
    vacationUsed: vacationDays,
    vacationTotal: 20, // Standard vacation days - make this configurable
    vacationRemaining: 20 - vacationDays,
  };
}
