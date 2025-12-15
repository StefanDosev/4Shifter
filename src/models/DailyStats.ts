import { boolean, date, integer, pgEnum, pgTable, uuid } from 'drizzle-orm/pg-core';
import { users } from './Users';

export const workedShiftTypeEnum = pgEnum('worked_shift_type', ['I', 'II', 'III']);

export const dailyStats = pgTable('daily_stats', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  date: date('date').notNull(),
  nadure: integer('nadure').default(0).notNull(), // Paid overtime hours
  ure: integer('ure').default(0).notNull(), // Banked hours
  workedShiftType: workedShiftTypeEnum('worked_shift_type'), // Shift type worked during overtime
  isVacation: boolean('is_vacation').default(false).notNull(),
  isSickLeave: boolean('is_sick_leave').default(false).notNull(),
  isFlexTime: boolean('is_flex_time').default(false).notNull(),
  isHoliday: boolean('is_holiday').default(false).notNull(),
});

export type DailyStats = typeof dailyStats.$inferSelect;
export type NewDailyStats = typeof dailyStats.$inferInsert;
