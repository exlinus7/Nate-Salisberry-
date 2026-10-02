import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    topic: z.enum(['is-it-time', 'paying-for-care', 'touring', 'memory-care', 'moving-day']),
    order: z.number().default(99),
    image: z.string().default('[IMAGE]'),
  }),
});

export const collections = { articles };
