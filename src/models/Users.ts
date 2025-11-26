import { pgEnum, pgTable, text, uuid } from 'drizzle-orm/pg-core';

export const shiftType = pgEnum('shift_type', ['A', 'B', 'C', 'D']);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  shift: shiftType('shift').notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
