// Exports harvest data for the printable calendar (used by scripts/build-lead-magnet.cjs).
import { herbs } from "../src/data/herbs";
const rows = herbs.map((h) => ({ latin: h.latin, polish: h.polish, legal: !!h.legalNote, harvest: h.harvest.map((x) => ({ part: x.part, months: x.months })) }));
await Bun.write(process.argv[2] ?? "herbs.json", JSON.stringify(rows, null, 1));
console.log(`exported ${rows.length} herbs`);
