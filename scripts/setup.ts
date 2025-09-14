import { execSync } from "child_process";
import { existsSync } from "fs";

console.log("🚀 Setting up Portfolio Admin System...\n");

// Check if .env.local exists
if (!existsSync(".env.local")) {
  console.log("📝 Creating .env.local file...");
  const envContent = `# Database Configuration
# For local development, using SQLite
DATABASE_URL="file:./local.db"
DATABASE_AUTH_TOKEN=""

# Next.js Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
`;

  require("fs").writeFileSync(".env.local", envContent);
  console.log("✅ .env.local created\n");
} else {
  console.log("✅ .env.local already exists\n");
}

try {
  console.log("🗄️ Generating database migration...");
  execSync("npm run db:generate", { stdio: "inherit" });
  console.log("✅ Migration generated\n");

  console.log("🔄 Running database migration...");
  execSync("npm run db:migrate", { stdio: "inherit" });
  console.log("✅ Database migrated\n");

  console.log("🌱 Seeding database with sample data...");
  execSync("npm run db:seed", { stdio: "inherit" });
  console.log("✅ Database seeded\n");

  console.log("🎉 Setup complete!\n");
  console.log("📋 Next steps:");
  console.log("1. Run 'npm run dev' to start the development server");
  console.log("2. Visit http://localhost:3000 to see your portfolio");
  console.log("3. Visit http://localhost:3000/admin to manage projects");
  console.log("4. Visit http://localhost:3000/projects to see all projects");
  console.log("\n🔧 Admin Features:");
  console.log("- Create, edit, and delete projects");
  console.log("- Drag and drop to reorder projects");
  console.log("- Toggle project visibility and featured status");
  console.log("- Configure how many projects show on home page");
  console.log("\n📚 For more details, see ADMIN_SETUP.md");
} catch (error) {
  console.error("❌ Setup failed:", error);
  process.exit(1);
}
