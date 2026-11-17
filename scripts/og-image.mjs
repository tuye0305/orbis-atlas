#!/usr/bin/env node
// Renders the social link-preview card (public/og-image.jpg, 1200×630) from the real globe.
// Starts `vite preview` on a built app (run `npm run build` first), photographs the globe in
// headless Chromium with the UI chrome hidden, then lays that photo beside the title in a
// second page and screenshots the card.
//   npm run og
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public', 'og-image.jpg');
const PORT = 4181;
const GLOBE = 900; // the globe photo is GLOBE×GLOBE CSS px, before scaling into the card

const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { cwd: ROOT, stdio: 'pipe' });
await new Promise((resolve, reject) => {
  const t = setTimeout(() => reject(new Error('vite preview did not start')), 20000);
  server.stdout.on('data', (d) => String(d).includes(String(PORT)) && (clearTimeout(t), resolve()));
});

const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
try {
  // 1. The globe. Reduced motion lands the camera on Afro-Eurasia at once instead of swinging in.
  const page = await browser.newPage({ viewport: { width: GLOBE, height: GLOBE }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  await page.goto(`http://localhost:${PORT}/?year=1280&lang=en`, { waitUntil: 'networkidle' });
  await page.locator('.intro .btn-ghost:not([disabled])').click({ timeout: 30000 });
  // Keep the realm names and portraits; event pills crowd a thumbnail.
  await page.addStyleTag({
    content: `.topbar, .ui-main, .disclaimer, .hover-tip, .vignette, .globe-overlay > .mk-event { display: none !important; }`,
  });
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(6000); // textures decode, borders draw, markers settle
  const globe = await page.screenshot({ type: 'png' });
  await page.close();

  // 2. The card.
  const card = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await card.setContent(
    `<!doctype html><html><head><meta charset="utf-8">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=Inter:wght@500&family=Noto+Serif+SC:wght@700&display=block">
    <style>
      html, body { margin: 0; width: 1200px; height: 630px; overflow: hidden; background: #05070d; color: #f2e8d5; }
      .globe { position: absolute; top: -95px; right: -150px; width: 820px; height: 820px;
        background: url(data:image/png;base64,${globe.toString('base64')}) center / cover; }
      .fade { position: absolute; inset: 0;
        background: linear-gradient(90deg, #05070d 0%, #05070d 36%, rgba(5,7,13,0.75) 46%, rgba(5,7,13,0) 58%); }
      .text { position: absolute; left: 72px; top: 0; bottom: 0; display: flex; flex-direction: column; justify-content: center; }
      h1 { margin: 0; font: 600 92px/1 'Cormorant Garamond', serif; letter-spacing: 0.01em; }
      .zh { margin-top: 12px; font: 700 40px/1.1 'Noto Serif SC', serif; color: #d9b26a; letter-spacing: 0.2em; }
      .rule { width: 64px; height: 2px; background: #d9b26a; margin: 30px 0 26px; opacity: 0.8; }
      p { margin: 0; max-width: 440px; font: 500 28px/1.35 'Inter', sans-serif; color: #c9bba0; }
      .url { margin-top: 30px; font: 500 18px/1 'Inter', sans-serif; letter-spacing: 0.14em; color: #a3987f; text-transform: uppercase; }
    </style></head><body>
    <div class="globe"></div><div class="fade"></div>
    <div class="text"><h1>Orbis</h1><div class="zh">寰宇时序</div><div class="rule"></div>
      <p>2,000 years of world history on an interactive 3D globe.</p><div class="url">atlas.anyloop.ai</div></div>
    </body></html>`,
    { waitUntil: 'networkidle' },
  );
  await card.evaluate(() => document.fonts.ready);
  await card.screenshot({ path: OUT, type: 'jpeg', quality: 86 });
  console.log(`wrote ${path.relative(ROOT, OUT)}`);
} finally {
  await browser.close();
  server.kill();
}
