# Quintela Brandt Advogados — site institucional

Site multipágina de um escritório de advocacia **fictício** de Belo Horizonte,
dedicado a família, sucessões, empresas familiares e direito imobiliário.
Construído como produto final: arquitetura, conteúdo, SEO, acessibilidade,
movimento e testes automatizados.

A estratégia completa (posicionamento, arquitetura, teses visual e de
interação, decisões de engenharia) está em [`docs/ESTRATEGIA.md`](docs/ESTRATEGIA.md).

## Comandos

| Comando | O que faz |
|---|---|
| `npm install` | Instala as dependências |
| `npm run dev` | Servidor de desenvolvimento em `localhost:4321` |
| `npm run build` | Gera o site estático em `dist/` |
| `npm run preview` | Serve o build localmente |
| `npm run lint` | `astro check` (tipos) + lint de conteúdo (expressões vedadas pela OAB, textos provisórios) |
| `npm run test:links` | Links internos, âncoras, `<h1>` único, title, description, canonical, JSON-LD e ids duplicados |
| `npm test` | 39 testes de navegador no Chrome (Playwright), com o site servido a partir de `dist/` |
| `npm run og` | Regenera as imagens de compartilhamento (`public/og/`) e os ícones |
| `npm run export:artifact` | Gera `dist-artifact/`, a versão adaptada para hospedagem como Artifact do claude.ai (links relativos, fontes embutidas, sem CSP própria) |
| `python scripts/build-fonts.py` | Regenera os subconjuntos de fonte em `public/fonts/` (requer `fonttools` e `brotli`) |

Os testes de navegador e o `npm run og` usam o Google Chrome instalado na máquina.

## Stack

- **Astro 7**: HTML estático, sem framework de UI e sem hidratação.
- **CSS puro** com tokens em três camadas (primitivos, semânticos e componentes), em `src/styles/global.css`.
- **GSAP 3.15** (ScrollTrigger e SplitText), carregado só depois da primeira pintura e só se o usuário não tiver pedido movimento reduzido.
- **Fontes self-hosted**:
  - Newsreader, em cortes de display estáticos e em corte de texto variável;
  - Hanken Grotesk.
  - Todas em subconjunto latino, entre 19 e 37 KB por arquivo.
- Transições entre páginas com **View Transitions nativas** (CSS), sem SPA.

## Estrutura

```
src/
  data/          fonte única de dados: site (NAP), áreas, equipe, método, dúvidas
  content/       artigos em Markdown (coleção tipada)
  components/    componentes; home/ reúne as seções da página inicial
  layouts/       Base.astro: <head>, SEO, JSON-LD, cabeçalho e rodapé
  lib/           schema.org, geometria do "fio", utilitários de artigos
  pages/         rotas (URLs em português, com barra final)
  scripts/       comportamento: cabeçalho/menu, explorador, formulário, movimento
  styles/        tokens e base
scripts/         testes, lint de conteúdo, geração de fontes e imagens OG
public/          fontes, imagens OG, ícones, _headers
```

## Dados fictícios — ler antes de publicar

Todo o universo do escritório foi inventado:

- nomes, trajetórias, endereço, telefone, e-mail, domínio e artigos;
- nenhuma pessoa, cliente, processo ou resultado real foi usado;
- os retratos são tipográficos (iniciais), para não associar o rosto de uma pessoa real a um advogado fictício.

Para transformar o projeto em um site real:

