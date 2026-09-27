/**
 * Verificação estática do build (dist/):
 * - todo link interno aponta para uma página ou arquivo que existe;
 * - âncoras (#id) existem na página de destino;
 * - cada página tem 1 <h1>, <title>, description, canonical e JSON-LD válido;
 * - nenhum id duplicado na mesma página.
 * Uso: npm run build && npm run test:links
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const dist = resolve(import.meta.dirname, '..', 'dist');
const files = [];
const walk = (dir) =>
  readdirSync(dir).forEach((f) => {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.html')) files.push(p);
  });
walk(dist);

const pages = new Map();
for (const file of files) {
  const html = readFileSync(file, 'utf8');
  const url = '/' + relative(dist, file).replace(/\\/g, '/').replace(/index\.html$/, '').replace(/\.html$/, '/');
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  pages.set(url, { file, html, ids: new Set(ids), idList: ids });
}

const problems = [];
let linkCount = 0;

const resolveTarget = (path) => {
  if (pages.has(path)) return pages.get(path);
  const asFile = join(dist, decodeURIComponent(path));
  if (existsSync(asFile) && statSync(asFile).isFile()) return { asset: true };
  return null;
};

for (const [url, page] of pages) {
  const { html } = page;
  const where = url === '/404/' ? '/404.html' : url;

  // Metadados essenciais
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) problems.push(`${where}: ${h1} elementos <h1> (esperado 1)`);
  if (!/<title>[^<]{10,}<\/title>/.test(html)) problems.push(`${where}: <title> ausente ou curto`);
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';
  if (desc.length < 70 || desc.length > 170) problems.push(`${where}: meta description com ${desc.length} caracteres`);
  if (!/<link rel="canonical" href="https:\/\/[^"]+\/"/.test(html)) problems.push(`${where}: canonical ausente`);
  if (!/<html lang="pt-BR"/.test(html)) problems.push(`${where}: lang ausente`);

  // JSON-LD
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const data = JSON.parse(m[1]);
      if (!data['@context'] || !Array.isArray(data['@graph'])) problems.push(`${where}: JSON-LD sem @context/@graph`);
    } catch (e) {
      problems.push(`${where}: JSON-LD inválido (${e.message})`);
    }
  }

  // IDs duplicados
  const seen = new Set();
  for (const id of page.idList) {
    if (seen.has(id)) problems.push(`${where}: id duplicado "${id}"`);
    seen.add(id);
  }

  // Links internos e âncoras
  for (const m of html.matchAll(/\shref="([^"]+)"/g)) {
    const href = m[1].replace(/&amp;/g, '&');
    if (/^(https?:|mailto:|tel:|data:)/.test(href)) continue;
    linkCount++;
    const [pathAndQuery, hash] = href.split('#');
    const path = (pathAndQuery || url).split('?')[0];
    const target = resolveTarget(path);
    if (!target) {
      problems.push(`${where}: link quebrado → ${href}`);
      continue;
    }
    if (hash && !target.asset && !target.ids.has(hash)) problems.push(`${where}: âncora inexistente → ${href}`);
    if (!path.endsWith('/') && !target.asset) problems.push(`${where}: link sem barra final → ${href}`);
  }
}

console.log(`${pages.size} páginas, ${linkCount} links internos verificados.`);
if (problems.length) {
  console.log(`\n${problems.length} problema(s):`);
  problems.forEach((p) => console.log(' - ' + p));
  process.exit(1);
}
console.log('Nenhum problema encontrado.');
