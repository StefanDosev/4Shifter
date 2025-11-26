CREATE TYPE "public"."extra_hours_status" AS ENUM('PENDING', 'APPROVED', 'REJECTED');--> statement-breakpoint
CREATE TYPE "public"."extra_hours_type" AS ENUM('NADURE_ISPLACILO', 'URE_KORISCENJE_BANK');--> statement-breakpoint
CREATE TYPE "public"."leave_status" AS ENUM('PENDING', 'APPROVED', 'REJECTED');--> statement-breakpoint
CREATE TYPE "public"."leave_type" AS ENUM('SICK', 'VACATION', 'URE_KORISCENJE', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."shift_override_type" AS ENUM('A', 'B', 'C', 'D', 'OFF');--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"action" text NOT NULL,
	"performed_by" uuid NOT NULL,
	"target_user" uuid,
	"details" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "extra_hours" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"date" date NOT NULL,
	"hours" integer NOT NULL,
	"type" "extra_hours_type" NOT NULL,
	"status" "extra_hours_status" DEFAULT 'PENDING' NOT NULL,
	"reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leaves" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"type" "leave_type" NOT NULL,
	"status" "leave_status" DEFAULT 'PENDING' NOT NULL,
	"reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shift_overrides" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"date" date NOT NULL,
	"new_shift" "shift_override_type" NOT NULL,
	"reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "clerk_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "first_name" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_name" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "default_shift" "shift_type" NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_performed_by_users_id_fk" FOREIGN KEY ("performed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_target_user_users_id_fk" FOREIGN KEY ("target_user") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "extra_hours" ADD CONSTRAINT "extra_hours_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leaves" ADD CONSTRAINT "leaves_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shift_overrides" ADD CONSTRAINT "shift_overrides_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "shift";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_clerk_id_unique" UNIQUE("clerk_id");