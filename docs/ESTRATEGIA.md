# Quintela Brandt Advogados — estratégia do site

Documento de decisão. Registra o que foi definido antes do código e por quê.
Tudo que aparece no site pertence a um universo fictício coerente: pessoas,
endereço, telefone, e-mail e domínio foram inventados. Ver `README.md`,
seção "Dados fictícios", antes de qualquer uso real.

## 1. Skills consultadas e como foram combinadas

| Skill | O que aproveitamos | O que adaptamos ou descartamos |
|---|---|---|
| landing-page-guide-v2 | Design thinking antes do código, direção estética única, rejeição da estética "gerada por IA", checklist de acessibilidade/performance | Stack Next.js + shadcn + Tailwind (site multipágina estático fica melhor em Astro); depoimentos, contadores, urgência e "social proof" são proibidos pelo Provimento 205/2021 da OAB e pelo briefing |
| cast / paint (genjutsu) + motion-principles | Tese de interação explícita, 5 estados por elemento, auditoria com evidência, "uma assinatura por página" | Portões de validação interativos (o briefing pediu execução direta); variantes A/B/C substituídas por uma decisão documentada |
| motion-design | Personalidade "Premium" (curva única, 3 durações), regra de 1/3, entrada > saída | "Sempre três camadas de movimento" — camada ambiente contínua foi descartada por performance e sobriedade |
| gsap-core / scrolltrigger / performance / plugins | `gsap.matchMedia()` para reduced motion, ScrollTriggers criados de cima para baixo, `batch`, SplitText com `autoSplit` + `onSplit`, só transform/opacity | Lenis/ScrollSmoother descartados: rolagem nativa é mais acessível e mais leve |
| copywriting / copy-editing / cro / marketing-psychology | Clareza > esperteza, CTA verbo + próximo passo, CTA por nível de intenção, Seven Sweeps, formulário mínimo | Prova social, escassez, FOMO, garantias e "grátis" — vetados pela ética da OAB |
| seo / seo-audit / schema / site-architecture / ai-seo | `LegalService` + `@graph` com `@id`, BreadcrumbList, Person/ProfilePage, BlogPosting, hub-and-spoke, NAP único, `llms.txt` | FAQ rich results não se aplicam a escritórios desde 2023 (marcação mantida só onde a pergunta é visível e única); `SearchAction` descartado; programmatic SEO não se aplica |
| accessibility / performance / core-web-vitals / best-practices | `<dialog>` nativo no menu, `<details>` no FAQ, skip link, foco visível 3:1, LCP tipográfico visível no primeiro frame, fontes self-hosted com fallback métrico | Reset CSS de reduced motion não afeta JS — por isso o GSAP inteiro roda dentro de `matchMedia` |
| ui-ux-pro-max / design-system / brand / design-dna | Tokens em 3 camadas, contraste calculado, voz da marca | Paleta navy + dourado e Garamond/Lato recomendadas pela busca são o "visual padrão de escritório" — descartadas de propósito |
| verification-before-completion / web-quality-audit | Nenhuma afirmação de "pronto" sem saída de comando; `analyze.sh`, Lighthouse, testes em navegador real | — |

## 2. Posicionamento

- **Que escritório é:** boutique de Belo Horizonte, fundada em 2014, dedicada às
  questões em que **relações familiares e patrimônio se cruzam**.
- **Quem atende:** pessoas e famílias em separações com patrimônio, inventários,
  planejamento sucessório; empresas familiares; compra, venda e regularização de imóveis.
- **Filosofia:** antes da estratégia, o entendimento. O processo é um dos caminhos,
  não o ponto de partida.
- **Diferencial concreto:** o **Mapa do Caso** — documento escrito entregue após a
  reunião de análise, com o que está em jogo, caminhos possíveis (inclusive sem
  processo), riscos, documentos, prazos e custos estimados.
- **Relacionamento:** um advogado responsável, com nome, do começo ao fim; tudo
  que importa por escrito; atualização mínima mensal.
- **O que não promete:** resultado. Nem prazo de processo. Nem atuar fora das
  quatro áreas (criminal, trabalhista e tributário contencioso são indicados a colegas).
- **Como quer ser percebido:** sério, claro, organizado, humano sem ser meloso.

Ideia central da experiência: **encontrar o fio da meada**. O visitante chega
com uma situação emaranhada; o site mostra como o escritório a organiza.

## 3. Identidade fictícia

| Item | Valor |
|---|---|
| Nome | Quintela Brandt Advogados (razão social: Quintela Brandt Sociedade de Advogados) |
| Sócios | Helena Quintela (família e sucessões), Otávio Brandt (empresas familiares e planejamento patrimonial) |
| Associada | Beatriz Nóbrega (imobiliário, regularização) |
| Atendimento | Clara Antunes (coordenação de agenda) |
| Endereço | Rua Professora Leonor Viana, 227, 6º andar — Funcionários, Belo Horizonte/MG |
| Contato | (31) 90417-2260 (telefone e WhatsApp) · contato@quintelabrandt.adv.br |
| Horário | Segunda a sexta, 9h às 18h · reuniões presenciais e por vídeo |

