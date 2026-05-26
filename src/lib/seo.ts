export function buildCanonical(siteUrl: string, path: string): string {
  const base = siteUrl.replace(/\/+$/, '');
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${base}${clean}`;
}

export function absoluteOgImage(siteUrl: string, ogImage: string): string {
  if (/^https?:\/\//i.test(ogImage)) return ogImage;
  const base = siteUrl.replace(/\/+$/, '');
  const clean = ogImage.startsWith('/') ? ogImage : `/${ogImage}`;
  return `${base}${clean}`;
}
