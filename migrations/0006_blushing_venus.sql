CREATE TABLE "daily_stats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"date" date NOT NULL,
	"nadure" integer DEFAULT 0 NOT NULL,
	"ure" integer DEFAULT 0 NOT NULL,
	"is_vacation" boolean DEFAULT false NOT NULL,
	"is_sick_leave" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "daily_stats" ADD CONSTRAINT "daily_stats_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;