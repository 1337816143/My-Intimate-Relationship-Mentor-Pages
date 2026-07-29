import { spawn } from "node:child_process";
import { chromium } from "playwright";

const password = "test-only-pages-password-2026-abcdef";
const server = spawn("python3", ["-m", "http.server", "4173", "--bind", "127.0.0.1"], {
  stdio: ["ignore", "pipe", "pipe"],
});

function stopServer() {
  if (!server.killed) server.kill("SIGTERM");
}

process.on("exit", stopServer);
process.on("SIGINT", () => { stopServer(); process.exit(130); });
process.on("SIGTERM", () => { stopServer(); process.exit(143); });

async function waitForServer() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch("http://127.0.0.1:4173/");
      if (response.ok) return;
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  throw new Error("Static test server did not start.");
}

let browser;
try {
  await waitForServer();
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const consoleErrors = [];
  page.on("console", message => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", error => consoleErrors.push(error.message));

  await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
  await page.locator("#password").fill(password);
  await page.locator("#unlock-button").click();

  await page.locator("#viewer").waitFor({ state: "visible", timeout: 15000 });
  const ready = page.frameLocator("#app-frame").locator("[data-smoke-ready]");
  await ready.waitFor({ state: "visible", timeout: 15000 });
  const text = await ready.textContent();
  if (text !== "FRAME_READY") throw new Error(`Unexpected iframe content: ${text}`);
  if (consoleErrors.length > 0) throw new Error(`Browser console errors: ${consoleErrors.join(" | ")}`);

  console.log("Encrypted iframe browser smoke test passed.");
} finally {
  await browser?.close();
  stopServer();
}
