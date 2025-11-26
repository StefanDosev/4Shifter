import { pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const shiftGroupEnum = pgEnum('shift_group', ['A', 'B', 'C', 'D']);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  clerkId: text('clerk_id').notNull().unique(),
  email: text('email').notNull().unique(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  shiftGroup: shiftGroupEnum('shift_group').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date()),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
