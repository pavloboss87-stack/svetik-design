import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1),
      year: z.number().int().min(2020).max(2030),
      type: z.enum(['apartment', 'house', 'studio', 'commercial']),
      area: z.number().positive(),
      location: z.string().optional(),
      summary: z.string().min(1).max(200),
      cover: image(),
      gallery: z.array(image()).min(3),
      published: z.boolean().default(true),
      isConcept: z.boolean().default(true),
      order: z.number().int().optional(),
      seo: z
        .object({
          title: z.string().optional(),
          description: z.string().optional(),
          ogImage: image().optional(),
        })
        .optional(),
    }),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string().min(1),
    tagline: z.string().min(1).max(120),
    order: z.number().int(),
    published: z.boolean().default(true),
    priceNote: z.string().optional(),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1),
      authorPhoto: image().optional(),
      seo: z
        .object({
          title: z.string().optional(),
          description: z.string().optional(),
          ogImage: image().optional(),
        })
        .optional(),
    }),
});

const contactChannel = z.object({
  label: z.string().min(1),
  handle: z.string().min(1),
  url: z.url(),
  primary: z.boolean().optional(),
});

const contactsSchema = z.object({
  telegramPersonal: contactChannel,
  telegramBlog: contactChannel,
  vk: contactChannel,
  maxMe: contactChannel,
  email: z.email(),
  telegramBlogRssUrl: z.url(),
});

const seoSettingsSchema = z.object({
  siteName: z.string().min(1),
  siteUrl: z.url(),
  defaultOgImage: z.string().min(1),
  description: z.string().min(1),
});

const settings = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/settings' }),
  schema: z.union([contactsSchema, seoSettingsSchema]),
});

export const collections = { projects, services, pages, settings };
