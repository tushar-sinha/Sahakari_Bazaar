// Runs ALL report scripts and saves everything to the reports/ folder
// Usage: node scripts/run-all.mjs
import { execSync } from "child_process";

const scripts = [
  "investors.mjs",
  "users.mjs",
  "stores.mjs",
  "products.mjs",
  "orders.mjs",
  "orders-by-user.mjs",
  "revenue.mjs",
  "drivers.mjs",
  "rides.mjs",
];

console.log("═".repeat(60));
console.log("  SAHAKARI BAZAAR — Generating all reports...");
console.log("═".repeat(60) + "\n");

for (const script of scripts) {
  try {
    console.log(`▶  Running ${script}...`);
    execSync(`node scripts/${script}`, { stdio: "inherit" });
  } catch {
    console.error(`✗  Failed: ${script}`);
  }
}

console.log("\n" + "═".repeat(60));
console.log("  All reports saved to the  reports/  folder.");
console.log("═".repeat(60));
