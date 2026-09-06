import { chromium } from "playwright";
const CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const B = "http://127.0.0.1:3231";
const shots = [
  ["home-hero", "/", 1600, 950, 0],
  ["home-mid", "/", 1600, 950, 2400],
  ["home-grid", "/", 1600, 950, 4200],
  ["collection", "/collections/millenium", 1600, 950, 0],
  ["collection-grid", "/collections/millenium", 1600, 950, 1000],
  ["product", "/collections/millenium/spectrum", 1600, 950, 120],
  ["mobile-home", "/", 414, 896, 0],
  ["mobile-product", "/collections/millenium/solaris", 414, 896, 120],
];
const browser = await chromium.launch({ executablePath: CHROME, args: ["--no-sandbox"] });
for (const [name, path, w, h, y] of shots) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await page.goto(B + path, { waitUntil: "networkidle" });
  if (y) await page.evaluate((v) => window.scrollTo(0, v), y);
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `/tmp/claude-0/shots/${name}.png` });
  await page.close();
  console.log(name);
}
await browser.close();
