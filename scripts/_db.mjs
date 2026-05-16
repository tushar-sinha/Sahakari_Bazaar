// Shared helper: DB connection + pretty report writer
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import fs from "fs";
import path from "path";

const adapter = new PrismaBetterSqlite3({ url: "file:./prisma/sahakari.db" });
export const prisma = new PrismaClient({ adapter });

export function fmt(date) {
  if (!date) return "—";
  return new Date(date).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

export function rupees(n) {
  if (n == null) return "—";
  return "₹" + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2 });
}

export function pad(str, len) {
  return String(str ?? "—").padEnd(len).slice(0, len);
}

export function line(char = "─", len = 80) {
  return char.repeat(len);
}

export function saveReport(filename, content) {
  const dir = path.resolve("reports");
  fs.mkdirSync(dir, { recursive: true });
  const outPath = path.join(dir, filename);
  fs.writeFileSync(outPath, content, "utf8");
  console.log(`\n✅  Report saved → reports/${filename}`);
}

export function header(title) {
  const now = new Date().toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" });
  return [
    line("═"),
    `  SAHAKARI BAZAAR  ·  ${title}`,
    `  Generated: ${now}`,
    line("═"),
    "",
  ].join("\n");
}
