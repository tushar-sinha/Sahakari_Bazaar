// reports all registered customers (users)
// Usage: node scripts/users.mjs
import { prisma, fmt, pad, line, header, saveReport } from "./_db.mjs";

const customers = await prisma.customer.findMany({ orderBy: { createdAt: "asc" } });

let out = header("ALL REGISTERED USERS");
out += `  Total users: ${customers.length}\n\n`;
out += pad("Name", 22) + pad("Mobile", 14) + pad("Email", 30) + pad("City", 16) + pad("Joined", 22) + "\n";
out += line() + "\n";

for (const c of customers) {
  out += pad(c.name, 22) + pad(c.mobile, 14) + pad(c.email, 30) + pad(c.city, 16) + pad(fmt(c.createdAt), 22) + "\n";
}

console.log(out);
saveReport("users.txt", out);
await prisma.$disconnect();
