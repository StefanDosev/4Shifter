import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './Users';

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  action: text('action').notNull(), // e.g., "SHIFT_CHANGE", "LEAVE_REQUEST"
  performedBy: uuid('performed_by').references(() => users.id).notNull(),
  targetUser: uuid('target_user').references(() => users.id), // Optional, if action affects another user
  details: text('details'), // JSON string or description
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;
