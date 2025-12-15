ALTER TABLE "users" ADD COLUMN "flex_days_balance" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "flex_hours_balance";