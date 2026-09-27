/**
 * Dados estruturados (JSON-LD). Um @graph por página, com @id estáveis.
 * Regra: só marcar o que está visível na página. Nada de avaliações,
 * sameAs para perfis inexistentes, CNPJ ou números de OAB inventados.
 */
import { SITE } from '@/data/site';
import { AREAS, type Area, type Faq } from '@/data/areas';
import type { Lawyer } from '@/data/team';

// Concatenação (e não new URL): preserva um subcaminho em SITE.url, como no GitHub Pages.
export const abs = (path: string) => SITE.url + (path.startsWith('/') ? path : `/${path}`);

export const ORG_ID = abs('/#organization');
export const WEBSITE_ID = abs('/#website');

export function organization() {
  const a = SITE.address;
  return {
    '@type': 'LegalService',
    '@id': ORG_ID,
    name: SITE.name,
    legalName: SITE.legalName,
    url: abs('/'),
    logo: { '@type': 'ImageObject', url: abs('/logo-512.png'), width: 512, height: 512 },
    image: abs('/og/default.png'),
    description: SITE.description,
    foundingDate: String(SITE.foundingYear),
    telephone: SITE.phone.e164,
    email: SITE.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${a.street}, ${a.complement}`,
      addressLocality: a.city,
      addressRegion: a.state,
      postalCode: a.postalCode,
      addressCountry: a.country,
    },
    areaServed: [
      { '@type': 'City', name: 'Belo Horizonte' },
      { '@type': 'Country', name: 'Brasil' },
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: SITE.hours.spec.days,
        opens: SITE.hours.spec.opens,
        closes: SITE.hours.spec.closes,
      },
    ],
    knowsAbout: ['Direito de Família', 'Direito das Sucessões', 'Planejamento sucessório', 'Direito Societário', 'Direito Imobiliário'],
    knowsLanguage: 'pt-BR',
    availableLanguage: 'Portuguese',
    employee: [
      { '@id': abs('/equipe/helena-quintela/#person') },
      { '@id': abs('/equipe/otavio-brandt/#person') },
      { '@id': abs('/equipe/beatriz-nobrega/#person') },
    ],
    makesOffer: AREAS.map((area) => ({
      '@type': 'Offer',
      itemOffered: { '@id': abs(`/atuacao/${area.slug}/#service`) },
    })),
    ...(SITE.social.length ? { sameAs: SITE.social.map((s) => s.url) } : {}),
  };
}

export const orgRef = () => ({
  '@type': 'LegalService',
  '@id': ORG_ID,
  name: SITE.name,
  url: abs('/'),
  logo: { '@type': 'ImageObject', url: abs('/logo-512.png') },
});

export function website() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: abs('/'),
    name: SITE.name,
    inLanguage: 'pt-BR',
    publisher: { '@id': ORG_ID },
  };
}

export function webPage(path: string, name: string, description: string, type = 'WebPage', extra: Record<string, unknown> = {}) {
  return {
    '@type': type,
    '@id': abs(path) + '#webpage',
    url: abs(path),
    name,
    description,
    inLanguage: 'pt-BR',
    isPartOf: { '@id': WEBSITE_ID },
    ...extra,
  };
}

export function breadcrumbs(items: { name: string; href: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Início', href: '/' }, ...items].map((item, i, all) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      ...(i < all.length - 1 ? { item: abs(item.href) } : {}),
    })),
  };
}

export function person(l: Lawyer) {
  return {
    '@type': 'Person',
    '@id': abs(`/equipe/${l.slug}/#person`),
    name: l.name,
    jobTitle: l.role,
    description: l.summary,
    url: abs(`/equipe/${l.slug}/`),
    worksFor: { '@id': ORG_ID },
    knowsAbout: l.focus,
    knowsLanguage: l.languages,
  };
}

const SERVICE_NAMES: Record<string, string> = {
  familia: 'Direito de Família',
  sucessoes: 'Inventário e planejamento sucessório',
  'empresas-familiares': 'Direito Societário para empresas familiares',
  imobiliario: 'Direito Imobiliário',
};

export function service(area: Area) {
  return {
    '@type': 'Service',
    '@id': abs(`/atuacao/${area.slug}/#service`),
    name: SERVICE_NAMES[area.slug] ?? area.name,
    description: area.intro,
    serviceType: area.topic,
    provider: orgRef(),
    areaServed: { '@type': 'City', name: 'Belo Horizonte' },
    url: abs(`/atuacao/${area.slug}/`),
  };
}

export function faqPage(path: string, faqs: Faq[]) {
  return {
    '@type': 'FAQPage',
    '@id': abs(path) + '#faq',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export const graph = (...nodes: object[]) => ({ '@context': 'https://schema.org', '@graph': nodes });
