'use server';

import { eq } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { users } from '@/models/Users';
import { getCurrentUser } from './UserActions';

/**
 * Complete the onboarding process
 */
export async function completeOnboarding({
  firstName,
  lastName,
  shiftGroup,
  vacationDaysBalance,
  flexDaysBalance,
}: {
  firstName: string;
  lastName: string;
  shiftGroup: 'A' | 'B' | 'C' | 'D';
  vacationDaysBalance: number;
  flexDaysBalance: number;
}) {
  // This will create the user if they don't exist
  const user = await getCurrentUser();

  // Update their shift group
  await db
    .update(users)
    .set({
      firstName,
      lastName,
      shiftGroup,
      vacationDaysBalance,
      flexDaysBalance,
      vacationDaysUsed: 0,
      flexTimeDaysUsed: 0,
    })
    .where(eq(users.id, user.id));

  return { success: true };
}
