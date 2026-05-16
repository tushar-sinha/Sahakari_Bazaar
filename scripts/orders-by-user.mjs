// orders grouped per user — shows each customer's full purchase history
// Usage: node scripts/orders-by-user.mjs
import { prisma, fmt, rupees, pad, line, header, saveReport } from "./_db.mjs";

const customers = await prisma.customer.findMany({
  include: {
    orders: {
      include: { items: { include: { product: true } }, store: true },
      orderBy: { createdAt: "desc" },
    },
  },
  orderBy: { name: "asc" },
});

let out = header("ORDERS BY USER");
out += `  Total customers: ${customers.length}\n\n`;

for (const c of customers) {
  const totalSpent = c.orders.reduce((s, o) => s + o.total, 0);
  out += line("═", 70) + "\n";
  out += `  ${c.name}  |  ${c.mobile}  |  ${c.email ?? "no email"}\n`;
  out += `  City: ${c.city ?? "—"}   |   Total orders: ${c.orders.length}   |   Total spent: ${rupees(totalSpent)}\n`;
  out += line("─", 70) + "\n";

  if (c.orders.length === 0) {
    out += "  No orders yet.\n\n";
    continue;
  }

  for (const o of c.orders) {
    out += `\n  Order ${o.orderNumber}  —  ${fmt(o.createdAt)}  —  ${o.status.toUpperCase()}  —  ${rupees(o.total)}\n`;
    out += `  Store: ${o.store?.storeName ?? "—"}\n`;
    for (const item of o.items) {
      out += `    • ${pad(item.product.name, 32)} x${item.quantity}   ${rupees(item.price)}\n`;
    }
  }
  out += "\n";
}

console.log(out);
saveReport("orders-by-user.txt", out);
await prisma.$disconnect();
