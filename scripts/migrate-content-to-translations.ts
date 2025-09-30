#!/usr/bin/env tsx

import { db } from "../src/server/db";
import { 
  blogPosts, 
  projects, 
  experiences, 
  education, 
  testimonials,
  blogPostTranslations,
  projectTranslations,
  experienceTranslations,
  educationTranslations,
  testimonialTranslations
} from "../src/server/db/schemas";
import { eq } from "drizzle-orm";

async function migrateContentToTranslations() {
  console.log("🚀 Starting content to translations migration...");

  try {
    // Migrate blog posts to translations
    console.log("📝 Migrating blog posts to translations...");
    const allBlogPosts = await db.select().from(blogPosts);
    
    for (const blogPost of allBlogPosts) {
      // Create English translation (assuming existing content is in English)
      await db.insert(blogPostTranslations).values({
        blogPostId: blogPost.id,
        languageCode: "en",
        title: blogPost.title,
        excerpt: blogPost.excerpt,
        content: blogPost.content,
      }).onConflictDoNothing();
    }
    
    console.log(`✅ Migrated ${allBlogPosts.length} blog posts to translations`);

    // Migrate projects to translations
    console.log("📝 Migrating projects to translations...");
    const allProjects = await db.select().from(projects);
    
    for (const project of allProjects) {
      // Create English translation
      await db.insert(projectTranslations).values({
        projectId: project.id,
        languageCode: "en",
        title: project.title,
        description: project.description,
        longDescription: project.longDescription,
        content: project.content,
      }).onConflictDoNothing();
    }
    
    console.log(`✅ Migrated ${allProjects.length} projects to translations`);

    // Migrate experiences to translations
    console.log("📝 Migrating experiences to translations...");
    const allExperiences = await db.select().from(experiences);
    
    for (const experience of allExperiences) {
      // Create English translation
      await db.insert(experienceTranslations).values({
        experienceId: experience.id,
        languageCode: "en",
        title: experience.title,
        company: experience.company,
        period: experience.period,
        location: experience.location,
        description: experience.description,
        achievements: JSON.stringify(experience.achievements),
      }).onConflictDoNothing();
    }
    
    console.log(`✅ Migrated ${allExperiences.length} experiences to translations`);

    // Migrate education to translations
    console.log("📝 Migrating education to translations...");
    const allEducations = await db.select().from(education);
    
    for (const education of allEducations) {
      // Create English translation
      await db.insert(educationTranslations).values({
        educationId: education.id,
        languageCode: "en",
        degree: education.title,
        school: education.institution,
        year: education.completionDate ? education.completionDate.getFullYear().toString() : 
              education.endDate ? education.endDate.getFullYear().toString() : 
              new Date().getFullYear().toString(),
        description: education.description,
      }).onConflictDoNothing();
    }
    
    console.log(`✅ Migrated ${allEducations.length} education records to translations`);

    // Migrate testimonials to translations
    console.log("📝 Migrating testimonials to translations...");
    const allTestimonials = await db.select().from(testimonials);
    
    for (const testimonial of allTestimonials) {
      // Create English translation
      await db.insert(testimonialTranslations).values({
        testimonialId: testimonial.id,
        languageCode: "en",
        name: testimonial.name,
        role: testimonial.position,
        company: testimonial.company,
        content: testimonial.content,
      }).onConflictDoNothing();
    }
    
    console.log(`✅ Migrated ${allTestimonials.length} testimonials to translations`);

    console.log("🎉 Content to translations migration completed successfully!");
    
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  migrateContentToTranslations()
    .then(() => {
      console.log("🎉 Migration completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Migration failed:", error);
      process.exit(1);
    });
}

export { migrateContentToTranslations };
