import { chromium } from "playwright";
const B = "http://127.0.0.1:3254";
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const log = (...a) => console.log(...a);

await page.goto(`${B}/collections/millenium/solaris`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: /add to bag/i }).click();
await page.waitForTimeout(700);
log("drawer opens:", await page.getByRole("dialog", { name: /shopping bag/i }).isVisible());
log("lines:", await page.locator('[role="dialog"] li').count());

await page.getByRole("button", { name: /increase quantity/i }).click();
await page.waitForTimeout(300);
log("header count after +1:", (await page.getByRole("button", { name: /open bag/i }).innerText()).trim());

// Colourway switcher navigates between references.
await page.keyboard.press("Escape");
await page.waitForTimeout(500);
await page.goto(`${B}/collections/millenium/onyx`, { waitUntil: "networkidle" });
await page.locator('a[title*="Lagoon"]').click();
await page.waitForURL("**/lagoon", { timeout: 8000 });
log("switcher navigates:", page.url().endsWith("/lagoon"));
log("selected swatch marked:", await page.locator('a[aria-current="page"][title*="Lagoon"]').count() === 1);

// Prev/next reference navigation.
await page.locator('a[rel="next"]').click();
await page.waitForTimeout(1200);
log("next reference:", page.url().split("/").pop());

// Bag page.
await page.goto(`${B}/cart`, { waitUntil: "networkidle" });
await page.waitForTimeout(800);
log("bag lines:", await page.locator("main li").count());
log("checkout disabled (not configured):", await page.getByRole("button", { name: /proceed to checkout/i }).isDisabled());
await page.getByRole("button", { name: /increase quantity/i }).first().click();
await page.waitForTimeout(400);
log("bag subtotal:", (await page.locator("main aside").innerText()).match(/(\d+)\s*€/g)?.pop());
await page.getByRole("button", { name: /^Remove$/ }).first().click();
await page.waitForTimeout(400);
log("lines after remove:", await page.locator("main li").count());

// Persistence.
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(700);
log("persisted lines:", await page.locator("main li").count());

// Mobile nav.
const m = await browser.newPage({ viewport: { width: 390, height: 844 } });
await m.goto(B, { waitUntil: "networkidle" });
await m.getByRole("button", { name: /open menu/i }).click();
await m.waitForTimeout(600);
log("mobile nav:", await m.locator("#mobile-nav a").first().isVisible());
await browser.close();
