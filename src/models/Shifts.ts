import { date, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './Users';

export const shiftOverrideTypeEnum = pgEnum('shift_override_type', ['A', 'B', 'C', 'D', 'OFF']);

export const shiftOverrides = pgTable('shift_overrides', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  date: date('date').notNull(), // YYYY-MM-DD
  newShift: shiftOverrideTypeEnum('new_shift').notNull(),
  reason: text('reason'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date()),
});

export type ShiftOverride = typeof shiftOverrides.$inferSelect;
export type NewShiftOverride = typeof shiftOverrides.$inferInsert;
