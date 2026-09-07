const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 412, height: 915 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  page.on("console", (msg) => {
    if (msg.type() === "error") console.log("CONSOLE ERROR:", msg.text());
  });
  await page.goto("http://localhost:3001", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: process.argv[2] || "hero-mobile.png" });
  await browser.close();
})();