Números de inscrição na OAB e CNPJ **não são exibidos**: qualquer número
inventado poderia coincidir com o de uma pessoa ou empresa real. Os campos
existem em `src/data/site.ts` e aparecem automaticamente quando preenchidos.

## 4. Arquitetura

```
/                         narrativa completa (descobrir → contato)
/escritorio               história, princípios, o que não fazemos
/atuacao                  hub das 4 áreas
/atuacao/{familia, sucessoes, empresas-familiares, imobiliario}
/como-trabalhamos         método, Mapa do Caso, honorários, comunicação
/equipe                   hub da equipe
/equipe/{helena-quintela, otavio-brandt, beatriz-nobrega}
/artigos                  6 artigos com filtro por área (sem busca: pouco conteúdo)
/artigos/{slug}
/duvidas                  FAQ agrupado
/contato                  canais, formulário, localização
/politica-de-privacidade  /termos-de-uso  /404
```

Narrativa da home: Hero (descobrir) → O escritório (entender) → Onde atuamos,
por situações na voz do cliente (identificar-se) → Método + compromissos
(confiar/entender) → Quem conduz → Artigos (pesquisar) → Dúvidas → Contato
como conclusão.

CTAs por intenção: hero "Conversar com o escritório" / "Conhecer o escritório";
áreas "Entender como funciona"; após o método "Falar com o escritório"; equipe
"Conhecer a trajetória"; final "Agendar uma conversa". Páginas de área
pré-selecionam o assunto no formulário e na mensagem de WhatsApp.

## 5. Tese visual

Papel quente, tinta quase preta e um único acento em vermelho-lacre (o lacre
dos documentos). Serifa de tamanho óptico de display (Newsreader) em corpo
grande e peso leve, contra uma grotesca compacta (Hanken Grotesk) para rótulos
e interface. Filetes finos no lugar de cartões e sombras; raio zero; seções
invertidas (tinta) para os momentos de decisão. Retratos tipográficos no lugar
de fotos de banco de imagem (usar rosto real de outra pessoa para um advogado
fictício seria misturar pessoa real com dado fictício).

Contraste calculado (WCAG): tinta #15171A sobre papel #F3F0E9 = 15,8:1;
grafite #4A4C50 = 7,6:1; pedra #5E5D59 = 5,8:1; lacre #8C2A1E = 7,5:1;
papel #ECE8DF sobre #101214 = 15,4:1; lacre claro #D0725E sobre #101214 = 5,6:1.

## 6. Tese de interação

Seca e precisa. Um único fio atravessa a página: nasce emaranhado no hero,
se desembaraça conforme a rolagem e vira a linha que conduz as etapas do
método. Filetes se desenham (scaleX), títulos sobem por máscara de linha,
o parágrafo-manifesto ganha tinta palavra a palavra, a seção final troca
papel por tinta. Hover 120–160 ms só em cor/sublinhado/seta. Revelações
600–800 ms, curva única `cubic-bezier(.22,1,.36,1)`, stagger ≤ 80 ms, uma vez.
Transição entre páginas com View Transitions nativas (CSS), sem SPA.

Proibido: bounce/back/elastic, parallax decorativo, cursor customizado,
botão magnético, scroll hijacking, contadores, divisão por caractere,
animação contínua em loop.

Reduced motion: nenhum código de animação é baixado; conteúdo no estado
final; o fio aparece parado (a figura continua como identidade visual).

## 7. Decisões de engenharia tomadas durante os testes

- Revelações simples usam IntersectionObserver; ScrollTrigger só onde há scrub
  (fio, manifesto, método, final). Com ~60 ScrollTriggers o carregamento fazia
  1,4 s de "style & layout" em CPU 4× mais lenta.
- Estados iniciais das revelações vêm do CSS (`html.motion …`), não de
  `gsap.set` — que lia o transform de cada elemento logo após escrever o anterior.
- O módulo de animação só é importado depois da primeira pintura: o
  ScrollTrigger mede a página ao registrar-se e forçava o primeiro layout.
  Resultado no Lighthouse mobile (mediana de 3): desempenho 85 → 98, TBT 285 → 0 ms.
- Pré-estado de revelação usa `opacity`, nunca `visibility: hidden`: com
  `visibility`, o Tab pulava blocos ainda não revelados.
- `scopedStyleStrategy: 'class'`: o `<h1>` gerado por um componente filho
  herda o posicionamento de grade da página.
