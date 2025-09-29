DROP TABLE "core_profile" CASCADE;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "content" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "video_url" text;