/**
 * Adapta o build (dist/) para hospedagem como Artifact do claude.ai.
 *
 * O Artifact serve arquivos relativos à própria página e envolve a página
 * principal em um esqueleto HTML. Por isso esta exportação:
 *  - reescreve URLs absolutas ("/atuacao/") para relativas, apontando
 *    diretórios para index.html ("../atuacao/index.html");
 *  - transforma a home em fragmento (sem doctype/html/head/body);
 *  - remove a CSP do próprio site (o host aplica a dele) e o manifest;
 *  - embute as fontes no CSS como data URI (fontes fora do Google Fonts
 *    só são garantidas assim no Artifact);
 *  - desliga as View Transitions entre páginas (não se aplicam no frame);
 *  - deixa de fora o que só faz sentido no domínio real (og/, sitemap, robots…).
 *
 * Uso: npm run build && node scripts/export-artifact.mjs [pasta-de-saída]
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, rmSync, copyFileSync } from 'node:fs';
import { join, relative, resolve, dirname, extname } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const dist = join(root, 'dist');
const out = resolve(process.argv[2] ?? join(root, 'dist-artifact'));
const SKIP = [/^_headers$/, /^og\//, /^robots\.txt$/, /^sitemap\.xml$/, /^llms\.txt$/, /^site\.webmanifest$/, /^404\.html$/, /^icon-192\.png$/, /^logo-512\.png$/];

rmSync(out, { recursive: true, force: true });
const files = [];
const walk = (dir) =>
  readdirSync(dir).forEach((f) => {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else files.push(relative(dist, p).replace(/\\/g, '/'));
  });
walk(dist);

// Fontes como data URI, indexadas pelo caminho publicado.
const fontData = Object.fromEntries(
  readdirSync(join(dist, 'fonts')).map((f) => [`/fonts/${f}`, `data:font/woff2;base64,${readFileSync(join(dist, 'fonts', f)).toString('base64')}`]),
);

/** "/atuacao/familia/#x" visto de uma página em profundidade `depth` */
function rel(url, depth) {
  const prefix = depth ? '../'.repeat(depth) : '';
  const m = url.match(/^\/([^?#]*)([?#].*)?$/);
  if (!m) return url;
  let [, path, rest = ''] = m;
  if (path === '' || path.endsWith('/')) path += 'index.html';
  return prefix + path + rest;
}

const published = [];
for (const file of files) {
  if (SKIP.some((re) => re.test(file))) continue;
  if (file.startsWith('fonts/')) continue; // embutidas no CSS
  const src = join(dist, file);
  // O Artifact reserva caminhos que começam com "_": _astro/ vira assets/.
  const target = file.replace(/^_astro\//, 'assets/');
  const dest = join(out, target);
  mkdirSync(dirname(dest), { recursive: true });
  const ext = extname(file);

  if (ext === '.css') {
    let css = readFileSync(src, 'utf8');
    css = css.replace(/url\((\/fonts\/[^)]+)\)/g, (_, p) => `url(${fontData[p] ?? p})`);
    // Dentro do frame do Artifact a transição entre documentos não se aplica
    // (o Chrome a aborta com aviso no console): fica só no site normal.
    css = css.replace(/@view-transition\s*\{[^}]*\}/g, '');
    writeFileSync(dest, css);
  } else if (ext === '.html') {
    const depth = file.split('/').length - 1;
    let html = readFileSync(src, 'utf8');
    html = html
      .replace(/<meta http-equiv="content-security-policy"[^>]*>/g, '')
      .replace(/<link rel="manifest"[^>]*>/g, '')
      .replace(/<link rel="preload" href="\/fonts\/[^"]*"[^>]*>/g, '')
      .replace(/\s(href|src|action)="(\/(?!\/)[^"]*)"/g, (_, attr, url) => ` ${attr}="${rel(url, depth)}"`)
      .replace(/url\((\/fonts\/[^)]+)\)/g, (_, p) => `url(${fontData[p] ?? p})`)
      .replace(/((?:\.\.\/)*)_astro\//g, '$1assets/');

    if (file === 'index.html') {
      // Página principal: o host fornece o esqueleto; aqui vai só o conteúdo.
      html = html
        .replace(/<!doctype html>/i, '')
        .replace(/<html[^>]*>/, '')
        .replace(/<\/html>/, '')
        .replace(/<\/?head>/g, '')
        .replace(/<body[^>]*>/, '<span id="topo"></span>')
        .replace(/<\/body>/, '')
        .replace(/<title>[^<]*<\/title>/, '<title>Quintela Brandt Advogados</title>')
        .replace(/(<meta charset="utf-8">)/, '$1<script>document.documentElement.lang="pt-BR"</script>');
    }
    writeFileSync(dest, html);
  } else {
    copyFileSync(src, dest);
  }
  published.push(target);
}

console.log(`${published.length} arquivos exportados para ${relative(root, out) || out}`);
console.log(JSON.stringify(published.filter((f) => f !== 'index.html')));
