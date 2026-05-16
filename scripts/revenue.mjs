// revenue summary — total revenue per store + grand total
// Usage: node scripts/revenue.mjs
import { prisma, fmt, rupees, pad, line, header, saveReport } from "./_db.mjs";

const orders = await prisma.order.findMany({
  include: { store: true },
});

// group by store
const storeMap = new Map();
let grandTotal = 0;
let grandOrders = 0;

for (const o of orders) {
  const key = o.store?.storeName ?? "Unknown Store";
  if (!storeMap.has(key)) storeMap.set(key, { orders: 0, revenue: 0, statuses: {} });
  const entry = storeMap.get(key);
  entry.orders += 1;
  entry.revenue += o.total;
  entry.statuses[o.status] = (entry.statuses[o.status] ?? 0) + 1;
  grandTotal += o.total;
  grandOrders += 1;
}

// overall by status
const byStatus = {};
for (const o of orders) {
  byStatus[o.status] = (byStatus[o.status] ?? 0) + 1;
}

let out = header("REVENUE SUMMARY");
out += `  Total orders : ${grandOrders}\n`;
out += `  Grand total  : ${rupees(grandTotal)}\n\n`;

out += "── BY STATUS ──\n";
for (const [status, count] of Object.entries(byStatus)) {
  out += `  ${pad(status, 16)} ${count} orders\n`;
}

out += "\n── REVENUE BY STORE ──\n\n";
out += pad("Store", 30) + pad("Orders", 10) + pad("Revenue", 16) + "Status breakdown\n";
out += line() + "\n";

for (const [name, data] of [...storeMap.entries()].sort((a, b) => b[1].revenue - a[1].revenue)) {
  const statusStr = Object.entries(data.statuses).map(([s, n]) => `${s}:${n}`).join("  ");
  out += pad(name, 30) + pad(data.orders, 10) + pad(rupees(data.revenue), 16) + statusStr + "\n";
}

out += line() + "\n";
out += pad("TOTAL", 30) + pad(grandOrders, 10) + rupees(grandTotal) + "\n";

console.log(out);
saveReport("revenue.txt", out);
await prisma.$disconnect();
