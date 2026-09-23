// app/sitemap.ts
import { MetadataRoute } from 'next';

const BASE_URL = 'https://merlacoffee.de';
const LOCALES = ['de', 'en', 'tr'];

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/impressum', '/datenschutz'];
  return LOCALES.flatMap((locale) =>
    routes.map((route) => ({
      url: `${BASE_URL}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: route === '' ? 1 : 0.5,
    }))
  );
}
