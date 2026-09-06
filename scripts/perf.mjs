/** Measures transfer weight and paint timings for the key routes. */
import { chromium } from "playwright";

const B = process.env.B || "http://127.0.0.1:3231";
const ROUTES = ["/", "/collections/millenium", "/collections/millenium/noir", "/cart"];
const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
  args: ["--no-sandbox"],
});

for (const route of ROUTES) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const bytes = { doc: 0, js: 0, css: 0, img: 0, font: 0, other: 0 };
  page.on("response", async (res) => {
    const type = res.request().resourceType();
    const len = Number(res.headers()["content-length"] ?? 0);
    const key =
      type === "document" ? "doc"
      : type === "script" ? "js"
      : type === "stylesheet" ? "css"
      : type === "image" ? "img"
      : type === "font" ? "font"
      : "other";
    bytes[key] += len;
  });

  await page.goto(B + route, { waitUntil: "networkidle" });
  const timing = await page.evaluate(
    () =>
      new Promise((resolve) => {
        const nav = performance.getEntriesByType("navigation")[0];
        new PerformanceObserver((list) => {
          const e = list.getEntries().at(-1);
          resolve({
            lcp: Math.round(e.startTime),
            dcl: Math.round(nav.domContentLoadedEventEnd),
            fcp: Math.round(performance.getEntriesByName("first-contentful-paint")[0]?.startTime ?? 0),
          });
        }).observe({ type: "largest-contentful-paint", buffered: true });
        setTimeout(() => resolve({ lcp: -1, dcl: -1, fcp: -1 }), 4000);
      })
  );

  const kb = (n) => (n / 1024).toFixed(0).padStart(4) + "k";
  const total = Object.values(bytes).reduce((a, b) => a + b, 0);
  console.log(
    `${route.padEnd(32)} FCP ${String(timing.fcp).padStart(4)}ms  LCP ${String(timing.lcp).padStart(4)}ms  ` +
      `| html${kb(bytes.doc)} js${kb(bytes.js)} css${kb(bytes.css)} img${kb(bytes.img)} font${kb(bytes.font)} = ${kb(total)}`
  );
  await page.close();
}
await browser.close();
