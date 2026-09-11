/**
 * Leitet aus public/bilder/lumora-one.png die Web-Varianten ab:
 *   lumora-one-{400,640,900,1280,1800}.webp   für das srcset
 *   lumora-one-og.jpg                          1200x630 fuer Open Graph
 *
 * Laeuft vor jedem Build (auch auf Vercel). Fehlt die Quelldatei, bricht der
 * Build nicht ab — die Seite rendert dann ohne Produktfoto und der Hinweis
 * hier ist die einzige Stelle, die das meldet.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const wurzel = path.resolve(import.meta.dirname, "..");
const quelle = path.join(wurzel, "public/bilder/lumora-one.png");
const ziel = path.join(wurzel, "public/bilder");
const BREITEN = [400, 640, 900, 1280, 1800];

if (!existsSync(quelle)) {
  console.warn(
    "\n  bilder: public/bilder/lumora-one.png fehlt — keine WebP-Varianten erzeugt." +
      "\n          Produktfoto dort ablegen, dann laeuft das hier automatisch.\n",
  );
  process.exit(0);
}

await mkdir(ziel, { recursive: true });
const roh = await readFile(quelle);
const { width = 0, height = 0 } = await sharp(roh).metadata();

// Nur Breiten erzeugen, die die Quelle auch hergibt — sonst stuende im
// srcset eine Breitenangabe, die die Datei gar nicht hat, und der Browser
// waehlt falsch.
const erzeugt = [];
for (const breite of BREITEN) {
  if (breite > width) continue;
  const datei = path.join(ziel, `lumora-one-${breite}.webp`);
  await sharp(roh)
    .resize({ width: breite, withoutEnlargement: true })
    .webp({ quality: 82, effort: 6 })
    .toFile(datei);
  erzeugt.push(breite);
  console.log(`  bilder: lumora-one-${breite}.webp`);
}

// Die Quellbreite selbst, falls sie zwischen zwei Stufen liegt.
if (!erzeugt.includes(width)) {
  await sharp(roh)
    .webp({ quality: 82, effort: 6 })
    .toFile(path.join(ziel, `lumora-one-${width}.webp`));
  erzeugt.push(width);
  console.log(`  bilder: lumora-one-${width}.webp`);
}
erzeugt.sort((a, b) => a - b);

// Open Graph will feste 1200x630 und mag kein WebP in allen Crawlern.
await sharp({
  create: {
    width: 1200,
    height: 630,
    channels: 4,
    background: { r: 244, g: 246, b: 251, alpha: 1 },
  },
})
  .composite([
    {
      input: await sharp(roh)
        .resize({ width: 760, height: 520, fit: "inside" })
        .toBuffer(),
      gravity: "centre",
    },
  ])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(path.join(ziel, "lumora-one-og.jpg"));
console.log("  bilder: lumora-one-og.jpg");

// Produktfoto.astro liest das hier, um srcset und Seitenverhaeltnis zu setzen.
await writeFile(
  path.join(ziel, "lumora-one.varianten.json"),
  JSON.stringify({ breite: width, hoehe: height, breiten: erzeugt }, null, 2) + "\n",
);
