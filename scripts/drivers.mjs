// mobility drivers and riders (MobilityUser table)
// Usage: node scripts/drivers.mjs
import { prisma, fmt, pad, line, header, saveReport } from "./_db.mjs";

const users = await prisma.mobilityUser.findMany({
  include: { vehicles: true, _count: { select: { ridesAsDriver: true, ridesAsRider: true } } },
  orderBy: { createdAt: "asc" },
});

const drivers = users.filter((u) => u.role === "driver");
const riders  = users.filter((u) => u.role !== "driver");

function section(title, list) {
  let s = `\n── ${title} (${list.length}) ──\n\n`;
  s += pad("Name", 22) + pad("Phone", 14) + pad("Rating", 8) + pad("Rides", 8) + pad("Verified", 10) + pad("Active", 8) + "Joined\n";
  s += line("─", 80) + "\n";
  for (const u of list) {
    const rideCount = u.role === "driver" ? u._count.ridesAsDriver : u._count.ridesAsRider;
    s += pad(u.name, 22) + pad(u.phoneNumber, 14) + pad(u.rating.toFixed(1), 8) + pad(rideCount, 8) + pad(u.isVerified ? "Yes" : "No", 10) + pad(u.isActive ? "Yes" : "No", 8) + fmt(u.createdAt) + "\n";
    if (u.vehicles?.length) {
      for (const v of u.vehicles) {
        s += `    🚗 ${v.make} ${v.model} (${v.year}) — ${v.registrationNumber} — ${v.color} — ${v.type}\n`;
      }
    }
  }
  return s;
}

let out = header("MOBILITY — DRIVERS & RIDERS");
out += `  Total mobility users: ${users.length}  (${drivers.length} drivers, ${riders.length} riders)\n`;
out += section("DRIVERS", drivers);
out += section("RIDERS", riders);

console.log(out);
saveReport("drivers.txt", out);
await prisma.$disconnect();
