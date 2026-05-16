// reports all orders with customer and item breakdown
// Usage: node scripts/orders.mjs
import { prisma, fmt, rupees, pad, line, header, saveReport } from "./_db.mjs";

const orders = await prisma.order.findMany({
  include: {
    customer: true,
    store: true,
    items: { include: { product: true } },
  },
  orderBy: { createdAt: "desc" },
});

let out = header("ALL ORDERS");
out += `  Total orders: ${orders.length}\n\n`;
out += pad("Order #", 16) + pad("Customer", 20) + pad("Store", 22) + pad("Status", 12) + pad("Total", 12) + pad("Date", 22) + "\n";
out += line() + "\n";

for (const o of orders) {
  out += pad(o.orderNumber, 16) + pad(o.customer?.name ?? "Guest", 20) + pad(o.store?.storeName ?? "—", 22) + pad(o.status, 12) + pad(rupees(o.total), 12) + pad(fmt(o.createdAt), 22) + "\n";
}

out += "\n\n── ORDER DETAILS ──\n";
for (const o of orders) {
  out += `\n${line("─", 60)}\n`;
  out += `Order   : ${o.orderNumber}\n`;
  out += `Customer: ${o.customer?.name ?? "Guest"}  |  ${o.customer?.mobile ?? "—"}\n`;
  out += `Store   : ${o.store?.storeName ?? "—"}\n`;
  out += `Status  : ${o.status}   |  Date: ${fmt(o.createdAt)}\n`;
  out += `Address : ${o.address ?? "—"}\n`;
  out += `\n  Items:\n`;
  for (const item of o.items) {
    out += `    • ${pad(item.product.name, 30)} x${item.quantity}   ${rupees(item.price)} each\n`;
  }
  out += `\n  Subtotal : ${rupees(o.subtotal)}\n`;
  out += `  Delivery : ${rupees(o.deliveryFee)}\n`;
  out += `  TOTAL    : ${rupees(o.total)}\n`;
}

console.log(out);
saveReport("orders.txt", out);
await prisma.$disconnect();
