import type { APIRoute } from 'astro';
import { SITE, INDEXING } from '@/data/site';
import { AREAS } from '@/data/areas';
import { TEAM } from '@/data/team';
import { getArticles, isoDate } from '@/lib/articles';

// Só URLs canônicas e indexáveis, com lastmod real (sem changefreq/priority,
// que o Google ignora). Enquanto o site estiver em noindex, o sitemap sai vazio.
const STATIC = [
  { path: '/', lastmod: '2026-09-02' },
  { path: '/escritorio/', lastmod: '2026-09-01' },
  { path: '/atuacao/', lastmod: '2026-09-01' },
  { path: '/como-trabalhamos/', lastmod: '2026-09-01' },
  { path: '/equipe/', lastmod: '2026-09-01' },
  { path: '/artigos/', lastmod: '2026-09-02' },
  { path: '/duvidas/', lastmod: '2026-09-01' },
  { path: '/contato/', lastmod: '2026-09-01' },
  { path: '/politica-de-privacidade/', lastmod: '2026-09-01' },
  { path: '/termos-de-uso/', lastmod: '2026-09-01' },
];

export const GET: APIRoute = async () => {
  const articles = await getArticles();
  const urls = INDEXING
    ? [
        ...STATIC,
        ...AREAS.map((a) => ({ path: `/atuacao/${a.slug}/`, lastmod: '2026-09-01' })),
        ...TEAM.map((l) => ({ path: `/equipe/${l.slug}/`, lastmod: '2026-09-01' })),
        ...articles.map((a) => ({ path: `/artigos/${a.id}/`, lastmod: isoDate(a.data.updated ?? a.data.published) })),
      ]
    : [];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE.url}${u.path}</loc><lastmod>${u.lastmod}</lastmod></url>`).join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
