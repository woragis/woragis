CREATE TYPE "public"."instrument_knowledge_level" AS ENUM('beginner', 'intermediate', 'advanced', 'expert');--> statement-breakpoint
CREATE TYPE "public"."instrument_learning_status" AS ENUM('want_to_learn', 'learning', 'learned', 'not_interested');--> statement-breakpoint
CREATE TYPE "public"."martial_arts_knowledge_level" AS ENUM('beginner', 'intermediate', 'advanced', 'expert');--> statement-breakpoint
CREATE TYPE "public"."martial_arts_learning_status" AS ENUM('want_to_learn', 'learning', 'learned', 'not_interested');--> statement-breakpoint
CREATE TYPE "public"."language_learning_status" AS ENUM('want_to_learn', 'learning', 'learned', 'not_interested');--> statement-breakpoint
CREATE TYPE "public"."language_proficiency_level" AS ENUM('beginner', 'elementary', 'intermediate', 'upper_intermediate', 'advanced', 'native');--> statement-breakpoint
CREATE TABLE "biography" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"featured_biography" text,
	"full_biography" text,
	"visible" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "instruments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"knowledge_level" "instrument_knowledge_level",
	"learning_status" "instrument_learning_status" NOT NULL,
	"years_of_experience" text,
	"description" text,
	"visible" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "martial_arts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"knowledge_level" "martial_arts_knowledge_level",
	"learning_status" "martial_arts_learning_status" NOT NULL,
	"grade" text,
	"belt" text,
	"years_of_experience" text,
	"description" text,
	"visible" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "languages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"proficiency_level" "language_proficiency_level",
	"learning_status" "language_learning_status" NOT NULL,
	"years_of_experience" text,
	"description" text,
	"visible" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hobbies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"category" text,
	"visible" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "about_core" CASCADE;