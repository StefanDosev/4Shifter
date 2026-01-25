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
    // 1. Try to find existing user by Clerk ID first (most efficient)
    let [user] = await db.select().from(users).where(eq(users.clerkId, clerkId));

    if (user) {
      return user;
    }

    // 2. User not found by Clerk ID, fetch from Clerk to get email
    const clerkUser = await currentUser();

    if (!clerkUser) {
      throw new Error('Could not fetch user from Clerk');
    }

    const email = clerkUser.emailAddresses[0]?.emailAddress;
    if (!email) {
      throw new Error('User does not have an email address in Clerk');
    }

    // 3. Try to find by email to handle "re-linking" or collisions
    [user] = await db.select().from(users).where(eq(users.email, email));

    if (user) {
      // LINKING: If we found a user by email but with a different Clerk ID, update it
      // This is crucial to break onboarding loops where DB has old ID
      if (user.clerkId !== clerkId) {
        console.warn(`Linking existing email ${email} to new Clerk ID ${clerkId}`);
        const [updatedUser] = await db
          .update(users)
          .set({ clerkId, updatedAt: new Date() })
          .where(eq(users.id, user.id))
          .returning();
        return updatedUser!;
      }
      return user;
    }

    const firstName = clerkUser.firstName ?? undefined;
    const lastName = clerkUser.lastName ?? undefined;

    // 4. Truly new user, create record
    try {
      [user] = await db.insert(users).values({
        clerkId,
        email,
        firstName,
        lastName,
        shiftGroup: 'A', // Temporary default
      }).returning();
    } catch (insertError: any) {
      // Final fallback search if insert still fails (race condition)
      console.warn('Final recovery attempt after insert failure:', insertError.message);
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
        throw insertError;
      }
    }

    return user!;
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
