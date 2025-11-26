'use server';

import { eq } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { users } from '@/models/Users';
import { getCurrentUser } from './UserActions';

/**
 * Update the user's shift group
 */
export async function updateShiftGroup(shiftGroup: 'A' | 'B' | 'C' | 'D') {
  // This will create the user if they don't exist
  const user = await getCurrentUser();

  // Update their shift group
  await db
    .update(users)
    .set({ shiftGroup })
    .where(eq(users.id, user.id));

  return { success: true };
}
