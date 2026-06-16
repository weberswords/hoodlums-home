// Render a branded social HTML card to PNG at exact pixel size.
// Usage: node scripts/render-social.js <input.html> <output.png> <width> <height> [format]
// format (fb|sq|tt) is appended as ?f=<format> so one template drives all sizes.
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');

(async () => {
  const [, , inFile, outFile, w = '1200', h = '630', fmt] = process.argv;
  const width = parseInt(w, 10), height = parseInt(h, 10);
  const url = 'file://' + path.resolve(inFile) + (fmt ? `?f=${fmt}` : '');
  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args: ['--no-sandbox', '--font-render-hinting=none'],
  });
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 2 });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const card = await page.$('.card');
  await (card || page).screenshot({ path: outFile });
  await browser.close();
  console.log('wrote', outFile);
})();
