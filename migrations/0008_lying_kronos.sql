ALTER TABLE "extra_hours" ADD COLUMN "worked_shift_type" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "vacation_days_balance" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "flex_hours_balance" integer DEFAULT 0 NOT NULL;