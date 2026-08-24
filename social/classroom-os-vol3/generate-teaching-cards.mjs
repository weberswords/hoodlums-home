// Generates the ClassroomOS Vol. III *teaching* wave: education-first posts that
// deliver the idea (not the seat) and route to the white paper, which captures an
// email. One design across Facebook, Instagram, TikTok, and LinkedIn sizes.
// Shares the visual system with generate-cards.mjs. Run: node generate-teaching-cards.mjs
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, '..', '..');

const fontData = (f) =>
  'data:font/woff2;base64,' + readFileSync(join(repo, 'fonts', f)).toString('base64');
const grift = {
  regular: fontData('Grift-Regular.woff2'),
  medium: fontData('Grift-Medium.woff2'),
  bold: fontData('Grift-Bold.woff2'),
  black: fontData('Grift-Black.woff2'),
};
const badge =
  'data:image/png;base64,' +
  readFileSync(join(repo, 'assets', 'HM-badge-full.png')).toString('base64');

const C = { ink: '#0F1419', rufous: '#B7280F', tuscany: '#E0A458', bone: '#F2E8D5', cadet: '#8CA3B5' };

const cards = [
  { name: 'facebook', w: 1200, h: 630, layout: 'landscape' },
  { name: 'linkedin', w: 1200, h: 627, layout: 'landscape' },
  { name: 'instagram', w: 1080, h: 1350, layout: 'portrait' },
  { name: 'tiktok', w: 1080, h: 1920, layout: 'story' },
];

// The statement is a sentence, not a wordmark, so it runs smaller than the
// register title and is allowed to wrap.
const preset = {
  landscape: { pad: 64, statement: 78, eyebrow: 18, body: 23, foot: 16, rule: 84, badge: 560, badgeOpacity: 0.05, block: 22 },
  portrait: { pad: 92, statement: 104, eyebrow: 21, body: 29, foot: 20, rule: 110, badge: 780, badgeOpacity: 0.06, block: 34 },
  story: { pad: 100, statement: 106, eyebrow: 23, body: 32, foot: 21, rule: 116, badge: 880, badgeOpacity: 0.055, block: 42 },
};

function html({ w, h, layout }) {
  const p = preset[layout];
  const padBottom = layout === 'story' ? Math.round(h * 0.20) : p.pad;
  const padTop = layout === 'story' ? Math.round(h * 0.14) : p.pad;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    @font-face{font-family:'Grift';src:url(${grift.regular}) format('woff2');font-weight:400}
    @font-face{font-family:'Grift';src:url(${grift.medium}) format('woff2');font-weight:500}
    @font-face{font-family:'Grift';src:url(${grift.bold}) format('woff2');font-weight:700}
    @font-face{font-family:'Grift';src:url(${grift.black}) format('woff2');font-weight:900}
    *{margin:0;padding:0;box-sizing:border-box}
    html,body{width:${w}px;height:${h}px}
    .card{position:relative;width:${w}px;height:${h}px;overflow:hidden;
      background:
        radial-gradient(ellipse at 18% 82%, rgba(11,37,69,0.60) 0%, transparent 60%),
        radial-gradient(ellipse at 84% 16%, rgba(183,40,15,0.14) 0%, transparent 52%),
        ${C.ink};
      color:${C.bone};font-family:'Grift',sans-serif;
      display:flex;flex-direction:column;justify-content:space-between;
      padding:${padTop}px ${p.pad}px ${padBottom}px;}
    .badge{position:absolute;top:50%;left:50%;width:${p.badge}px;
      transform:translate(-50%,-50%);opacity:${p.badgeOpacity};pointer-events:none;z-index:0}
    .frame{position:absolute;inset:${Math.round(p.pad*0.5)}px;border:1px solid rgba(242,232,213,0.10);z-index:0}
    .content{position:relative;z-index:1;max-width:${w - p.pad*2}px}
    .eyebrow{font-weight:500;font-size:${p.eyebrow}px;letter-spacing:0.24em;text-transform:uppercase;
      color:${C.tuscany};margin-bottom:${p.block}px;max-width:${Math.round((w-p.pad*2)*0.9)}px;line-height:1.4}
    .statement{font-weight:900;font-size:${p.statement}px;line-height:1.02;letter-spacing:0.005em;color:${C.bone}}
    .statement .hot{color:${C.tuscany}}
    .rule{width:${p.rule}px;height:6px;background:${C.rufous};margin:${p.block}px 0}
    .body{font-weight:400;font-size:${p.body}px;line-height:1.5;color:${C.cadet};
      max-width:${Math.round((w - p.pad*2)*0.96)}px}
    .foot{position:relative;z-index:1;display:flex;align-items:center;justify-content:space-between;gap:24px;
      border-top:1px solid rgba(242,232,213,0.16);padding-top:${Math.round(p.foot*1.1)}px}
    .wordmark{font-weight:900;font-size:${p.foot}px;letter-spacing:0.16em;text-transform:uppercase;color:${C.bone}}
    .cta{font-weight:500;font-size:${p.foot}px;letter-spacing:0.05em;color:${C.tuscany};text-align:right}
    ${layout !== 'landscape' ? `.foot{flex-direction:column;align-items:flex-start;gap:${Math.round(p.foot*0.55)}px}.cta{text-align:left}` : ''}
  </style></head><body>
    <div class="card">
      <img class="badge" src="${badge}" alt="">
      <div class="frame"></div>
      <div class="content">
        <div class="eyebrow">Every classroom runs on an operating system</div>
        <div class="statement">The system was <span class="hot">you</span> the whole time.</div>
        <div class="rule"></div>
        <div class="body">Most teachers inherited theirs by accident, built from old habits, mandates, and whatever survived the last in-service. It holds up until you&rsquo;re absent, or exhausted, or the schedule collapses.</div>
      </div>
      <div class="foot">
        <span class="wordmark">The Intelligent Hoodlums</span>
        <span class="cta">The ClassroomOS white paper &middot; theintelligenthoodlums.com/white-paper-request</span>
      </div>
    </div>
  </body></html>`;
}

const browser = await chromium.launch({ args: ['--no-sandbox'] });
for (const card of cards) {
  const page = await browser.newPage({ viewport: { width: card.w, height: card.h }, deviceScaleFactor: 1 });
  await page.setContent(html(card), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const out = join(here, `classroom-os-vol3-teach-${card.name}-${card.w}x${card.h}.png`);
  await page.screenshot({ path: out, clip: { x: 0, y: 0, width: card.w, height: card.h } });
  await page.close();
  console.log('wrote', out);
}
await browser.close();
