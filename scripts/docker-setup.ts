import { execSync } from "child_process";
import { existsSync, mkdirSync } from "fs";

console.log("🐳 Setting up Portfolio with Docker...\n");

// Create data directory if it doesn't exist
if (!existsSync("./data")) {
  console.log("📁 Creating data directory...");
  mkdirSync("./data", { recursive: true });
  console.log("✅ Data directory created\n");
} else {
  console.log("✅ Data directory already exists\n");
}

// Create .env.local if it doesn't exist
if (!existsSync(".env.local")) {
  console.log("📝 Creating .env.local file...");
  const envContent = `# Database Configuration
DATABASE_URL=postgresql://postgres:password@db:5432/portfolio
POSTGRES_DB=portfolio
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Optional: Redis Configuration
REDIS_URL=redis://redis:6379
`;

  require("fs").writeFileSync(".env.local", envContent);
  console.log("✅ .env.local created\n");
} else {
  console.log("✅ .env.local already exists\n");
}

try {
  console.log("🔨 Building Docker images...");
  execSync("docker-compose build", {
    stdio: "inherit",
  });
  console.log("✅ Docker images built\n");

  console.log("🚀 Starting environment...");
  execSync("docker-compose up -d", {
    stdio: "inherit",
  });
  console.log("✅ Environment started\n");

  console.log("⏳ Waiting for services to be ready...");
  // Wait a bit for services to start
  await new Promise((resolve) => setTimeout(resolve, 5000));

  console.log("🗄️ Setting up database...");
  execSync("docker-compose exec portfolio npm run db:generate", {
    stdio: "inherit",
  });
  execSync("docker-compose exec portfolio npm run db:migrate", {
    stdio: "inherit",
  });
  execSync("docker-compose exec portfolio npm run db:seed", {
    stdio: "inherit",
  });
  console.log("✅ Database setup complete\n");

  console.log("🎉 Docker setup complete!\n");
  console.log("📋 Services running:");
  console.log("🌐 Portfolio: http://localhost:3000");
  console.log("🎛️ Admin Panel: http://localhost:3000/admin");
  console.log(
    "🗄️ Database Admin: http://localhost:8080 (admin@admin.com / admin)"
  );
  console.log("\n🔧 Useful commands:");
  console.log("📊 View logs: docker-compose logs -f");
  console.log("🛑 Stop services: docker-compose down");
  console.log("🔄 Restart services: docker-compose restart");
  console.log(
    "🗄️ Database shell: docker-compose exec db psql -U postgres -d portfolio"
  );
  console.log("\n📚 For production deployment:");
  console.log("🚀 docker-compose up -d");
} catch (error) {
  console.error("❌ Docker setup failed:", error);
  process.exit(1);
}
