/**
 * Listet alle offenen [[PLATZHALTER]] im gebauten Output auf.
 * Bricht den Build nicht ab — die Seite soll sich auch unfertig ansehen
 * lassen. Aber niemand soll versehentlich mit [[FIRMENNAME]] live gehen.
 */
import { readdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const dist = path.resolve(import.meta.dirname, "../dist");
if (!existsSync(dist)) process.exit(0);

const treffer = new Map();

async function lauf(ordner) {
  for (const eintrag of await readdir(ordner, { withFileTypes: true })) {
    const p = path.join(ordner, eintrag.name);
    if (eintrag.isDirectory()) await lauf(p);
    else if (eintrag.name.endsWith(".html")) {
      const text = await readFile(p, "utf8");
      for (const m of text.matchAll(/\[\[([A-ZÄÖÜ0-9_ .-]+)\]\]/g)) {
        const seite = "/" + path.relative(dist, p);
        treffer.set(m[1], (treffer.get(m[1]) ?? new Set()).add(seite));
      }
    }
  }
}

await lauf(dist);

if (treffer.size === 0) {
  console.log("\n  platzhalter: keine offen.\n");
  process.exit(0);
}

console.log(`\n  platzhalter: ${treffer.size} offen — vor dem Livegang fuellen:`);
for (const [name, seiten] of [...treffer].sort()) {
  console.log(`    [[${name}]]  ${[...seiten].sort().join(" ")}`);
}
console.log("");
