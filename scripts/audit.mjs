import { chromium } from "playwright";
const CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const B = process.env.B || "http://127.0.0.1:3231";
const routes = ["/", "/collections/millenium", "/collections/millenium/spectrum", "/maison", "/cart", "/nope"];
const browser = await chromium.launch({ executablePath: CHROME, args: ["--no-sandbox"] });
for (const r of routes) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const bad = [];
  page.on("response", res => { if (res.status() >= 400 && !r.includes("nope")) bad.push(res.status() + " " + res.url().slice(-60)); });
  page.on("pageerror", e => bad.push("JS " + e.message));
  const resp = await page.goto(B + r, { waitUntil: "networkidle" });
  const a11y = await page.evaluate(() => {
    const imgs = [...document.images].filter(i => !i.hasAttribute("alt"));
    const btns = [...document.querySelectorAll("button")].filter(b => !b.textContent.trim() && !b.getAttribute("aria-label"));
    const h1 = document.querySelectorAll("h1").length;
    const overflow = document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
    return { imgsNoAlt: imgs.length, btnsNoLabel: btns.length, h1, overflow };
  });
  console.log(r.padEnd(36), resp.status(), JSON.stringify(a11y), bad.length ? bad.slice(0,3) : "");
  await page.close();
}
// Mobile overflow check across breakpoints.
for (const w of [320, 360, 414, 768, 1024, 1280, 1440, 2560, 3840]) {
  const page = await browser.newPage({ viewport: { width: w, height: 900 } });
  await page.goto(B + "/collections/millenium/noir", { waitUntil: "networkidle" });
  const o = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  console.log(`  ${w}px overflow: ${o}`);
  await page.close();
}
await browser.close();
