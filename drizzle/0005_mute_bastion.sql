CREATE TYPE "public"."degree_level" AS ENUM('bachelor', 'master', 'doctorate', 'associate', 'diploma');--> statement-breakpoint
CREATE TYPE "public"."education_type" AS ENUM('degree', 'certificate');--> statement-breakpoint
CREATE TABLE "education" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"institution" text NOT NULL,
	"description" text,
	"type" "education_type" NOT NULL,
	"degree_level" "degree_level",
	"field_of_study" text,
	"start_date" timestamp,
	"end_date" timestamp,
	"completion_date" timestamp,
	"grade" text,
	"credits" integer,
	"certificate_id" text,
	"issuer" text,
	"validity_period" text,
	"pdf_document" text,
	"verification_url" text,
	"skills" text,
	"order" integer DEFAULT 0,
	"visible" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "education" ADD CONSTRAINT "education_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;