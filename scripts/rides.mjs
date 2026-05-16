// all rides — fare, route, status, driver, rider
// Usage: node scripts/rides.mjs
import { prisma, fmt, rupees, pad, line, header, saveReport } from "./_db.mjs";

const rides = await prisma.ride.findMany({
  include: { driver: true, rider: true, vehicle: true, review: true },
  orderBy: { createdAt: "desc" },
});

const byStatus = {};
let totalFare = 0;
for (const r of rides) {
  byStatus[r.status] = (byStatus[r.status] ?? 0) + 1;
  totalFare += r.totalFare ?? 0;
}

let out = header("MOBILITY — ALL RIDES");
out += `  Total rides  : ${rides.length}\n`;
out += `  Total fares  : ${rupees(totalFare)}\n\n`;
out += "── BY STATUS ──\n";
for (const [s, n] of Object.entries(byStatus)) out += `  ${pad(s, 16)} ${n}\n`;

out += "\n── RIDE DETAILS ──\n";
for (const r of rides) {
  out += `\n${line("─", 70)}\n`;
  out += `Ride     : ${r.rideNumber}  |  ${r.serviceType}  |  Status: ${r.status}\n`;
  out += `Rider    : ${r.rider?.name ?? "—"}  (${r.rider?.phoneNumber ?? "—"})\n`;
  out += `Driver   : ${r.driver?.name ?? "Unassigned"}  (${r.driver?.phoneNumber ?? "—"})\n`;
  if (r.vehicle) out += `Vehicle  : ${r.vehicle.make} ${r.vehicle.model} — ${r.vehicle.registrationNumber}\n`;
  out += `From     : ${r.pickupAddress}\n`;
  out += `To       : ${r.dropoffAddress}\n`;
  out += `Fare     : ${rupees(r.estimatedFare)} estimated  →  ${rupees(r.totalFare ?? r.actualFare)} final\n`;
  out += `Payment  : ${r.paymentMethod}  |  ${r.paymentStatus}\n`;
  out += `Date     : ${fmt(r.createdAt)}\n`;
  if (r.review) out += `Review   : ${r.review.rating}/5  — "${r.review.comment ?? "No comment"}"\n`;
}

console.log(out);
saveReport("rides.txt", out);
await prisma.$disconnect();
