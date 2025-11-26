import { date, integer, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './Users';

export const extraHoursTypeEnum = pgEnum('extra_hours_type', ['NADURE_ISPLACILO', 'URE_KORISCENJE_BANK']);
export const extraHoursStatusEnum = pgEnum('extra_hours_status', ['PENDING', 'APPROVED', 'REJECTED']);

export const extraHours = pgTable('extra_hours', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  date: date('date').notNull(),
  hours: integer('hours').notNull(), // Number of hours
  type: extraHoursTypeEnum('type').notNull(),
  status: extraHoursStatusEnum('status').default('PENDING').notNull(),
  reason: text('reason'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date()),
});

export type ExtraHours = typeof extraHours.$inferSelect;
export type NewExtraHours = typeof extraHours.$inferInsert;
