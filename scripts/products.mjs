// all products — with store, category, stock status and price
// Usage: node scripts/products.mjs
import { prisma, rupees, pad, line, header, saveReport } from "./_db.mjs";

const products = await prisma.product.findMany({
  include: { category: true, store: true },
  orderBy: [{ store: { storeName: "asc" } }, { name: "asc" }],
});

let out = header("ALL PRODUCTS");
out += `  Total products: ${products.length}\n\n`;
out += pad("Name", 30) + pad("Category", 18) + pad("Store", 24) + pad("Price", 10) + pad("MRP", 10) + pad("Unit", 8) + "Stock\n";
out += line() + "\n";

for (const p of products) {
  const discount = p.mrp > p.price ? `${Math.round(((p.mrp - p.price) / p.mrp) * 100)}% off` : "";
  out += pad(p.name, 30) + pad(p.category.name, 18) + pad(p.store?.storeName ?? "—", 24) + pad(rupees(p.price), 10) + pad(rupees(p.mrp), 10) + pad(p.unit, 8) + (p.inStock ? `In Stock  ${discount}` : "OUT OF STOCK") + "\n";
}

// out of stock summary
const outOfStock = products.filter((p) => !p.inStock);
out += `\n── OUT OF STOCK (${outOfStock.length}) ──\n`;
for (const p of outOfStock) {
  out += `  • ${p.name} (${p.category.name}) — ${p.store?.storeName ?? "—"}\n`;
}

console.log(out);
saveReport("products.txt", out);
await prisma.$disconnect();
