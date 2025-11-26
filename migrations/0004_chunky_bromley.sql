CREATE TYPE "public"."shift_group" AS ENUM('I', 'II', 'III', 'REST');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "shift_group" "shift_group" NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "default_shift";--> statement-breakpoint
DROP TYPE "public"."shift_type";