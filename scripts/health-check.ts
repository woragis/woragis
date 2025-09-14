import { execSync } from "child_process";

console.log("🏥 Checking Portfolio Health...\n");

const services = [
  { name: "Portfolio App", url: "http://localhost:3000", port: 3000 },
  { name: "Database Admin", url: "http://localhost:8080", port: 8080 },
];

async function checkService(name: string, url: string, port: number) {
  try {
    // Check if port is open
    execSync(`nc -z localhost ${port}`, { stdio: "ignore" });
    console.log(`✅ ${name}: Running on port ${port}`);

    // Try to fetch the URL
    try {
      const response = await fetch(url);
      if (response.ok) {
        console.log(`✅ ${name}: Responding correctly`);
      } else {
        console.log(`⚠️  ${name}: Responding with status ${response.status}`);
      }
    } catch (error) {
      console.log(`⚠️  ${name}: Not responding to HTTP requests`);
    }
  } catch (error) {
    console.log(`❌ ${name}: Not running on port ${port}`);
  }
}

async function checkDatabase() {
  try {
    execSync(
      "docker-compose exec -T db psql -U postgres -d portfolio -c 'SELECT COUNT(*) FROM projects;'",
      { stdio: "ignore" }
    );
    console.log("✅ Database: Connected and accessible");
  } catch (error) {
    console.log("❌ Database: Connection failed");
  }
}

async function main() {
  console.log("🔍 Checking services...\n");

  for (const service of services) {
    await checkService(service.name, service.url, service.port);
  }

  console.log("\n🗄️ Checking database...");
  await checkDatabase();

  console.log("\n📊 Container status:");
  try {
    execSync("docker-compose ps", {
      stdio: "inherit",
    });
  } catch (error) {
    console.log("❌ Failed to get container status");
  }

  console.log("\n🎯 Health check complete!");
}

main().catch(console.error);
