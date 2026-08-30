#!/usr/bin/env tsx
// Bootstraps or resets the fallback admin password without needing to sign
// in first. Usage: npm run set-password -- "your-new-password"
import { hashAdminToken } from "../src/lib/adminToken";
import { readConfig, writeConfig } from "../src/lib/config";

const password = process.argv[2];
if (!password || password.length < 8) {
  console.error("Usage: npm run set-password -- <password (min 8 chars)>");
  process.exit(1);
}

async function main() {
  const config = await readConfig();
  config.adminTokenHash = hashAdminToken(password);
  await writeConfig(config);
  console.log("Admin password set. Sign in at /admin/login with that password.");
}

main();
