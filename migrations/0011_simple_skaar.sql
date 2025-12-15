CREATE TYPE "public"."worked_shift_type" AS ENUM('I', 'II', 'III');--> statement-breakpoint
ALTER TABLE "daily_stats" ADD COLUMN "worked_shift_type" "worked_shift_type";