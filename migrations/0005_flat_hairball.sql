ALTER TABLE "users" ALTER COLUMN "shift_group" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."shift_group";--> statement-breakpoint
CREATE TYPE "public"."shift_group" AS ENUM('A', 'B', 'C', 'D');--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "shift_group" SET DATA TYPE "public"."shift_group" USING "shift_group"::"public"."shift_group";