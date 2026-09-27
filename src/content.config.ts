import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const artigos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/artigos' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(170),
    author: z.enum(['helena-quintela', 'otavio-brandt', 'beatriz-nobrega']),
    area: z.enum(['familia', 'sucessoes', 'empresas-familiares', 'imobiliario']),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
    readingTime: z.number(),
    related: z.array(z.string()).default([]),
  }),
});

export const collections = { artigos };
