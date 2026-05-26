import { getEntry } from 'astro:content';

type ContactChannel = {
  label: string;
  handle: string;
  url: string;
  primary?: boolean;
};

export type Contacts = {
  telegramPersonal: ContactChannel;
  telegramBlog: ContactChannel;
  vk: ContactChannel;
  maxMe: ContactChannel;
  email: string;
  telegramBlogRssUrl: string;
};

export type SiteSeo = {
  siteName: string;
  siteUrl: string;
  defaultOgImage: string;
  description: string;
};

export async function getContacts(): Promise<Contacts> {
  const entry = await getEntry('settings', 'contacts');
  if (!entry) throw new Error('settings/contacts entry not found');
  if (!('telegramPersonal' in entry.data)) {
    throw new Error('settings/contacts entry has unexpected shape');
  }
  return entry.data as Contacts;
}

export async function getSiteSeo(): Promise<SiteSeo> {
  const entry = await getEntry('settings', 'seo');
  if (!entry) throw new Error('settings/seo entry not found');
  if (!('siteName' in entry.data)) {
    throw new Error('settings/seo entry has unexpected shape');
  }
  return entry.data as SiteSeo;
}
