import { date, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './Users';

export const leaveTypeEnum = pgEnum('leave_type', ['SICK', 'VACATION', 'URE_KORISCENJE', 'OTHER']);
export const leaveStatusEnum = pgEnum('leave_status', ['PENDING', 'APPROVED', 'REJECTED']);

export const leaves = pgTable('leaves', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  type: leaveTypeEnum('type').notNull(),
  status: leaveStatusEnum('status').default('PENDING').notNull(),
  reason: text('reason'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Leave = typeof leaves.$inferSelect;
export type NewLeave = typeof leaves.$inferInsert;
