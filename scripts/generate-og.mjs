/**
 * Gera as imagens de compartilhamento (Open Graph, 1200×630) e os ícones
 * a partir de templates HTML, renderizados no Chrome via Playwright.
 * Uso: npm run og   (requer Google Chrome instalado)
 */
import { chromium } from 'playwright';
import { readFileSync, readdirSync, mkdirSync, writeFileSync, rmSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { AREAS } from '../src/data/areas.ts';
import { TEAM } from '../src/data/team.ts';
import { tangledPoints, toPath, THREAD_W, THREAD_H } from '../src/lib/thread.ts';

const root = resolve(import.meta.dirname, '..');
const pub = join(root, 'public');
const fonts = pathToFileURL(join(pub, 'fonts')).href;
mkdirSync(join(pub, 'og'), { recursive: true });

const articles = readdirSync(join(root, 'src/content/artigos'))
  .filter((f) => f.endsWith('.md'))
  .map((f) => {
    const src = readFileSync(join(root, 'src/content/artigos', f), 'utf8');
    const title = src.match(/^title:\s*'(.+)'$/m)?.[1].replace(/''/g, "'");
    const area = src.match(/^area:\s*(.+)$/m)?.[1].trim();
    return { id: f.replace(/\.md$/, ''), title, area };
  });

const thread = toPath(tangledPoints());
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const page = (label, title, sub = '') => `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>
@font-face{font-family:D;src:url(${fonts}/newsreader-display.woff2)}
@font-face{font-family:D;font-style:italic;src:url(${fonts}/newsreader-display-italic.woff2)}
@font-face{font-family:S;src:url(${fonts}/hanken-grotesk.woff2);font-weight:400 650}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#f3f0e9;color:#15171a;font-family:S;position:relative;overflow:hidden}
.pad{position:absolute;inset:64px 72px;display:flex;flex-direction:column;justify-content:space-between}
.brand{display:flex;align-items:center;gap:16px;font-family:D;font-size:34px;letter-spacing:-.01em}
.brand small{font-family:S;font-size:14px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:#5e5d59;padding-left:14px;border-left:1px solid #cfc8ba}
.label{font-size:17px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#8c2a1e;margin-bottom:22px}
h1{font-family:D;font-weight:360;font-size:${title.length > 60 ? 58 : title.length > 38 ? 68 : 84}px;line-height:1.04;letter-spacing:-.022em;max-width:820px}
h1 em{color:#8c2a1e}
.sub{margin-top:22px;font-size:22px;color:#4a4c50;max-width:760px}
.foot{display:flex;justify-content:space-between;font-size:17px;color:#5e5d59;border-top:1px solid #cfc8ba;padding-top:18px;max-width:840px}
svg.t{position:absolute;right:70px;top:0;height:630px;width:auto}
</style></head><body>
<svg class="t" viewBox="0 0 ${THREAD_W} ${THREAD_H}"><path d="${thread}" fill="none" stroke="#8c2a1e" stroke-width="2.2" vector-effect="non-scaling-stroke"/></svg>
<div class="pad">
 <div class="brand"><svg width="44" height="40" viewBox="0 0 34 30"><circle cx="13" cy="13" r="11.5" fill="#8c2a1e"/><circle cx="13" cy="13" r="7.4" fill="none" stroke="#f3f0e9" stroke-width="1"/><path d="M18.6 18.6c3.4 3.6 6.8 5.4 13.4 5.4" fill="none" stroke="#8c2a1e" stroke-width="1.5" stroke-linecap="round"/></svg>Quintela Brandt <small>Advogados</small></div>
 <div><p class="label">${esc(label)}</p><h1>${title}</h1>${sub ? `<p class="sub">${esc(sub)}</p>` : ''}</div>
 <div class="foot"><span>Família · Sucessões · Empresas familiares · Imobiliário</span><span>Belo Horizonte</span></div>
</div></body></html>`;

const icon = (size) => `<!doctype html><html><head><style>*{margin:0}body{width:${size}px;height:${size}px;background:#f3f0e9;display:grid;place-items:center}</style></head><body>
<svg width="${size * 0.78}" height="${size * 0.78}" viewBox="0 0 64 64"><circle cx="28" cy="28" r="19" fill="#8c2a1e"/><circle cx="28" cy="28" r="12" fill="none" stroke="#f3f0e9" stroke-width="2"/><path d="M37.5 37.5c5.5 6 11 9 20.5 9" fill="none" stroke="#8c2a1e" stroke-width="3.2" stroke-linecap="round"/></svg></body></html>`;

const jobs = [
  { out: 'og/default.png', html: page('Advocacia em Belo Horizonte', 'Questões de família raramente são <em>só</em> de família.') },
  ...AREAS.map((a) => ({ out: `og/atuacao-${a.slug}.png`, html: page(`Área de atuação · ${a.index}`, esc(a.h1), a.lead) })),
  ...TEAM.map((l) => ({ out: `og/equipe-${l.slug}.png`, html: page(l.role, esc(l.name), l.focus.join(' · ')) })),
  ...articles.map((a) => ({
    out: `og/artigo-${a.id}.png`,
    html: page(`Artigo · ${AREAS.find((x) => x.slug === a.area)?.name ?? ''}`, esc(a.title)),
  })),
];

// Renderiza a partir de um arquivo temporário: páginas file:// podem carregar
// as fontes locais (setContent roda em about:blank, que as bloqueia).
const tmp = mkdtempSync(join(tmpdir(), 'qb-og-'));
const render = async (tab, html) => {
  const file = join(tmp, 'page.html');
  writeFileSync(file, html);
  await tab.goto(pathToFileURL(file).href, { waitUntil: 'load' });
};

const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({ viewport: { width: 1200, height: 630 } });
const tab = await ctx.newPage();
for (const job of jobs) {
  await render(tab, job.html);
  await tab.evaluate(() => document.fonts.ready);
  await tab.screenshot({ path: join(pub, job.out) });
  console.log('✓', job.out);
}
for (const [size, name] of [
  [32, 'favicon-32.png'],
  [180, 'apple-touch-icon.png'],
  [192, 'icon-192.png'],
  [512, 'logo-512.png'],
]) {
  await tab.setViewportSize({ width: size, height: size });
  await render(tab, icon(size));
  await tab.screenshot({ path: join(pub, name) });
  console.log('✓', name);
}
await browser.close();
rmSync(tmp, { recursive: true, force: true });
