/**
 * Fonte única dos dados institucionais (NAP, contato, horários).
 * Tudo que aparece no rodapé, na página de contato, no JSON-LD e no llms.txt
 * sai daqui — assim nome, endereço e telefone nunca divergem entre si.
 *
 * ATENÇÃO: todos os dados abaixo são fictícios (ver README, "Dados fictícios").
 */

export const SITE = {
  name: 'Quintela Brandt Advogados',
  shortName: 'Quintela Brandt',
  legalName: 'Quintela Brandt Sociedade de Advogados',
  /** URL pública, vinda de `site` no astro.config (pode incluir subcaminho, ex. GitHub Pages). */
  url: String(import.meta.env.SITE ?? 'https://www.quintelabrandt.adv.br').replace(/\/$/, ''),
  foundingYear: 2014,
  locale: 'pt_BR',
  lang: 'pt-BR',
  tagline: 'Família, sucessões e patrimônio',
  description:
    'Escritório de advocacia em Belo Horizonte dedicado a direito de família, inventários e planejamento sucessório, empresas familiares e direito imobiliário.',

  address: {
    street: 'Rua Professora Leonor Viana, 227',
    complement: '6º andar',
    district: 'Funcionários',
    city: 'Belo Horizonte',
    state: 'MG',
    postalCode: '30140-083',
    country: 'BR',
  },

  phone: { display: '(31) 90417-2260', e164: '+5531904172260' },
  whatsapp: { number: '5531904172260', display: '(31) 90417-2260' },
  email: 'contato@quintelabrandt.adv.br',
  privacyEmail: 'privacidade@quintelabrandt.adv.br',

  hours: {
    label: 'Segunda a sexta, das 9h às 18h',
    short: 'Seg–sex · 9h–18h',
    spec: { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '18:00' },
  },
  responseTime: 'em até um dia útil',

  /**
   * Inscrição da sociedade na OAB e CNPJ. Vazios de propósito: um número
   * inventado poderia coincidir com o de uma pessoa ou empresa real.
   * Quando preenchidos, passam a ser exibidos no rodapé e na política de privacidade.
   */
  oabRegistration: '',
  cnpj: '',

  /** Perfis oficiais. Só são exibidos quando preenchidos com URLs reais. */
  social: [] as { label: string; url: string }[],

  /** Pessoa que recebe o primeiro contato. */
  intake: { name: 'Clara Antunes', role: 'Coordenação de atendimento' },

  /** Encarregado pelo tratamento de dados (LGPD, art. 41). */
  dpo: { name: 'Otávio Brandt' },
} as const;

/**
 * Indexação. Enquanto os dados forem fictícios, o site sai com noindex:
 * publicar um "negócio local" inexistente no Google violaria as diretrizes.
 * Para liberar, gere o build com PUBLIC_INDEXING=true.
 */
export const INDEXING = import.meta.env.PUBLIC_INDEXING === 'true';

/**
 * Endpoint do formulário (Formspree, Netlify Forms, backend próprio…).
 * Sem endpoint, o envio é apenas simulado no navegador e nenhum dado sai da página.
 */
export const FORM_ENDPOINT: string = import.meta.env.PUBLIC_FORM_ENDPOINT ?? '';

export const fullAddress = `${SITE.address.street}, ${SITE.address.complement} — ${SITE.address.district}, ${SITE.address.city}/${SITE.address.state}, CEP ${SITE.address.postalCode}`;

export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${SITE.address.street}, ${SITE.address.district}, ${SITE.address.city} - ${SITE.address.state}`,
)}`;

/**
 * Link de WhatsApp com mensagem inicial preparada. A mensagem é escrita na
 * voz de quem ainda não conversou com ninguém — nunca finge contato prévio.
 */
export function whatsappUrl(topic?: string) {
  const base = 'Olá! Gostaria de agendar uma conversa com o escritório';
  const text = topic ? `${base} sobre ${topic}.` : `${base}.`;
  return `https://wa.me/${SITE.whatsapp.number}?text=${encodeURIComponent(text)}`;
}

export const NAV = [
  { href: '/escritorio/', label: 'Escritório', section: 'escritorio' },
  { href: '/atuacao/', label: 'Atuação', section: 'atuacao' },
  { href: '/como-trabalhamos/', label: 'Como trabalhamos', section: 'metodo' },
  { href: '/equipe/', label: 'Equipe', section: 'equipe' },
  { href: '/artigos/', label: 'Artigos', section: 'artigos' },
  { href: '/duvidas/', label: 'Dúvidas', section: 'duvidas' },
] as const;
