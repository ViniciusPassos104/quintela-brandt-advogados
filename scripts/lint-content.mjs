/**
 * Lint de conteúdo para publicidade da advocacia.
 * Procura, no texto publicado (dist/), expressões vedadas ou de risco pelo
 * Código de Ética e Disciplina da OAB e pelo Provimento 205/2021 — promessa
 * de resultado, autoengrandecimento, gratuidade, captação — e restos de
 * conteúdo provisório (lorem ipsum, "[INSIRA", TODO).
 *
 * Uso: npm run build && node scripts/lint-content.mjs
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const dist = resolve(import.meta.dirname, '..', 'dist');

const RULES = [
  { re: /\b(o|os|a|as) melhor(es)?\b(?! forma| caminho| momento| via| solução| alternativa)/i, why: 'autoengrandecimento ("o melhor")' },
  { re: /\bn[ºo°]\s?1\b|\bnúmero um\b|\blíder(es)? (de|em|no)\b/i, why: 'autoengrandecimento (ranking)' },
  { re: /\bexcelência\b/i, why: 'autoengrandecimento ("excelência")' },
  { re: /\bgarant(imos|ia de resultado|ido|ida)\b/i, why: 'promessa de resultado' },
  { re: /\b100\s?%/i, why: 'promessa/estatística absoluta' },
  { re: /\b(sucesso|êxito|vitória) garantid[oa]\b|\btaxa de (sucesso|êxito)\b/i, why: 'promessa de resultado' },
  { re: /\b(grátis|gratuit[oa]s?|sem custo|desconto|parcelamos)\b/i, why: 'gratuidade/preço (vedado na publicidade)' },
  { re: /\bespecialistas?\b/i, why: '"especialista" exige título correspondente' },
  { re: /\b(não perca|últimas? vagas?|vagas limitadas|só hoje|corra|aproveite)\b/i, why: 'urgência/escassez (captação)' },
  { re: /\b(processe já|entre com (a|sua) ação|você tem direito!)\b/i, why: 'incitação ao litígio' },
  { re: /\blorem ipsum\b|\[insira|\[nome|\[telefone/i, why: 'conteúdo provisório' },
  // sem /i e com limites Unicode: "todo" e "método" são palavras comuns em português
  { re: /(?<!\p{L})(TODO|FIXME)(?!\p{L})/u, why: 'marcador de pendência' },
  { re: /\bsite (demonstrativo|fictício)\b|\bprojeto fictício\b|\btexto de exemplo\b/i, why: 'marca de demonstração' },
];

const files = [];
const walk = (dir) =>
  readdirSync(dir).forEach((f) => {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.html')) files.push(p);
  });
walk(dist);

const problems = [];
for (const file of files) {
  const html = readFileSync(file, 'utf8');
  // só o texto visível: remove scripts, estilos, JSON-LD e tags
  const text = html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ');
  for (const { re, why } of RULES) {
    const m = text.match(new RegExp(re.source, re.flags + 'g'));
    if (!m) continue;
    for (const hit of new Set(m)) {
      const i = text.indexOf(hit);
      problems.push(`/${relative(dist, file).replace(/\\/g, '/')}: "${hit}" — ${why}\n      …${text.slice(Math.max(0, i - 60), i + 60).trim()}…`);
    }
  }
}

console.log(`${files.length} páginas verificadas contra ${RULES.length} regras de conteúdo.`);
if (problems.length) {
  console.log(`\n${problems.length} ocorrência(s):`);
  problems.forEach((p) => console.log(' - ' + p));
  process.exit(1);
}
console.log('Nenhuma expressão vedada ou provisória encontrada.');
