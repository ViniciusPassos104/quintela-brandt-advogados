/**
 * Prefixa os caminhos absolutos do build com um subcaminho de publicação
 * (ex.: "/quintela-brandt-advogados" no GitHub Pages de projeto).
 *
 * Só altera valores de atributo (href, src, action) e url() dos arquivos CSS.
 * O conteúdo de <script> e <style> embutidos não é tocado: a CSP da página
 * tem os hashes desses blocos, e qualquer mudança os invalidaria.
 * URLs completas (https://…) já saem com o subcaminho via SITE_URL.
 *
 * Uso: node scripts/rebase.mjs /nome-do-repositorio
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, extname } from 'node:path';

const base = (process.argv[2] ?? '').replace(/\/$/, '');
if (!base) {
  console.log('Sem subcaminho: nada a fazer.');
  process.exit(0);
}
if (!base.startsWith('/')) {
  console.error(`O subcaminho deve começar com "/": recebido "${base}"`);
  process.exit(1);
}

const dist = resolve(import.meta.dirname, '..', 'dist');
const files = [];
const walk = (dir) =>
  readdirSync(dir).forEach((f) => {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else files.push(p);
  });
walk(dist);

let changed = 0;
for (const file of files) {
  const ext = extname(file);
  if (ext !== '.html' && ext !== '.css') continue;
  const before = readFileSync(file, 'utf8');
  const after =
    ext === '.css'
      ? before.replace(/url\((['"]?)\/(?!\/)/g, `url($1${base}/`)
      : before.replace(/\s(href|src|action)="\/(?!\/)/g, ` $1="${base}/`);
  if (after !== before) {
    writeFileSync(file, after);
    changed++;
  }
}
console.log(`${changed} arquivos ajustados para o subcaminho ${base}/`);
