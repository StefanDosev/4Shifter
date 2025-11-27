import { boolean, date, integer, pgTable, uuid } from 'drizzle-orm/pg-core';
import { users } from './Users';

export const dailyStats = pgTable('daily_stats', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  date: date('date').notNull(),
  nadure: integer('nadure').default(0).notNull(), // Paid overtime hours
  ure: integer('ure').default(0).notNull(), // Banked hours
  isVacation: boolean('is_vacation').default(false).notNull(),
  isSickLeave: boolean('is_sick_leave').default(false).notNull(),
});

export type DailyStats = typeof dailyStats.$inferSelect;
export type NewDailyStats = typeof dailyStats.$inferInsert;
