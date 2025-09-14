#!/usr/bin/env tsx

import { authService } from "../src/server/services";

async function promoteFirstUserToAdmin() {
  try {
    console.log("🔍 Checking for first user to promote to admin...");

    const result = await authService.promoteFirstUserToAdmin();

    if (result) {
      console.log("✅ Successfully promoted first user to admin!");
    } else {
      console.log(
        "ℹ️  No promotion needed - either no users exist or first user is already admin"
      );
    }
  } catch (error) {
    console.error("❌ Error promoting first user to admin:", error);
    process.exit(1);
  }
}

// Run the script
promoteFirstUserToAdmin()
  .then(() => {
    console.log("🎉 Script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Script failed:", error);
    process.exit(1);
  });
