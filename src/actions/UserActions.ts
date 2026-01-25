'use server';

import { auth, currentUser } from '@clerk/nextjs/server';
import { eq, or } from 'drizzle-orm';
import { db } from '@/libs/DB';
import { users } from '@/models/Users';

/**
 * Get the current user from the database, creating them if they don't exist
 */
export async function getCurrentUser() {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    throw new Error('Unauthorized');
  }

  try {
    // 1. Try to find existing user
    let [user] = await db.select().from(users).where(eq(users.clerkId, clerkId));

    if (user) {
      return user;
    }

    // 2. User doesn't exist, fetch from Clerk
    const clerkUser = await currentUser();

    if (!clerkUser) {
      throw new Error('Could not fetch user from Clerk');
    }

    const email = clerkUser.emailAddresses[0]?.emailAddress ?? 'unknown@example.com';
    const firstName = clerkUser.firstName ?? undefined;
    const lastName = clerkUser.lastName ?? undefined;

    // 3. Try to create new user
    try {
      [user] = await db.insert(users).values({
        clerkId,
        email,
        firstName,
        lastName,
        shiftGroup: 'A', // Temporary default
      }).returning();
    } catch (insertError: any) {
      // If insertion fails (likely unique constraint conflict), try to find by ID or Email
      console.warn('User insertion failed, attempting recovery:', insertError.code || insertError.message);

      [user] = await db
        .select()
        .from(users)
        .where(
          or(
            eq(users.clerkId, clerkId),
            eq(users.email, email),
          ),
        );

      if (!user) {
        // Log the full error if recovery also fails
        console.error('CRITICAL: User creation and recovery failed.', {
          insertError: {
            code: insertError.code,
            detail: insertError.detail,
            message: insertError.message,
            table: insertError.table,
            constraint: insertError.constraint,
          },
          clerkId,
          email,
        });
        throw insertError;
      }
    }

    if (!user) {
      throw new Error('Failed to create or retrieve user');
    }

    return user;
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    throw error;
  }
}

/**
 * Check if user needs onboarding (for middleware/guards)
 */
export async function checkNeedsOnboarding(): Promise<boolean> {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return false;
  }

  const [user] = await db.select().from(users).where(eq(users.clerkId, clerkId));

  // If user doesn't exist, they need onboarding
  return !user;
}

/**
 * Get the current user's shift group
 */
export async function getUserShiftGroup(): Promise<'A' | 'B' | 'C' | 'D'> {
  const user = await getCurrentUser();
  return user.shiftGroup;
}
