CREATE TYPE "public"."shift_type" AS ENUM('A', 'B', 'C', 'D');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"shift" "shift_type" NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
