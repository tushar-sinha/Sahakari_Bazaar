// investor registrations from the onboarding form
// Usage: node scripts/investors.mjs
import { prisma, fmt, rupees, pad, line, header, saveReport } from "./_db.mjs";

const investors = await prisma.investor.findMany({ orderBy: { createdAt: "asc" } });
const totalInvestment = investors.reduce((s, i) => s + (i.investment ?? 0), 0);

let out = header("INVESTOR REGISTRATIONS");
out += `  Total registrations : ${investors.length}\n`;
out += `  Indicated investment: ${rupees(totalInvestment)}\n\n`;
out += pad("Name", 22) + pad("Mobile", 14) + pad("City", 14) + pad("Profession", 18) + pad("Investment", 14) + pad("Registered", 22) + "\n";
out += line() + "\n";

for (const i of investors) {
  out += pad(i.name, 22) + pad(i.mobile, 14) + pad(i.city, 14) + pad(i.profession, 18) + pad(rupees(i.investment), 14) + pad(fmt(i.createdAt), 22) + "\n";
}

out += "\n\n── FULL DETAILS ──\n\n";
for (const i of investors) {
  out += `${i.name}\n`;
  out += `  Mobile     : ${i.mobile}\n`;
  out += `  Email      : ${i.email ?? "—"}\n`;
  out += `  Address    : ${i.address}, ${i.city}, ${i.state} – ${i.pincode}\n`;
  out += `  Profession : ${i.profession}\n`;
  out += `  Investment : ${rupees(i.investment)}\n`;
  out += `  Notes      : ${i.notes ?? "—"}\n`;
  out += `  Registered : ${fmt(i.createdAt)}\n`;
  out += "\n";
}

console.log(out);
saveReport("investors.txt", out);
await prisma.$disconnect();
