import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Outfit } from 'next/font/google';
import '../globals.css';

const outfit = Outfit({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-outfit',
  display: 'swap',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    de: 'Merla Coffee - Specialty Coffee',
    en: 'Merla Coffee - Specialty Coffee',
    tr: 'Merla Coffee - Specialty Kahve',
  };
  const descriptions: Record<string, string> = {
    de: 'Specialty Coffee in Deutschland. Merla Coffee - handgefertigte Getränke, täglich frisch.',
    en: 'Specialty coffee in Germany. Merla Coffee - handcrafted drinks, fresh every day.',
    tr: "Almanya'da specialty kahve. Merla Coffee - el yapimı içecekler, her gün taze.",
  };
  return {
    title: titles[locale] ?? titles.de,
    description: descriptions[locale] ?? descriptions.de,
    metadataBase: new URL('https://merlacoffee.de'),
    alternates: {
      canonical: `/${locale}`,
      languages: { de: '/de', en: '/en', tr: '/tr' },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as 'de' | 'en' | 'tr')) notFound();
  const messages = await getMessages();

  return (
    <html lang={locale} className={outfit.variable}>
      <body className="bg-bg text-text font-body antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
