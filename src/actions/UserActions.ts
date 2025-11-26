'use server';

import { auth, currentUser } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
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

  // Try to find existing user
  const [existingUser] = await db.select().from(users).where(eq(users.clerkId, clerkId));

  if (existingUser) {
    return existingUser;
  }

  // User doesn't exist, create them
  const clerkUser = await currentUser();

  if (!clerkUser) {
    throw new Error('Could not fetch user from Clerk');
  }

  const email = clerkUser.emailAddresses[0]?.emailAddress ?? 'unknown@example.com';
  const firstName = clerkUser.firstName ?? undefined;
  const lastName = clerkUser.lastName ?? undefined;

  // Create new user with temporary shift group - they'll update it in onboarding
  const [newUser] = await db.insert(users).values({
    clerkId,
    email,
    firstName,
    lastName,
    shiftGroup: 'A', // Temporary default
  }).returning();

  return newUser!;
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
