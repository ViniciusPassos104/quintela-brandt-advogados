import type { APIRoute } from 'astro';
import { SITE } from '@/data/site';

// O rastreamento fica liberado mesmo com o site em noindex:
// bloquear aqui impediria o Google de ver a própria meta noindex.
export const GET: APIRoute = () =>
  new Response(
    `# ${SITE.name}
User-agent: *
Allow: /

Sitemap: ${SITE.url}/sitemap.xml
`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