1. **Dados institucionais**: edite `src/data/site.ts`, onde ficam nome, endereço, telefone, WhatsApp, e-mail, horário e encarregado de dados. Troque também o domínio em `astro.config.mjs` (`site`).
2. **OAB e CNPJ**: preencha `oabRegistration` e `cnpj` em `src/data/site.ts`, e `oab` de cada pessoa em `src/data/team.ts`. Os campos estão vazios de propósito, porque um número inventado poderia coincidir com o de alguém real. Quando preenchidos, aparecem no rodapé, na política de privacidade e nos perfis. O Código de Ética da OAB exige o número de inscrição na publicidade.
3. **Fotos**: adicione `photo: '/equipe/nome.jpg'` em `src/data/team.ts`; o retrato tipográfico é substituído automaticamente.
4. **Redes sociais**: preencha `social` em `src/data/site.ts`; os links só aparecem quando existem.
5. **Indexação**: enquanto os dados forem fictícios, o site sai com `noindex` e o sitemap vazio. Publicar um "negócio local" inexistente violaria as diretrizes do Google. Para liberar, gere o build com `PUBLIC_INDEXING=true`.
6. **Formulário**: defina `PUBLIC_FORM_ENDPOINT` (Formspree, Netlify Forms, backend próprio). O formulário envia JSON para esse endereço, e a origem entra automaticamente na CSP. Sem endpoint, o envio é apenas simulado no navegador e **nenhum dado sai da página**.
7. **Endereço no mapa**: o mapa é uma ilustração em SVG, sem requisição externa. O link "Como chegar" abre o Google Maps com o endereço de `site.ts`.

## SEO

- Cada página tem `title` e `description` próprios, canonical absoluto, Open Graph e Twitter Card, com imagem OG por página.
- JSON-LD em `@graph` com `@id` estáveis:
  - `LegalService`, que é tipo de `LocalBusiness`;
  - `WebSite`, `BreadcrumbList`, `Service` (áreas), `ProfilePage` + `Person` (equipe), `BlogPosting` (artigos) e `FAQPage` (onde as perguntas estão visíveis).
- `robots.txt`, `sitemap.xml` com `lastmod` real e `llms.txt`, todos gerados a partir de `src/data`.
- NAP (nome, endereço, telefone) vem de uma única fonte, o que deixa o site pronto para o Google Business Profile e o Search Console.

## Acessibilidade e desempenho

- HTML semântico, skip link, foco visível com contraste de pelo menos 3:1, e contraste de texto calculado (tinta sobre papel = 15,8:1).
- Menu mobile em `<dialog>` nativo: foco preso, ESC fecha e o foco volta ao botão.
- Dúvidas em `<details>`; formulário com rótulos, erros em texto e foco no primeiro campo inválido.
- `prefers-reduced-motion`: nenhum código de animação é baixado e o conteúdo aparece no estado final.
- Sem JavaScript, todo o conteúdo e a navegação funcionam.
- Lighthouse mobile na última medição, com o build indexável (`PUBLIC_INDEXING=true`):
  - home: desempenho 98 (mediana de 3 execuções);
  - home, área de família, perfil e dúvidas: acessibilidade, boas práticas e SEO em 100.
  - A home foi medida depois de todas as otimizações; as outras três páginas numa rodada anterior, antes das últimas mudanças no carregamento da animação.

## Publicação

**No ar:** https://viniciuspassos104.github.io/quintela-brandt-advogados/

Cada push na `main` publica o site no GitHub Pages pelo workflow `.github/workflows/deploy.yml`, que:

1. faz o build com `SITE_URL` apontando para o endereço do Pages (canonical, Open Graph e sitemap saem corretos);
2. roda a verificação de links e o lint de conteúdo;
3. prefixa os caminhos internos com o subcaminho do repositório (`scripts/rebase.mjs`);
4. publica o resultado.

Para publicar em um domínio próprio, basta trocar `SITE_URL` e remover o passo de rebase (sem subcaminho, ele não faz nada).

O site é estático: qualquer host de arquivos serve (Netlify, Cloudflare Pages, Vercel, S3). O arquivo `public/_headers` define:

- os cabeçalhos de segurança que não podem ir em `<meta>` (`frame-ancestors`, `Permissions-Policy`);
- o cache imutável dos assets.

A CSP com hashes é gerada pelo Astro em cada página. Ative o HSTS (linha comentada em `_headers`) depois de confirmar HTTPS em todo o domínio.

## Conformidade

O conteúdo segue o Código de Ética e Disciplina da OAB e o Provimento 205/2021:

- nada de promessa de resultado, preços, gratuidade, depoimentos ou autoengrandecimento;
- o `npm run lint` verifica essas expressões no HTML gerado;
- a política de privacidade segue a LGPD;
- o site não usa cookies nem rastreadores, então não há banner de cookies.
