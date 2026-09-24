// Boots the game exactly like a player's browser would — serves the repo
// root over plain HTTP (index.html loads vendor/react, vendor/react-dom,
// and vendor/babel same-origin, no CDN) and checks it actually renders the
// title screen with zero console/page errors. This is the one automated
// check standing between "the file compiles" and "the page is blank when
// it goes live", since there's no build step to catch a broken commit.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", process.env.SMOKE_ROOT || ".");

const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg",
  ".svg": "image/svg+xml", ".mp3": "audio/mpeg",
};

function startServer() {
  const server = createServer(async (req, res) => {
    try {
      const urlPath = decodeURIComponent(req.url.split("?")[0]);
      const filePath = path.join(ROOT, urlPath === "/" ? "/index.html" : urlPath);
      if (!filePath.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }
      const st = await stat(filePath);
      if (!st.isFile()) { res.writeHead(404); res.end(); return; }
      const body = await readFile(filePath);
      res.writeHead(200, { "content-type": MIME[path.extname(filePath)] || "application/octet-stream" });
      res.end(body);
    } catch {
      res.writeHead(404);
      res.end();
    }
  });
  return new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve(server)));
}

const server = await startServer();
const { port } = server.address();
const browser = await chromium.launch();
const page = await browser.newPage();

const errors = [];
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
page.on("console", (msg) => { if (msg.type() === "error") errors.push(`console: ${msg.text()}`); });
page.on("response", (res) => { if (res.status() >= 400) errors.push(`http ${res.status()}: ${res.url()}`); });
page.on("requestfailed", (req) => {
  // ERR_ABORTED is the browser cancelling in-flight requests (music, fonts)
  // when the test navigates to the next world, not a failed load
  const why = req.failure()?.errorText;
  if (why !== "net::ERR_ABORTED") errors.push(`requestfailed: ${req.url()} (${why})`);
});

let ok = true;
try {
  await page.goto(`http://127.0.0.1:${port}/index.html`, { waitUntil: "load", timeout: 20000 });
  await page.waitForSelector("text=BEGIN INFECTION", { timeout: 10000 });
  const rootText = await page.locator("#root").innerText();
  if (!rootText.includes("BEGIN INFECTION")) {
    ok = false;
    console.error("FAIL: title screen did not render 'BEGIN INFECTION'");
  }

  // Run each world for a couple of seconds (holding right + jumping) so a
  // throw in the physics/render loop of any level shows up as a pageerror,
  // then check pause/resume round-trips instead of dumping the run.
  for (let w = 0; w < 3; w++) {
    await page.goto(`http://127.0.0.1:${port}/index.html`, { waitUntil: "load", timeout: 20000 });
    await page.getByRole("button", { name: "SELECT WORLD" }).click();
    await page.getByRole("button", { name: "PLAY", exact: true }).nth(w).click();
    await page.keyboard.down("ArrowRight");
    for (let i = 0; i < 6; i++) { await page.keyboard.press("Space"); await page.waitForTimeout(300); }
    await page.keyboard.up("ArrowRight");
    await page.keyboard.press("Escape");
    await page.waitForSelector("text=RESUME", { timeout: 3000 });
    await page.keyboard.press("Escape");
    await page.waitForSelector("text=RESUME", { state: "detached", timeout: 3000 });
    await page.waitForTimeout(300);
  }
} catch (e) {
  ok = false;
  console.error("FAIL: page did not reach the title screen:", e.message);
}

if (errors.length) {
  ok = false;
  console.error("FAIL: runtime errors during load:\n" + errors.map((e) => `  - ${e}`).join("\n"));
}

await browser.close();
server.close();

if (ok) {
  console.log("OK: title screen, all three worlds, and pause/resume ran with no console/page errors.");
  process.exit(0);
} else {
  process.exit(1);
}
