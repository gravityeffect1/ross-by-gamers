// Builds the itch.io upload in dist/: the same game as index.html, but with
// the inline JSX compiled and minified ahead of time into game.js, so the
// player's browser doesn't download Babel (~3 MB) or compile ~200 KB of JSX
// on every load. index.html itself stays the no-build dev version: open it
// directly and edit as before; run `npm run build` only to package a release.
import { mkdir, readFile, rm, writeFile, copyFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { transform } from "esbuild";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");

// Only what the game loads at runtime — README screenshots, the social
// preview image, and Babel stay out of the upload.
const COPY = [
  "vendor/react.production.min.js",
  "vendor/react-dom.production.min.js",
  "assets/ost-ubiquitin.mp3",
];

const html = await readFile(path.join(ROOT, "index.html"), "utf8");

const OPEN = '<script type="text/babel" data-presets="react">';
const start = html.indexOf(OPEN);
const end = html.indexOf("</script>", start);
if (start < 0 || end < 0) throw new Error(`build: couldn't find the ${OPEN} block in index.html`);
const jsx = html.slice(start + OPEN.length, end);

const { code } = await transform(jsx, {
  loader: "jsx",
  format: "iife", // wraps it so top-level names get minified too
  minify: true,
  target: "es2019",
  legalComments: "none",
});

const BABEL_TAG = '  <script src="vendor/babel.min.js"></script>\n';
if (!html.includes(BABEL_TAG)) throw new Error("build: couldn't find the Babel <script> tag in index.html");
const out = (html.slice(0, start) + '<script src="game.js"></script>' + html.slice(end + "</script>".length))
  .replace(BABEL_TAG, "");

await rm(DIST, { recursive: true, force: true });
await mkdir(path.join(DIST, "vendor"), { recursive: true });
await mkdir(path.join(DIST, "assets"), { recursive: true });
await writeFile(path.join(DIST, "index.html"), out);
await writeFile(path.join(DIST, "game.js"), code);
for (const f of COPY) await copyFile(path.join(ROOT, f), path.join(DIST, f));

console.log(`built dist/ — game.js ${(code.length / 1024).toFixed(0)} KB (from ${(jsx.length / 1024).toFixed(0)} KB JSX)`);
