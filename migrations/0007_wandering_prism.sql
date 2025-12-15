ALTER TABLE "daily_stats" ADD COLUMN "is_flex_time" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "daily_stats" ADD COLUMN "is_holiday" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "vacation_days_used" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "flex_time_days_used" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "year_start_date" timestamp DEFAULT now() NOT NULL;