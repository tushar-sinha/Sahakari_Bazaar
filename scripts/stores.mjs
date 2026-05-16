// reports all store partners
// Usage: node scripts/stores.mjs
import { prisma, fmt, pad, line, header, saveReport } from "./_db.mjs";

const stores = await prisma.storePartner.findMany({
  include: { _count: { select: { products: true, orders: true } } },
  orderBy: { createdAt: "asc" },
});

let out = header("ALL STORE PARTNERS");
out += `  Total stores: ${stores.length}\n\n`;
out += pad("Store Name", 26) + pad("Owner", 20) + pad("Category", 16) + pad("City", 14) + pad("Products", 10) + pad("Orders", 8) + pad("Active", 8) + "\n";
out += line() + "\n";

for (const s of stores) {
  out += pad(s.storeName, 26) + pad(s.ownerName, 20) + pad(s.category, 16) + pad(s.city, 14) + pad(s._count.products, 10) + pad(s._count.orders, 8) + pad(s.isActive ? "Yes" : "No", 8) + "\n";
}

out += "\n\n";
out += "── STORE DETAILS ──\n\n";
for (const s of stores) {
  out += `${s.storeName} (${s.ownerName})\n`;
  out += `  Mobile   : ${s.mobile}\n`;
  out += `  Email    : ${s.email ?? "—"}\n`;
  out += `  Address  : ${s.address}, ${s.city}, ${s.state} – ${s.pincode}\n`;
  out += `  Category : ${s.category}   |  Active: ${s.isActive ? "Yes" : "No"}\n`;
  out += `  Joined   : ${fmt(s.createdAt)}\n`;
  out += "\n";
}

console.log(out);
saveReport("stores.txt", out);
await prisma.$disconnect();
