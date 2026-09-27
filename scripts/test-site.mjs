/**
 * Testes de navegador (Chrome real, via Playwright) sobre o build de produção.
 * Sobe o `astro preview`, percorre o site e verifica comportamento — não aparência.
 *
 *   npm run build && npm test
 *
 * Cobertura: console sem erros, overflow horizontal em 8 larguras, menu mobile
 * (abrir, foco preso, ESC, retorno do foco), skip link, FAQ, explorador de áreas,
 * formulário (validação, canal, pré-seleção, sucesso), filtro de artigos,
 * cabeçalho no scroll, fio do hero, etapas do método, reduced motion e rede
 * (nenhuma requisição externa no carregamento).
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readdirSync, statSync, existsSync, readFileSync } from 'node:fs';
import { join, relative, resolve, extname } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const dist = join(root, 'dist');
const PORT = 4391;
const BASE = `http://127.0.0.1:${PORT}`;
const WIDTHS = [360, 390, 414, 768, 1024, 1280, 1440, 1920];

// ------------------------------------------------------------------ util
const results = [];
const test = async (name, fn) => {
  try {
    await fn();
    results.push({ name, ok: true });
    console.log(`  ✓ ${name}`);
  } catch (e) {
    results.push({ name, ok: false, error: e.message });
    console.log(`  ✗ ${name}\n      ${e.message}`);
  }
};
const assert = (cond, msg) => {
  if (!cond) throw new Error(msg);
};

const pages = [];
const walk = (dir) =>
  readdirSync(dir).forEach((f) => {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (f === 'index.html') pages.push('/' + relative(dist, dir).replace(/\\/g, '/') + (dir === dist ? '' : '/'));
  });
walk(dist);
pages.sort();

// ------------------------------------------------------------- servidor
// Servidor estático mínimo sobre dist/, como um host de arquivos estáticos:
// diretórios servem index.html; caminhos inexistentes recebem 404.html com status 404.
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8', '.webmanifest': 'application/manifest+json', '.json': 'application/json',
};
const server = createServer((req, res) => {
  const url = decodeURIComponent(new URL(req.url, BASE).pathname);
  let file = join(dist, url);
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  if (!existsSync(file)) {
    res.writeHead(404, { 'Content-Type': TYPES['.html'] });
    return res.end(readFileSync(join(dist, '404.html')));
  }
  res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream' });
  res.end(readFileSync(file));
});
await new Promise((r) => server.listen(PORT, '127.0.0.1', r));
const waitServer = async () => {};

const browser = await chromium.launch({ channel: 'chrome' });
const newPage = async (opts = {}) => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...opts });
  const page = await ctx.newPage();
  page.errors = [];
  page.external = [];
  page.on('console', (m) => ['error', 'warning'].includes(m.type()) && page.errors.push(`${m.type()}: ${m.text()}`));
  page.on('pageerror', (e) => page.errors.push('pageerror: ' + e.message));
  page.on('request', (r) => !r.url().startsWith(BASE) && !r.url().startsWith('data:') && page.external.push(r.url()));
  return page;
};

try {
  await waitServer();

  // ------------------------------------------------ 1. todas as páginas
  console.log(`\n1. ${pages.length} páginas × ${WIDTHS.length} larguras — console, overflow, rede`);
  const page = await newPage();
  const overflowIssues = [];
  const consoleIssues = [];
  const externalIssues = [];
  for (const path of pages) {
    for (const w of WIDTHS) {
      await page.setViewportSize({ width: w, height: w < 768 ? 844 : 900 });
      page.errors.length = 0;
      page.external.length = 0;
      await page.goto(BASE + path, { waitUntil: 'load' });
      await page.waitForTimeout(150);
      const overflow = await page.evaluate(() => {
        const doc = document.documentElement;
        const over = doc.scrollWidth - doc.clientWidth;
        if (over <= 0) return null;
        const culprits = [...document.querySelectorAll('body *')]
          .filter((el) => el.getBoundingClientRect().right > doc.clientWidth + 1)
          .slice(0, 3)
          .map((el) => el.tagName.toLowerCase() + '.' + [...el.classList].join('.'));
        return { over, culprits };
      });
      if (overflow) overflowIssues.push(`${path} @${w}px: +${overflow.over}px (${overflow.culprits.join(', ')})`);
      page.errors.forEach((e) => consoleIssues.push(`${path} @${w}px: ${e}`));
      page.external.forEach((u) => externalIssues.push(`${path}: ${u}`));
    }
    process.stdout.write('.');
  }
  process.stdout.write('\n');
  await test('nenhum overflow horizontal em 360–1920px', () => assert(!overflowIssues.length, overflowIssues.slice(0, 8).join('\n      ')));
  await test('console sem erros nem avisos', () => assert(!consoleIssues.length, [...new Set(consoleIssues)].slice(0, 8).join('\n      ')));
  await test('nenhuma requisição externa no carregamento', () => assert(!externalIssues.length, [...new Set(externalIssues)].slice(0, 5).join('\n      ')));
  await page.context().close();

  // ------------------------------------------------ 2. menu mobile
  console.log('\n2. Menu mobile (390px)');
  {
    const p = await newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
    await p.goto(BASE + '/', { waitUntil: 'networkidle' });
    const toggle = p.locator('[data-menu-open]');
    await test('botão do menu visível e com aria-expanded=false', async () => {
      assert(await toggle.isVisible(), 'botão invisível');
      assert((await toggle.getAttribute('aria-expanded')) === 'false', 'aria-expanded inicial incorreto');
    });
    await toggle.click();
    await p.waitForTimeout(500);
    await test('abre como diálogo modal e move o foco para dentro', async () => {
      assert(await p.evaluate(() => document.querySelector('[data-menu]').open), 'dialog não abriu');
      assert((await toggle.getAttribute('aria-expanded')) === 'true', 'aria-expanded não mudou');
      assert(await p.evaluate(() => document.querySelector('[data-menu]').contains(document.activeElement)), 'foco fora do menu');
    });
    await test('Tab mantém o foco dentro do menu', async () => {
      for (let i = 0; i < 25; i++) await p.keyboard.press('Tab');
      const inside = await p.evaluate(() => {
        const a = document.activeElement;
        return a === document.body || document.querySelector('[data-menu]').contains(a);
      });
      assert(inside, 'foco escapou do diálogo');
    });
    await p.keyboard.press('Escape');
    await p.waitForTimeout(600);
    await test('ESC fecha e devolve o foco ao botão', async () => {
      assert(!(await p.evaluate(() => document.querySelector('[data-menu]').open)), 'menu continua aberto');
      assert(await p.evaluate(() => document.activeElement?.hasAttribute('data-menu-open')), 'foco não voltou ao botão');
    });
    await toggle.click();
    await p.waitForTimeout(500);
    await p.locator('.menu__nav a[href="/atuacao/"]').click();
    await p.waitForURL('**/atuacao/');
    await test('link do menu navega para a página', async () => assert(p.url().endsWith('/atuacao/'), p.url()));
    await p.context().close();
  }

  // ------------------------------------------------ 3. teclado e skip link
  console.log('\n3. Teclado');
  {
    const p = await newPage();
    await p.goto(BASE + '/', { waitUntil: 'networkidle' });
    await p.keyboard.press('Tab');
    await p.waitForTimeout(400);
    await test('primeiro Tab foca o "Pular para o conteúdo"', async () => {
      const t = await p.evaluate(() => document.activeElement?.textContent?.trim());
      assert(t === 'Pular para o conteúdo', `foco em: ${t}`);
      const box = await p.locator('.skip-link').boundingBox();
      assert(box && box.y >= 0, 'skip link não ficou visível');
    });
    await p.keyboard.press('Enter');
    await test('Enter leva o foco ao <main>', async () =>
      assert(await p.evaluate(() => document.activeElement?.id === 'conteudo'), 'foco não foi para o main'));
    await p.goto(BASE + '/', { waitUntil: 'networkidle' });
    await p.locator('.hero__next').focus();
    await p.keyboard.press('Tab');
    await p.waitForTimeout(300);
    await test('Tab depois do hero vai ao próximo link da página, não ao rodapé', async () => {
      const where = await p.evaluate(() => document.activeElement?.closest('section')?.id);
      assert(where === 'escritorio', `foco foi para: ${where}`);
      const op = await p.evaluate(() => getComputedStyle(document.activeElement.closest('[data-reveal]') ?? document.activeElement).opacity);
      assert(op === '1', `elemento focado com opacidade ${op}`);
    });
    await test('foco visível tem contorno', async () => {
      await p.keyboard.press('Tab');
      const outline = await p.evaluate(() => getComputedStyle(document.activeElement).outlineStyle);
      assert(outline !== 'none', `outline: ${outline}`);
    });
    await p.context().close();
  }

  // ------------------------------------------------ 4. FAQ
  console.log('\n4. Dúvidas');
  {
    const p = await newPage();
    await p.goto(BASE + '/duvidas/', { waitUntil: 'networkidle' });
    const first = p.locator('details.faq__item').first();
    await first.locator('summary').click();
    await test('clique abre a resposta', async () => assert(await first.evaluate((d) => d.open), 'não abriu'));
    await first.locator('summary').focus();
    await p.keyboard.press('Enter');
    await test('Enter fecha pelo teclado', async () => assert(!(await first.evaluate((d) => d.open)), 'não fechou'));
    await p.goto(BASE + '/', { waitUntil: 'networkidle' });
    await p.evaluate(() => document.querySelector('#duvidas').scrollIntoView());
    await p.waitForTimeout(1200);
    const home = p.locator('#duvidas details');
    await home.nth(0).locator('summary').click();
    await home.nth(1).locator('summary').click();
    await test('na home, abrir uma pergunta fecha a anterior (grupo exclusivo)', async () => {
      const open = await home.evaluateAll((els) => els.filter((d) => d.open).length);
      assert(open === 1, `${open} abertas`);
    });
    await p.context().close();
  }

  // ------------------------------------------------ 5. explorador de áreas
  console.log('\n5. Explorador de áreas (desktop)');
  {
    const p = await newPage();
    await p.goto(BASE + '/', { waitUntil: 'networkidle' });
    // Rolagem instantânea: com scroll-behavior: smooth a página ainda estaria
    // se movendo quando o mouse fosse posicionado.
    await p.evaluate(() => document.querySelector('#atuacao').scrollIntoView({ behavior: 'instant' }));
    await p.waitForTimeout(1400);
    const rows = p.locator('[data-explorer-trigger]');
    await rows.nth(2).hover();
    await p.waitForTimeout(400);
    await test('hover ativa a área e mostra o painel dela', async () => {
      const active = await p.evaluate(() => [...document.querySelectorAll('[data-explorer] > li')].findIndex((li) => li.hasAttribute('data-active')));
      assert(active === 2, `ativa: ${active}`);
      const vis = await p.locator('[data-explorer] > li').nth(2).locator('.explorer__panel').evaluate((e) => getComputedStyle(e).visibility);
      assert(vis === 'visible', `painel: ${vis}`);
    });
    await rows.nth(2).focus();
    await p.keyboard.press('Tab'); // painel da área 3 (link "Entender como funciona")
    await p.keyboard.press('Tab'); // linha da área 4
    await p.waitForTimeout(300);
    await test('foco por teclado também ativa a área', async () => {
      const active = await p.evaluate(() => [...document.querySelectorAll('[data-explorer] > li')].findIndex((li) => li.hasAttribute('data-active')));
      assert(active === 3, `ativa: ${active}`);
    });
    await rows.nth(1).click();
    await p.waitForURL('**/atuacao/sucessoes/');
    await test('clique leva direto à página da área (sem toque duplo)', async () => assert(p.url().endsWith('/atuacao/sucessoes/'), p.url()));
    await p.context().close();
  }

  // ------------------------------------------------ 6. formulário
  console.log('\n6. Formulário de contato');
  {
    const p = await newPage({ viewport: { width: 390, height: 844 } });
    await p.goto(BASE + '/contato/?assunto=imobiliario', { waitUntil: 'networkidle' });
    await test('assunto vem pré-selecionado pela URL', async () =>
      assert((await p.locator('#f-assunto').inputValue()) === 'imobiliario', await p.locator('#f-assunto').inputValue()));
    await p.locator('#f-assunto').selectOption('');
    await p.locator('[data-submit]').click();
    await test('envio vazio mostra erros em texto e foca o primeiro campo', async () => {
      assert(await p.evaluate(() => document.activeElement?.id === 'f-nome'), 'foco não foi para o nome');
      const invalid = await p.locator('[aria-invalid="true"]').count();
      assert(invalid >= 4, `${invalid} campos marcados`);
      assert((await p.locator('#f-nome-err').textContent()).length > 5, 'mensagem de erro vazia');
    });
    await p.locator('input[name="canal"][value="email"]').check({ force: true });
    await test('trocar o canal para e-mail muda rótulo e tipo do campo', async () => {
      assert((await p.locator('[data-contact-label]').textContent()) === 'Seu e-mail', 'rótulo não mudou');
      assert((await p.locator('#f-contato').getAttribute('type')) === 'email', 'tipo não mudou');
    });
    await p.locator('#f-nome').fill('Mariana Duarte');
    await p.locator('#f-contato').fill('mariana@exemplo');
    await p.locator('#f-contato').blur();
    await test('e-mail incompleto é recusado com explicação', async () =>
      assert((await p.locator('#f-contato-err').textContent()).includes('e-mail'), await p.locator('#f-contato-err').textContent()));
    await p.locator('input[name="canal"][value="whatsapp"]').check({ force: true });
    await p.locator('#f-contato').fill('31988887777');
    await test('telefone recebe máscara (xx) xxxxx-xxxx', async () =>
      assert((await p.locator('#f-contato').inputValue()) === '(31) 98888-7777', await p.locator('#f-contato').inputValue()));
    await p.locator('#f-assunto').selectOption('familia');
    await p.locator('#f-mensagem').fill('Estamos nos separando e temos uma empresa juntos.');
    await p.locator('input[name="consentimento"]').check({ force: true });
    await p.locator('[data-submit]').click();
    await p.waitForSelector('[data-done]:not([hidden])', { timeout: 5000 });
    await test('envio válido mostra a confirmação com o próximo passo', async () => {
      const t = await p.locator('[data-done-title]').textContent();
      assert(t.includes('Mariana'), t);
      assert(await p.evaluate(() => document.activeElement?.hasAttribute('data-done')), 'foco não foi para a confirmação');
      assert((await p.locator('[data-done-channel]').textContent()) === 'pelo WhatsApp', 'canal não refletido');
    });
    await p.context().close();
  }

  // ------------------------------------------------ 7. artigos
  console.log('\n7. Filtro de artigos');
  {
    const p = await newPage();
    await p.goto(BASE + '/artigos/', { waitUntil: 'networkidle' });
    await p.locator('[data-filter="imobiliario"]').click();
    await test('filtro mostra só a área escolhida e atualiza a URL', async () => {
      const visible = await p.locator('.article-row:not([hidden])').count();
      const wrong = await p.locator('.article-row:not([hidden]):not([data-area="imobiliario"])').count();
      assert(visible > 0 && wrong === 0, `${visible} visíveis, ${wrong} fora do filtro`);
      assert(p.url().includes('area=imobiliario'), p.url());
    });
    await p.goto(BASE + '/artigos/?area=familia', { waitUntil: 'networkidle' });
    await test('filtro é restaurado a partir da URL', async () =>
      assert((await p.locator('[data-filter="familia"]').getAttribute('aria-pressed')) === 'true', 'não restaurou'));
    await p.context().close();
  }

  // ------------------------------------------------ 8. movimento
  console.log('\n8. Movimento e scroll');
  {
    const p = await newPage();
    await p.goto(BASE + '/', { waitUntil: 'networkidle' });
    await p.waitForTimeout(600);
    const d0 = await p.locator('[data-thread-path]').getAttribute('d');
    await p.mouse.wheel(0, 700);
    await p.waitForTimeout(1200);
    const d1 = await p.locator('[data-thread-path]').getAttribute('d');
    await test('o fio do hero se desfaz com a rolagem', async () => assert(d0 !== d1, 'path não mudou'));
    await test('cabeçalho ganha fundo ao rolar', async () => assert(await p.locator('[data-header][data-scrolled]').count(), 'sem data-scrolled'));
    await p.mouse.wheel(0, 900);
    await p.waitForTimeout(500);
    await test('cabeçalho se esconde ao descer', async () => assert(await p.locator('[data-header][data-hidden]').count(), 'não escondeu'));
    await p.mouse.wheel(0, -300);
    await p.waitForTimeout(500);
    await test('cabeçalho reaparece ao subir', async () => assert(!(await p.locator('[data-header][data-hidden]').count()), 'continua escondido'));
    await p.locator('[data-step="3"]').scrollIntoViewIfNeeded();
    await p.evaluate(() => window.scrollBy(0, 200));
    await p.waitForTimeout(800);
    await test('etapas do método são ativadas pela rolagem', async () =>
      assert((await p.locator('.method__step.is-active').count()) >= 3, `${await p.locator('.method__step.is-active').count()} ativas`));
    await test('Mapa do Caso se preenche junto com as etapas', async () =>
      assert((await p.locator('[data-casemap] .is-shown').count()) >= 3, `${await p.locator('[data-casemap] .is-shown').count()} partes`));
    await p.context().close();
  }

  // ------------------------------------------------ 9. reduced motion
  console.log('\n9. prefers-reduced-motion: reduce');
  {
    const p = await newPage({ reducedMotion: 'reduce' });
    let gsapRequested = false;
    p.on('request', (r) => /gsap|ScrollTrigger|motion\./i.test(r.url()) && (gsapRequested = true));
    await p.goto(BASE + '/', { waitUntil: 'networkidle' });
    const d0 = await p.locator('[data-thread-path]').getAttribute('d');
    await p.mouse.wheel(0, 900);
    await p.waitForTimeout(800);
    await test('nenhum código de animação é baixado', async () => assert(!gsapRequested, 'módulo de animação foi requisitado'));
    await test('classe .motion removida (conteúdo no estado final)', async () =>
      assert(!(await p.evaluate(() => document.documentElement.classList.contains('motion'))), 'html.motion presente'));
    await test('fio não é animado pela rolagem', async () => assert(d0 === (await p.locator('[data-thread-path]').getAttribute('d')), 'path mudou'));
    await test('todos os blocos revelados estão visíveis', async () => {
      const hidden = await p.evaluate(
        () =>
          [...document.querySelectorAll('[data-reveal]')].filter((el) => {
            const s = getComputedStyle(el);
            return s.visibility === 'hidden' || +s.opacity < 1 || s.transform.includes('matrix(0');
          }).length,
      );
      assert(hidden === 0, `${hidden} elementos ocultos`);
    });
    await p.context().close();
  }

  // ------------------------------------------------ 10. sem JavaScript
  console.log('\n10. Sem JavaScript');
  {
    const p = await newPage({ javaScriptEnabled: false });
    await p.goto(BASE + '/', { waitUntil: 'networkidle' });
    await test('conteúdo visível sem JS', async () => {
      const hidden = await p.evaluate(
        () => [...document.querySelectorAll('[data-reveal]')].filter((el) => getComputedStyle(el).visibility === 'hidden' || getComputedStyle(el).opacity !== '1').length,
      );
      assert(hidden === 0, `${hidden} ocultos`);
    });
    await test('links de navegação funcionam sem JS (HTML puro)', async () => assert((await p.locator('.site-nav a[href="/equipe/"]').count()) === 1, 'nav ausente'));
    await p.context().close();
  }

  // ------------------------------------------------ 11. peso
  console.log('\n11. Peso da home (transferido)');
  {
    const p = await newPage();
    const cdp = await p.context().newCDPSession(p);
    await cdp.send('Network.enable');
    const sizes = {};
    cdp.on('Network.loadingFinished', (e) => (sizes[e.requestId] = { ...(sizes[e.requestId] || {}), bytes: e.encodedDataLength }));
    cdp.on('Network.responseReceived', (e) => (sizes[e.requestId] = { ...(sizes[e.requestId] || {}), type: e.type, url: e.response.url }));
    await p.goto(BASE + '/', { waitUntil: 'networkidle' });
    await p.waitForTimeout(500);
    const byType = {};
    Object.values(sizes).forEach((s) => (byType[s.type] = (byType[s.type] || 0) + (s.bytes || 0)));
    const total = Object.values(byType).reduce((a, b) => a + b, 0);
    console.log('   ', Object.entries(byType).map(([k, v]) => `${k}: ${(v / 1024).toFixed(1)} KB`).join(' · '), `· total ${(total / 1024).toFixed(1)} KB`);
    await test('home abaixo de 600 KB transferidos', async () => assert(total < 600 * 1024, `${(total / 1024).toFixed(1)} KB`));
    await p.context().close();
  }
} finally {
  await browser.close();
  server.close();
}

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} testes passaram.`);
process.exit(failed.length ? 1 : 0);
