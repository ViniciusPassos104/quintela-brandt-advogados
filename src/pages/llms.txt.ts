import type { APIRoute } from 'astro';
import { SITE, fullAddress } from '@/data/site';
import { AREAS } from '@/data/areas';
import { TEAM } from '@/data/team';
import { getArticles } from '@/lib/articles';

// Resumo legível por máquinas (llms.txt), gerado a partir das mesmas fontes do site.
export const GET: APIRoute = async () => {
  const articles = await getArticles();
  const u = (p: string) => `${SITE.url}${p}`;
  const text = `# ${SITE.name}

> ${SITE.description} Fundado em ${SITE.foundingYear}. Atendimento presencial em ${SITE.address.city}/${SITE.address.state} e por vídeo.

- Endereço: ${fullAddress}
- Telefone e WhatsApp: ${SITE.phone.display}
- E-mail: ${SITE.email}
- Horário: ${SITE.hours.label}
- Primeiro contato: resposta ${SITE.responseTime}; o trabalho começa só após contrato de honorários.

## Áreas de atuação

${AREAS.map((a) => `- [${a.h1}](${u(`/atuacao/${a.slug}/`)}): ${a.lead}`).join('\n')}

## Equipe

${TEAM.map((l) => `- [${l.name}](${u(`/equipe/${l.slug}/`)}), ${l.role.toLowerCase()}: ${l.summary}`).join('\n')}

## Como trabalhamos

- [Método, honorários e comunicação](${u('/como-trabalhamos/')})
- [Dúvidas frequentes](${u('/duvidas/')})
- [Contato](${u('/contato/')})

## Artigos

${articles.map((a) => `- [${a.data.title}](${u(`/artigos/${a.id}/`)}): ${a.data.description}`).join('\n')}
`;
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
