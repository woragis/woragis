#!/usr/bin/env tsx

import { db } from "../src/server/db";
import { sql } from "drizzle-orm";

async function migrateTranslations() {
  console.log("🚀 Starting translation tables migration...");

  try {
    // Create blog_post_translations table
    console.log("📝 Creating blog_post_translations table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS blog_post_translations (
        blog_post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
        language_code TEXT NOT NULL CHECK (language_code IN ('en', 'es', 'pt', 'it', 'fr', 'ja', 'zh', 'ko')),
        title TEXT NOT NULL,
        excerpt TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        PRIMARY KEY (blog_post_id, language_code)
      );
    `);

    // Create indexes for blog_post_translations
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS blog_post_translations_blog_post_id_idx 
      ON blog_post_translations(blog_post_id);
    `);
    
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS blog_post_translations_language_code_idx 
      ON blog_post_translations(language_code);
    `);

    // Create project_translations table
    console.log("📝 Creating project_translations table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS project_translations (
        project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        language_code TEXT NOT NULL CHECK (language_code IN ('en', 'es', 'pt', 'it', 'fr', 'ja', 'zh', 'ko')),
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        long_description TEXT,
        content TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        PRIMARY KEY (project_id, language_code)
      );
    `);

    // Create indexes for project_translations
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS project_translations_project_id_idx 
      ON project_translations(project_id);
    `);
    
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS project_translations_language_code_idx 
      ON project_translations(language_code);
    `);

    // Create experience_translations table
    console.log("📝 Creating experience_translations table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS experience_translations (
        experience_id UUID NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
        language_code TEXT NOT NULL CHECK (language_code IN ('en', 'es', 'pt', 'it', 'fr', 'ja', 'zh', 'ko')),
        title TEXT NOT NULL,
        company TEXT NOT NULL,
        period TEXT NOT NULL,
        location TEXT NOT NULL,
        description TEXT NOT NULL,
        achievements TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        PRIMARY KEY (experience_id, language_code)
      );
    `);

    // Create indexes for experience_translations
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS experience_translations_experience_id_idx 
      ON experience_translations(experience_id);
    `);
    
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS experience_translations_language_code_idx 
      ON experience_translations(language_code);
    `);

    // Create education_translations table
    console.log("📝 Creating education_translations table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS education_translations (
        education_id UUID NOT NULL REFERENCES educations(id) ON DELETE CASCADE,
        language_code TEXT NOT NULL CHECK (language_code IN ('en', 'es', 'pt', 'it', 'fr', 'ja', 'zh', 'ko')),
        degree TEXT NOT NULL,
        school TEXT NOT NULL,
        year TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        PRIMARY KEY (education_id, language_code)
      );
    `);

    // Create indexes for education_translations
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS education_translations_education_id_idx 
      ON education_translations(education_id);
    `);
    
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS education_translations_language_code_idx 
      ON education_translations(language_code);
    `);

    // Create testimonial_translations table
    console.log("📝 Creating testimonial_translations table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS testimonial_translations (
        testimonial_id UUID NOT NULL REFERENCES testimonials(id) ON DELETE CASCADE,
        language_code TEXT NOT NULL CHECK (language_code IN ('en', 'es', 'pt', 'it', 'fr', 'ja', 'zh', 'ko')),
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        company TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        PRIMARY KEY (testimonial_id, language_code)
      );
    `);

    // Create indexes for testimonial_translations
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS testimonial_translations_testimonial_id_idx 
      ON testimonial_translations(testimonial_id);
    `);
    
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS testimonial_translations_language_code_idx 
      ON testimonial_translations(language_code);
    `);

    // Create about_translations table
    console.log("📝 Creating about_translations table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS about_translations (
        about_id UUID NOT NULL REFERENCES about_sections(id) ON DELETE CASCADE,
        language_code TEXT NOT NULL CHECK (language_code IN ('en', 'es', 'pt', 'it', 'fr', 'ja', 'zh', 'ko')),
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        PRIMARY KEY (about_id, language_code)
      );
    `);

    // Create indexes for about_translations
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS about_translations_about_id_idx 
      ON about_translations(about_id);
    `);
    
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS about_translations_language_code_idx 
      ON about_translations(language_code);
    `);

    console.log("✅ Translation tables migration completed successfully!");
    
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  migrateTranslations()
    .then(() => {
      console.log("🎉 Migration completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Migration failed:", error);
      process.exit(1);
    });
}

export { migrateTranslations };
