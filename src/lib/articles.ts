import { getCollection, type CollectionEntry } from 'astro:content';

export type Article = CollectionEntry<'artigos'>;

export async function getArticles(): Promise<Article[]> {
  const all = await getCollection('artigos');
  return all.sort((a, b) => b.data.published.getTime() - a.data.published.getTime());
}

// Datas do front matter são meia-noite UTC: formatar em UTC evita "voltar um dia".
const long = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const short = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });

export const formatDate = (d: Date) => long.format(d);
export const formatShort = (d: Date) => short.format(d).replace(/\./g, '').replace(/ de /g, ' ');
export const isoDate = (d: Date) => d.toISOString().slice(0, 10);
