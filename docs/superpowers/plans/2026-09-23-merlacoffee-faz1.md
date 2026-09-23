# Merla Coffee Faz-1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **DESIGN SKILL:** Before writing any UI code, invoke `ui-ux-pro-max` skill. Pre-flight checklist from `design-taste-frontend` runs before declaring any component done.

**Goal:** merlacoffee.de için dark-first luxury kahve tanıtım sitesi — Hero, Hakkımızda, Menü, Konum, Yorumlar, İletişim bölümleriyle, DE/EN/TR dil desteği ve Vercel deploy.

**Architecture:** Single-page App Router site with `[locale]` routing via next-intl. All sections rendered in `app/[locale]/page.tsx` as Server Components, with isolated `"use client"` leaves for animations. GSAP handles scroll-pin and parallax; Motion handles all in-viewport reveals, hover physics, and form states.

**Tech Stack:** Next.js 16 · React 19 · TypeScript · Tailwind v3 · `motion/react` · GSAP + ScrollTrigger · next-intl · Resend · @phosphor-icons/react · Vercel

---

## File Map

| Dosya | Sorumluluk |
|---|---|
| `middleware.ts` | next-intl locale detection |
| `i18n/request.ts` | next-intl server config |
| `next.config.js` | next-intl plugin, image domains |
| `tailwind.config.ts` | CSS vars, font variables, custom scale |
| `app/globals.css` | CSS tokens (colors, type ramp), font vars |
| `app/[locale]/layout.tsx` | HTML shell, font injection, metadata |
| `app/[locale]/page.tsx` | Ana sayfa — tüm section'ları sıralar |
| `app/[locale]/impressum/page.tsx` | Impressum sayfası |
| `app/[locale]/datenschutz/page.tsx` | Datenschutz sayfası |
| `app/api/contact/route.ts` | Resend contact form API |
| `app/sitemap.ts` | Tüm locale'ler için sitemap |
| `app/robots.ts` | Robots.txt |
| `components/Nav.tsx` | `"use client"` — scroll blur, dil seçici, hamburger |
| `components/Hero.tsx` | `"use client"` — GSAP scroll-pin + parallax |
| `components/About.tsx` | `"use client"` — whileInView reveal + tilt |
| `components/Menu.tsx` | `"use client"` — kategori filtre + tilt kartlar |
| `components/Location.tsx` | Server — Maps iframe + saatler tablosu |
| `components/Reviews.tsx` | `"use client"` — kinetic marquee |
| `components/Contact.tsx` | `"use client"` — form + Resend submit |
| `components/Footer.tsx` | Server — minimal footer |
| `messages/de.json` | Almanca string'ler |
| `messages/en.json` | İngilizce string'ler |
| `messages/tr.json` | Türkçe string'ler |
| `public/fonts/CabinetGrotesk-Variable.woff2` | Self-hosted display font |

---

## Task 1: Proje Scaffold

**Files:**
- Create: `package.json`, `next.config.js`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js`

- [ ] **Step 1: Mevcut dizinde Next.js projesini başlat**

```bash
cd /Users/furkandenizalbaylar/Developer/merlacoffee
npx create-next-app@16 . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --no-git
```

`--no-git` mevcut git repo'yu korur.

- [ ] **Step 2: Gerekli paketleri yükle**

```bash
npm install motion gsap @gsap/react next-intl resend @phosphor-icons/react
npm install -D @types/node
```

- [ ] **Step 3: Cabinet Grotesk fontunu indir**

Fontshare'den indir: https://www.fontshare.com/fonts/cabinet-grotesk  
"Cabinet Grotesk Variable" seçip `.woff2` dosyasını:

```
public/fonts/CabinetGrotesk-Variable.woff2
```

Alternatif (internet yoksa): `Outfit` Google Font kullan (Task 3'te `next/font/google` ile).

- [ ] **Step 4: Build doğrulama**

```bash
npm run build
```

Expected: build hatasız tamamlanır.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js 16 project with dependencies"
```

---

## Task 2: i18n Kurulumu (next-intl)

**Files:**
- Create: `middleware.ts`
- Create: `i18n/request.ts`
- Modify: `next.config.js`
- Create: `messages/de.json`, `messages/en.json`, `messages/tr.json`

- [ ] **Step 1: next.config.js'i güncelle**

```js
// next.config.js
const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'maps.googleapis.com' },
    ],
  },
};

module.exports = withNextIntl(nextConfig);
```

- [ ] **Step 2: i18n/request.ts oluştur**

```ts
// i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as 'de' | 'en' | 'tr')) {
    locale = routing.defaultLocale;
  }
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

- [ ] **Step 3: i18n/routing.ts oluştur**

```ts
// i18n/routing.ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['de', 'en', 'tr'],
  defaultLocale: 'de',
});
```

- [ ] **Step 4: middleware.ts oluştur**

```ts
// middleware.ts
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
```

- [ ] **Step 5: messages/de.json oluştur**

```json
{
  "nav": {
    "menu": "Speisekarte",
    "about": "Über uns",
    "location": "Standort",
    "contact": "Kontakt",
    "reservation": "Reservierung"
  },
  "hero": {
    "tagline": "Specialty Coffee. Jeden Tag.",
    "cta": "Speisekarte entdecken"
  },
  "about": {
    "eyebrow": "Unsere Geschichte",
    "heading": "Merla Coffee",
    "p1": "Wir glauben, dass ein guter Kaffee mehr ist als ein Getränk. Er ist ein Moment der Stille, des Genusses und der Verbindung.",
    "p2": "Jede Tasse wird mit Sorgfalt zubereitet — von der Auswahl der Bohnen bis zum letzten Schluck.",
    "p3": "Willkommen bei Merla."
  },
  "menu": {
    "heading": "Speisekarte",
    "categories": {
      "all": "Alle",
      "coffee": "Kaffee",
      "tea": "Tee",
      "food": "Speisen",
      "dessert": "Desserts"
    }
  },
  "location": {
    "heading": "Wo wir sind",
    "address": "Adresse folgt in Kürze",
    "copyAddress": "Adresse kopieren",
    "copied": "Kopiert",
    "hours": {
      "heading": "Öffnungszeiten",
      "mon": "Montag",
      "tue": "Dienstag",
      "wed": "Mittwoch",
      "thu": "Donnerstag",
      "fri": "Freitag",
      "sat": "Samstag",
      "sun": "Sonntag",
      "closed": "Geschlossen",
      "monFri": "08:00 - 18:00",
      "sat": "09:00 - 17:00",
      "sun": "Geschlossen"
    }
  },
  "reviews": {
    "heading": "Was unsere Gäste sagen"
  },
  "contact": {
    "heading": "Schreib uns",
    "name": "Name",
    "email": "E-Mail",
    "message": "Nachricht",
    "send": "Senden",
    "sending": "Wird gesendet...",
    "success": "Nachricht gesendet",
    "error": "Fehler beim Senden"
  },
  "footer": {
    "impressum": "Impressum",
    "datenschutz": "Datenschutz",
    "copyright": "© 2026 Merla Coffee. Alle Rechte vorbehalten."
  },
  "impressum": {
    "heading": "Impressum",
    "placeholder": "Angaben gemäß § 5 TMG folgen in Kürze."
  },
  "datenschutz": {
    "heading": "Datenschutzerklärung",
    "placeholder": "Datenschutzerklärung folgt in Kürze."
  }
}
```

- [ ] **Step 6: messages/en.json oluştur**

```json
{
  "nav": {
    "menu": "Menu",
    "about": "About",
    "location": "Location",
    "contact": "Contact",
    "reservation": "Reservation"
  },
  "hero": {
    "tagline": "Specialty Coffee. Every Day.",
    "cta": "Explore the Menu"
  },
  "about": {
    "eyebrow": "Our Story",
    "heading": "Merla Coffee",
    "p1": "We believe a good coffee is more than a drink. It is a moment of stillness, pleasure, and connection.",
    "p2": "Every cup is crafted with care — from the selection of beans to the last sip.",
    "p3": "Welcome to Merla."
  },
  "menu": {
    "heading": "Menu",
    "categories": {
      "all": "All",
      "coffee": "Coffee",
      "tea": "Tea",
      "food": "Food",
      "dessert": "Desserts"
    }
  },
  "location": {
    "heading": "Find Us",
    "address": "Address coming soon",
    "copyAddress": "Copy address",
    "copied": "Copied",
    "hours": {
      "heading": "Opening Hours",
      "mon": "Monday",
      "tue": "Tuesday",
      "wed": "Wednesday",
      "thu": "Thursday",
      "fri": "Friday",
      "sat": "Saturday",
      "sun": "Sunday",
      "closed": "Closed",
      "monFri": "08:00 - 18:00",
      "sat": "09:00 - 17:00",
      "sun": "Closed"
    }
  },
  "reviews": {
    "heading": "What Our Guests Say"
  },
  "contact": {
    "heading": "Get in Touch",
    "name": "Name",
    "email": "Email",
    "message": "Message",
    "send": "Send",
    "sending": "Sending...",
    "success": "Message sent",
    "error": "Failed to send"
  },
  "footer": {
    "impressum": "Imprint",
    "datenschutz": "Privacy Policy",
    "copyright": "© 2026 Merla Coffee. All rights reserved."
  },
  "impressum": {
    "heading": "Imprint",
    "placeholder": "Legal information coming soon."
  },
  "datenschutz": {
    "heading": "Privacy Policy",
    "placeholder": "Privacy policy coming soon."
  }
}
```

- [ ] **Step 7: messages/tr.json oluştur**

```json
{
  "nav": {
    "menu": "Menü",
    "about": "Hakkımızda",
    "location": "Konum",
    "contact": "İletişim",
    "reservation": "Rezervasyon"
  },
  "hero": {
    "tagline": "Specialty Kahve. Her Gün.",
    "cta": "Menüyü Keşfet"
  },
  "about": {
    "eyebrow": "Hikayemiz",
    "heading": "Merla Coffee",
    "p1": "İyi bir kahvenin sadece bir içecekten fazlası olduğuna inanıyoruz. O, bir dinginlik, zevk ve bağlantı anıdır.",
    "p2": "Her fincan özenle hazırlanır — çekirdek seçiminden son yuduma kadar.",
    "p3": "Merla'ya hoş geldiniz."
  },
  "menu": {
    "heading": "Menü",
    "categories": {
      "all": "Tümü",
      "coffee": "Kahveler",
      "tea": "Çaylar",
      "food": "Yiyecekler",
      "dessert": "Tatlılar"
    }
  },
  "location": {
    "heading": "Neredeyiz",
    "address": "Adres yakında eklenecek",
    "copyAddress": "Adresi kopyala",
    "copied": "Kopyalandı",
    "hours": {
      "heading": "Çalışma Saatleri",
      "mon": "Pazartesi",
      "tue": "Salı",
      "wed": "Çarşamba",
      "thu": "Perşembe",
      "fri": "Cuma",
      "sat": "Cumartesi",
      "sun": "Pazar",
      "closed": "Kapalı",
      "monFri": "08:00 - 18:00",
      "sat": "09:00 - 17:00",
      "sun": "Kapalı"
    }
  },
  "reviews": {
    "heading": "Misafirlerimiz Ne Diyor"
  },
  "contact": {
    "heading": "Bize Yazın",
    "name": "Ad Soyad",
    "email": "E-posta",
    "message": "Mesaj",
    "send": "Gönder",
    "sending": "Gönderiliyor...",
    "success": "Mesaj gönderildi",
    "error": "Gönderilemedi"
  },
  "footer": {
    "impressum": "Künye",
    "datenschutz": "Gizlilik Politikası",
    "copyright": "© 2026 Merla Coffee. Tüm hakları saklıdır."
  },
  "impressum": {
    "heading": "Künye",
    "placeholder": "Yasal bilgiler yakında eklenecek."
  },
  "datenschutz": {
    "heading": "Gizlilik Politikası",
    "placeholder": "Gizlilik politikası yakında eklenecek."
  }
}
```

- [ ] **Step 8: TypeScript doğrulama**

```bash
npx tsc --noEmit
```

Expected: Hata yok.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add next-intl i18n with DE/EN/TR messages"
```

---

## Task 3: Global Styles & Design Tokens

**Files:**
- Modify: `app/globals.css`
- Modify: `tailwind.config.ts`
- Create: `app/[locale]/layout.tsx`

- [ ] **Step 1: globals.css — CSS tokens ve font tanımla**

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --color-bg: #09090b;
    --color-surface: #18181b;
    --color-text: #fafafa;
    --color-text-muted: #a1a1aa;
    --color-accent: #c2603a;
    --color-border: #27272a;

    --text-display: clamp(3rem, 7vw, 7rem);
    --text-h1: clamp(2.25rem, 5vw, 4.5rem);
    --text-h2: clamp(1.5rem, 3vw, 2.5rem);
    --text-h3: clamp(1.125rem, 2vw, 1.5rem);
    --text-body-lg: clamp(1rem, 1.5vw, 1.25rem);
  }

  html {
    background-color: var(--color-bg);
    color: var(--color-text);
    scroll-behavior: smooth;
  }

  * {
    box-sizing: border-box;
  }
}
```

- [ ] **Step 2: tailwind.config.ts — custom tokens ekle**

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        accent: 'var(--color-accent)',
        border: 'var(--color-border)',
      },
      fontSize: {
        display: 'var(--text-display)',
        h1: 'var(--text-h1)',
        h2: 'var(--text-h2)',
        h3: 'var(--text-h3)',
        'body-lg': 'var(--text-body-lg)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 3: app/[locale]/layout.tsx oluştur**

```tsx
// app/[locale]/layout.tsx
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import localFont from 'next/font/local';
import { Geist } from 'next/font/google';
import '../globals.css';

const cabinetGrotesk = localFont({
  src: '../../public/fonts/CabinetGrotesk-Variable.woff2',
  variable: '--font-display',
  display: 'swap',
});

const geist = Geist({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-body',
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
    de: 'Merla Coffee — Specialty Coffee',
    en: 'Merla Coffee — Specialty Coffee',
    tr: 'Merla Coffee — Specialty Kahve',
  };
  const descriptions: Record<string, string> = {
    de: 'Specialty Coffee in Deutschland. Merla Coffee — handgefertigte Getränke, täglich frisch.',
    en: 'Specialty coffee in Germany. Merla Coffee — handcrafted drinks, fresh every day.',
    tr: "Almanya'da specialty kahve. Merla Coffee — el yapımı içecekler, her gün taze.",
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
    <html lang={locale} className={`${cabinetGrotesk.variable} ${geist.variable}`}>
      <body className="bg-bg text-zinc-50 font-body antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 4: app/[locale]/page.tsx oluştur (boş shell)**

```tsx
// app/[locale]/page.tsx
export default function HomePage() {
  return (
    <main>
      {/* Sections will be added task by task */}
    </main>
  );
}
```

- [ ] **Step 5: Dev server doğrulama**

```bash
npm run dev
```

`http://localhost:3000/de` açılır, siyah arka plan görünür.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: global styles, design tokens, locale layout"
```

---

## Task 4: Nav Bileşeni

**Files:**
- Create: `components/Nav.tsx`
- Modify: `app/[locale]/layout.tsx`

- [ ] **Step 1: Nav.tsx oluştur**

```tsx
// components/Nav.tsx
'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { List, X } from '@phosphor-icons/react';
import Link from 'next/link';

const LOCALES = ['de', 'en', 'tr'] as const;

const NAV_LINKS = [
  { key: 'menu', href: '#menu' },
  { key: 'about', href: '#about' },
  { key: 'location', href: '#location' },
  { key: 'contact', href: '#contact' },
] as const;

export default function Nav() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function switchLocale(newLocale: string) {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="font-display font-bold text-xl tracking-tight text-zinc-50">
            Merla Coffee
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ key, href }) => (
              <a
                key={key}
                href={href}
                className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors duration-200"
              >
                {t(key)}
              </a>
            ))}
          </div>

          {/* Right: Locale + CTA */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-1">
              {LOCALES.map((l) => (
                <button
                  key={l}
                  onClick={() => switchLocale(l)}
                  className={`text-xs uppercase tracking-wider px-2 py-1 rounded transition-colors duration-200 ${
                    locale === l
                      ? 'text-zinc-50 bg-zinc-800'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            <button
              disabled
              className="text-sm px-4 py-2 rounded-full bg-zinc-800 text-zinc-500 cursor-not-allowed"
              title="Coming soon"
            >
              {t('reservation')}
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-zinc-400 hover:text-zinc-50 transition-colors"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <List size={24} weight="light" />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-zinc-950 flex flex-col px-6 py-8"
          >
            <div className="flex items-center justify-between mb-12">
              <span className="font-display font-bold text-xl">Merla Coffee</span>
              <button
                onClick={() => setMenuOpen(false)}
                className="text-zinc-400 hover:text-zinc-50 transition-colors"
                aria-label="Close menu"
              >
                <X size={24} weight="light" />
              </button>
            </div>

            <div className="flex flex-col gap-6">
              {NAV_LINKS.map(({ key, href }, i) => (
                <motion.a
                  key={key}
                  href={href}
                  initial={reduce ? false : { opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                  onClick={() => setMenuOpen(false)}
                  className="text-3xl font-display font-medium tracking-tight text-zinc-200 hover:text-zinc-50 transition-colors"
                >
                  {t(key)}
                </motion.a>
              ))}
            </div>

            <div className="mt-auto flex items-center gap-2">
              {LOCALES.map((l) => (
                <button
                  key={l}
                  onClick={() => { switchLocale(l); setMenuOpen(false); }}
                  className={`text-sm uppercase tracking-wider px-3 py-2 rounded transition-colors ${
                    locale === l ? 'text-zinc-50 bg-zinc-800' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
```

- [ ] **Step 2: Nav'ı layout'a ekle**

`app/[locale]/layout.tsx` içinde `<body>` etiketine Nav ekle:

```tsx
import Nav from '@/components/Nav';
// ...
<body className="bg-bg text-zinc-50 font-body antialiased">
  <NextIntlClientProvider messages={messages}>
    <Nav />
    {children}
  </NextIntlClientProvider>
</body>
```

- [ ] **Step 3: Görsel doğrulama**

`http://localhost:3000/de` → Nav görünür, scroll'da blur efekti gelir, mobile'da hamburger çalışır.

- [ ] **Step 4: Commit**

```bash
git add components/Nav.tsx app/[locale]/layout.tsx
git commit -m "feat: add Nav with scroll-blur, locale switcher, mobile overlay"
```

---

## Task 5: Hero Bölümü (GSAP Scroll-Pin)

**Files:**
- Create: `components/Hero.tsx`
- Modify: `app/[locale]/page.tsx`

- [ ] **Step 1: Hero.tsx oluştur**

```tsx
// components/Hero.tsx
'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useReducedMotion } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const t = useTranslations('hero');
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !sectionRef.current || !imageRef.current) return;

    const ctx = gsap.context(() => {
      // Scroll-pin: hero stays while about section slides over it
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=100%',
        pin: true,
        pinSpacing: false,
      });

      // Parallax: image scrolls slower
      gsap.to(imageRef.current, {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reduce]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[100dvh] flex items-end pb-20 overflow-hidden"
    >
      {/* Background image */}
      <div ref={imageRef} className="absolute inset-0 scale-110">
        <Image
          src="https://picsum.photos/seed/merla-coffee-hero/1600/900"
          alt="Merla Coffee"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-zinc-950/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <h1
          className="font-display font-bold tracking-tighter leading-none text-zinc-50 mb-6"
          style={{ fontSize: 'var(--text-display)' }}
        >
          Merla Coffee
        </h1>
        <p className="text-body-lg text-zinc-400 mb-10 max-w-md">
          {t('tagline')}
        </p>
        <a
          href="#menu"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-accent text-zinc-50 font-medium text-sm tracking-wide hover:bg-[#d4704a] active:scale-[0.98] transition-all duration-200"
        >
          {t('cta')}
        </a>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Hero'yu page.tsx'e ekle**

```tsx
// app/[locale]/page.tsx
import Hero from '@/components/Hero';

export default function HomePage() {
  return (
    <main>
      <Hero />
    </main>
  );
}
```

- [ ] **Step 3: Görsel doğrulama**

Dev server'da scroll'da GSAP pin çalışır, fotoğraf parallax yapar.

- [ ] **Step 4: Commit**

```bash
git add components/Hero.tsx app/[locale]/page.tsx
git commit -m "feat: add GSAP scroll-pinned hero with parallax"
```

---

## Task 6: Hakkımızda Bölümü

**Files:**
- Create: `components/About.tsx`
- Modify: `app/[locale]/page.tsx`

- [ ] **Step 1: About.tsx oluştur**

```tsx
// components/About.tsx
'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useMotionValue, useTransform, useReducedMotion } from 'motion/react';
import Image from 'next/image';

export default function About() {
  const t = useTranslations('about');
  const reduce = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [4, -4]);
  const rotateY = useTransform(x, [-100, 100], [-4, 4]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const fadeLeft = {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
  };

  const fadeRight = {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section
      id="about"
      className="relative z-10 bg-bg min-h-[100dvh] flex items-center py-24 px-6"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* Left: Text */}
        <motion.div
          variants={reduce ? undefined : fadeLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <span className="text-[11px] uppercase tracking-[0.18em] text-zinc-500 font-medium block mb-6">
            {t('eyebrow')}
          </span>
          <h2
            className="font-display font-bold tracking-tighter leading-none text-zinc-50 mb-8"
            style={{ fontSize: 'var(--text-h1)' }}
          >
            {t('heading')}
          </h2>
          <div className="space-y-4 max-w-[55ch]">
            <p className="text-zinc-400 leading-relaxed">{t('p1')}</p>
            <p className="text-zinc-400 leading-relaxed">{t('p2')}</p>
            <p className="text-zinc-400 leading-relaxed">{t('p3')}</p>
          </div>
        </motion.div>

        {/* Right: Image with tilt */}
        <motion.div
          variants={reduce ? undefined : fadeRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          style={reduce ? {} : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative aspect-[4/5] rounded-2xl overflow-hidden cursor-none"
        >
          <Image
            src="https://picsum.photos/seed/merla-coffee-about/800/1000"
            alt="Merla Coffee atmosphere"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: About'u page.tsx'e ekle**

```tsx
import Hero from '@/components/Hero';
import About from '@/components/About';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <About />
    </main>
  );
}
```

- [ ] **Step 3: Görsel doğrulama**

Scroll'da About görünür, sol ve sağ animasyonlar çalışır, fotoğraf hover'da hafif tilt yapar.

- [ ] **Step 4: Commit**

```bash
git add components/About.tsx app/[locale]/page.tsx
git commit -m "feat: add About section with split layout and tilt physics"
```

---

## Task 7: Menü Bölümü

**Files:**
- Create: `components/Menu.tsx`
- Create: `lib/menuData.ts`
- Modify: `app/[locale]/page.tsx`

- [ ] **Step 1: lib/menuData.ts oluştur**

```ts
// lib/menuData.ts
export type MenuCategory = 'all' | 'coffee' | 'tea' | 'food' | 'dessert';

export interface MenuItem {
  id: string;
  category: Exclude<MenuCategory, 'all'>;
  name: { de: string; en: string; tr: string };
  price: string;
  image: string;
}

export const MENU_ITEMS: MenuItem[] = [
  { id: '1', category: 'coffee', name: { de: 'Espresso', en: 'Espresso', tr: 'Espresso' }, price: '2,80 €', image: 'https://picsum.photos/seed/espresso-merla/600/400' },
  { id: '2', category: 'coffee', name: { de: 'Flat White', en: 'Flat White', tr: 'Flat White' }, price: '4,20 €', image: 'https://picsum.photos/seed/flatwhite-merla/600/400' },
  { id: '3', category: 'coffee', name: { de: 'Filter Kaffee', en: 'Filter Coffee', tr: 'Filtre Kahve' }, price: '3,50 €', image: 'https://picsum.photos/seed/filter-merla/600/400' },
  { id: '4', category: 'coffee', name: { de: 'Cappuccino', en: 'Cappuccino', tr: 'Cappuccino' }, price: '3,80 €', image: 'https://picsum.photos/seed/cappuccino-merla/600/400' },
  { id: '5', category: 'tea', name: { de: 'Matcha Latte', en: 'Matcha Latte', tr: 'Matcha Latte' }, price: '4,50 €', image: 'https://picsum.photos/seed/matcha-merla/600/400' },
  { id: '6', category: 'tea', name: { de: 'Chai Latte', en: 'Chai Latte', tr: 'Chai Latte' }, price: '4,00 €', image: 'https://picsum.photos/seed/chai-merla/600/400' },
  { id: '7', category: 'food', name: { de: 'Avocado Toast', en: 'Avocado Toast', tr: 'Avokado Toast' }, price: '8,50 €', image: 'https://picsum.photos/seed/avotoast-merla/600/400' },
  { id: '8', category: 'food', name: { de: 'Croissant', en: 'Croissant', tr: 'Kruasan' }, price: '3,20 €', image: 'https://picsum.photos/seed/croissant-merla/600/400' },
  { id: '9', category: 'dessert', name: { de: 'Cheesecake', en: 'Cheesecake', tr: 'Cheesecake' }, price: '5,50 €', image: 'https://picsum.photos/seed/cheesecake-merla/600/400' },
  { id: '10', category: 'dessert', name: { de: 'Brownie', en: 'Brownie', tr: 'Brownie' }, price: '3,80 €', image: 'https://picsum.photos/seed/brownie-merla/600/400' },
];

export const CATEGORIES: MenuCategory[] = ['all', 'coffee', 'tea', 'food', 'dessert'];
```

- [ ] **Step 2: Menu.tsx oluştur**

```tsx
// components/Menu.tsx
'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import Image from 'next/image';
import { MENU_ITEMS, CATEGORIES, type MenuCategory } from '@/lib/menuData';

export default function Menu() {
  const t = useTranslations('menu');
  const locale = useLocale() as 'de' | 'en' | 'tr';
  const reduce = useReducedMotion();
  const [active, setActive] = useState<MenuCategory>('all');

  const filtered = active === 'all'
    ? MENU_ITEMS
    : MENU_ITEMS.filter((item) => item.category === active);

  return (
    <section id="menu" className="relative z-10 bg-bg py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-bold tracking-tighter leading-none text-zinc-50 mb-12"
          style={{ fontSize: 'var(--text-h1)' }}
        >
          {t('heading')}
        </motion.h2>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`relative px-5 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                active === cat ? 'text-zinc-950' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {active === cat && (
                <motion.span
                  layoutId="filter-pill"
                  className="absolute inset-0 bg-zinc-50 rounded-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{t(`categories.${cat}`)}</span>
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={reduce ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: 0.4,
                  delay: i * 0.04,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group relative rounded-2xl overflow-hidden bg-surface cursor-pointer"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name[locale]}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-zinc-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Info */}
                <div className="p-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-zinc-200">{item.name[locale]}</span>
                  <span className="text-sm text-accent font-medium">{item.price}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Menu'yü page.tsx'e ekle**

```tsx
import Hero from '@/components/Hero';
import About from '@/components/About';
import Menu from '@/components/Menu';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <About />
      <Menu />
    </main>
  );
}
```

- [ ] **Step 4: Görsel doğrulama**

Filtre butonu smooth layout transition ile çalışır, kartlar kategori değişiminde animate olur.

- [ ] **Step 5: Commit**

```bash
git add components/Menu.tsx lib/menuData.ts app/[locale]/page.tsx
git commit -m "feat: add Menu section with category filter and animated grid"
```

---

## Task 8: Konum & Çalışma Saatleri

**Files:**
- Create: `components/Location.tsx`
- Modify: `app/[locale]/page.tsx`

- [ ] **Step 1: Location.tsx oluştur**

```tsx
// components/Location.tsx
'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useReducedMotion } from 'motion/react';
import { Copy, Check } from '@phosphor-icons/react';

const HOURS = [
  { dayKey: 'mon', range: '08:00 - 18:00' },
  { dayKey: 'tue', range: '08:00 - 18:00' },
  { dayKey: 'wed', range: '08:00 - 18:00' },
  { dayKey: 'thu', range: '08:00 - 18:00' },
  { dayKey: 'fri', range: '08:00 - 18:00' },
  { dayKey: 'sat', range: '09:00 - 17:00' },
  { dayKey: 'sun', range: null },
] as const;

// JS getDay(): 0=Sun,1=Mon,...,6=Sat — map to our index
const JS_DAY_TO_INDEX: Record<number, number> = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 0: 6 };

export default function Location() {
  const t = useTranslations('location');
  const reduce = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const todayIndex = JS_DAY_TO_INDEX[new Date().getDay()];

  function copyAddress() {
    navigator.clipboard.writeText('Adresse folgt in Kürze, Deutschland');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section id="location" className="relative z-10 bg-surface py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-bold tracking-tighter leading-none text-zinc-50 mb-12"
          style={{ fontSize: 'var(--text-h1)' }}
        >
          {t('heading')}
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Map */}
          <motion.div
            initial={reduce ? false : { opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl overflow-hidden aspect-[4/3] bg-zinc-800"
          >
            {/* Placeholder map — replace with real embed when address is known */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2428.4!2d13.4!3d52.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTLCsDMwJzAwLjAiTiAxM8KwMjQnMDAuMCJF!5e0!3m2!1sde!2sde!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Merla Coffee location"
            />
          </motion.div>

          {/* Hours */}
          <motion.div
            initial={reduce ? false : { opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3 className="text-sm uppercase tracking-[0.15em] text-zinc-500 mb-6">
              {t('hours.heading')}
            </h3>

            <div className="space-y-3">
              {HOURS.map(({ dayKey, range }, i) => (
                <div
                  key={dayKey}
                  className={`flex items-center justify-between py-3 border-b border-zinc-800 ${
                    i === todayIndex ? 'text-zinc-50' : 'text-zinc-500'
                  }`}
                >
                  <span className={`text-sm font-medium ${i === todayIndex ? 'text-accent' : ''}`}>
                    {t(`hours.${dayKey}`)}
                    {i === todayIndex && (
                      <span className="ml-2 text-[10px] uppercase tracking-wider text-accent">heute</span>
                    )}
                  </span>
                  <span className="text-sm">
                    {range ?? t('hours.closed')}
                  </span>
                </div>
              ))}
            </div>

            {/* Address + copy */}
            <div className="mt-8 flex items-center gap-3">
              <p className="text-zinc-400 text-sm">{t('address')}</p>
              <button
                onClick={copyAddress}
                className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                aria-label={t('copyAddress')}
              >
                {copied
                  ? <Check size={14} weight="bold" className="text-accent" />
                  : <Copy size={14} weight="light" />
                }
                {copied ? t('copied') : t('copyAddress')}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Location'ı page.tsx'e ekle**

```tsx
import Hero from '@/components/Hero';
import About from '@/components/About';
import Menu from '@/components/Menu';
import Location from '@/components/Location';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <About />
      <Menu />
      <Location />
    </main>
  );
}
```

- [ ] **Step 3: Görsel doğrulama**

Bugünün günü highlight rengiyle gösterilir, adres kopyalama çalışır.

- [ ] **Step 4: Commit**

```bash
git add components/Location.tsx app/[locale]/page.tsx
git commit -m "feat: add Location section with hours and today highlight"
```

---

## Task 9: Yorumlar Bölümü (Kinetic Marquee)

**Files:**
- Create: `components/Reviews.tsx`
- Modify: `app/[locale]/page.tsx`

- [ ] **Step 1: Reviews.tsx oluştur**

```tsx
// components/Reviews.tsx
'use client';

import { useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, useReducedMotion } from 'motion/react';
import { Star } from '@phosphor-icons/react';

const REVIEWS = [
  { id: 1, name: 'Emma S.', rating: 5, de: 'Der beste Kaffee in der Stadt. Absolute Empfehlung!', en: 'Best coffee in the city. Highly recommended!', tr: 'Şehrin en iyi kahvesi. Kesinlikle tavsiye ederim!' },
  { id: 2, name: 'Jonas M.', rating: 5, de: 'Entspannte Atmosphäre und unglaublich guter Filter-Kaffee.', en: 'Relaxed atmosphere and incredibly good filter coffee.', tr: 'Rahatlatıcı atmosfer ve inanılmaz iyi filtre kahve.' },
  { id: 3, name: 'Sofia K.', rating: 5, de: 'Mein täglicher Lieblingsort. Die Flat Whites sind perfekt.', en: 'My daily favorite spot. The flat whites are perfect.', tr: 'Günlük favori yerim. Flat white\'ler mükemmel.' },
  { id: 4, name: 'Lukas B.', rating: 5, de: 'Tolle Qualität, freundliches Personal und schönes Ambiente.', en: 'Great quality, friendly staff and beautiful ambiance.', tr: 'Harika kalite, güler yüzlü personel ve güzel ortam.' },
  { id: 5, name: 'Mia R.', rating: 5, de: 'Der Matcha Latte ist ein Traum. Komme immer wieder gerne.', en: 'The matcha latte is a dream. I keep coming back.', tr: 'Matcha latte bir rüya gibi. Tekrar tekrar geliyorum.' },
  { id: 6, name: 'Noah W.', rating: 5, de: 'Handwerklich zubereiteter Kaffee auf höchstem Niveau.', en: 'Handcrafted coffee at the highest level.', tr: 'En yüksek seviyede el yapımı kahve.' },
];

export default function Reviews() {
  const t = useTranslations('reviews');
  const locale = useLocale() as 'de' | 'en' | 'tr';
  const reduce = useReducedMotion();

  // Duplicate for seamless loop
  const doubled = [...REVIEWS, ...REVIEWS];

  return (
    <section id="reviews" className="relative z-10 bg-bg py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-bold tracking-tighter leading-none text-zinc-50"
          style={{ fontSize: 'var(--text-h1)' }}
        >
          {t('heading')}
        </motion.h2>
      </div>

      {/* Marquee track */}
      <div className="group flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <motion.div
          animate={reduce ? {} : { x: ['0%', '-50%'] }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="flex gap-6 group-hover:[animation-play-state:paused]"
          style={{ width: 'max-content' }}
        >
          {doubled.map((review, i) => (
            <div
              key={`${review.id}-${i}`}
              className="w-[340px] flex-shrink-0 bg-surface rounded-2xl p-6 border border-zinc-800"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star key={j} size={14} weight="fill" className="text-accent" />
                ))}
              </div>
              {/* Quote */}
              <p className="text-zinc-300 text-sm leading-relaxed mb-4 line-clamp-3">
                {review[locale]}
              </p>
              {/* Name */}
              <p className="text-zinc-500 text-xs font-medium">{review.name}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Reviews'ı page.tsx'e ekle**

```tsx
import Hero from '@/components/Hero';
import About from '@/components/About';
import Menu from '@/components/Menu';
import Location from '@/components/Location';
import Reviews from '@/components/Reviews';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <About />
      <Menu />
      <Location />
      <Reviews />
    </main>
  );
}
```

- [ ] **Step 3: Görsel doğrulama**

Marquee sürekli kayar, hover'da durur, iki kenarda gradient mask var.

- [ ] **Step 4: Commit**

```bash
git add components/Reviews.tsx app/[locale]/page.tsx
git commit -m "feat: add Reviews kinetic marquee with pause on hover"
```

---

## Task 10: İletişim Formu + API

**Files:**
- Create: `app/api/contact/route.ts`
- Create: `components/Contact.tsx`
- Modify: `app/[locale]/page.tsx`

- [ ] **Step 1: .env.local oluştur**

```bash
echo "RESEND_API_KEY=re_YOUR_KEY_HERE" >> .env.local
echo "RESEND_FROM_EMAIL=noreply@merlacoffee.de" >> .env.local
```

Gerçek key için: https://resend.com/api-keys

- [ ] **Step 2: API route oluştur**

```ts
// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? 'noreply@merlacoffee.de',
      to: 'info@merlacoffee.de',
      subject: `Neue Nachricht von ${name}`,
      text: `Name: ${name}\nE-Mail: ${email}\n\nNachricht:\n${message}`,
      replyTo: email,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
```

- [ ] **Step 3: Contact.tsx oluştur**

```tsx
// components/Contact.tsx
'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useReducedMotion } from 'motion/react';
import { CheckCircle } from '@phosphor-icons/react';

type FormState = 'idle' | 'sending' | 'success' | 'error';

export default function Contact() {
  const t = useTranslations('contact');
  const reduce = useReducedMotion();
  const [state, setState] = useState<FormState>('idle');
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setState(res.ok ? 'success' : 'error');
    } catch {
      setState('error');
    }
  }

  return (
    <section id="contact" className="relative z-10 bg-surface py-24 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-bold tracking-tighter leading-none text-zinc-50 mb-12"
          style={{ fontSize: 'var(--text-h1)' }}
        >
          {t('heading')}
        </motion.h2>

        {state === 'success' ? (
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4 py-16 text-center"
          >
            <CheckCircle size={48} weight="light" className="text-accent" />
            <p className="text-zinc-300">{t('success')}</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.15em] text-zinc-500" htmlFor="name">
                {t('name')}
              </label>
              <input
                id="name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.15em] text-zinc-500" htmlFor="email">
                {t('email')}
              </label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.15em] text-zinc-500" htmlFor="message">
                {t('message')}
              </label>
              <textarea
                id="message"
                rows={5}
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors text-sm resize-none"
              />
            </div>

            {state === 'error' && (
              <p className="text-red-400 text-sm">{t('error')}</p>
            )}

            <button
              type="submit"
              disabled={state === 'sending'}
              className="w-full py-4 rounded-xl bg-accent text-zinc-50 font-medium text-sm tracking-wide hover:bg-[#d4704a] active:scale-[0.99] disabled:opacity-60 transition-all duration-200"
            >
              {state === 'sending' ? t('sending') : t('send')}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Contact'ı page.tsx'e ekle**

```tsx
import Hero from '@/components/Hero';
import About from '@/components/About';
import Menu from '@/components/Menu';
import Location from '@/components/Location';
import Reviews from '@/components/Reviews';
import Contact from '@/components/Contact';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <About />
      <Menu />
      <Location />
      <Reviews />
      <Contact />
    </main>
  );
}
```

- [ ] **Step 5: Görsel doğrulama**

Form submit edilebilir, `sending` durumunda buton disabled olur, success animasyonu çalışır.

- [ ] **Step 6: Commit**

```bash
git add app/api/contact/route.ts components/Contact.tsx app/[locale]/page.tsx
git commit -m "feat: add Contact form with Resend API and submit animation"
```

---

## Task 11: Footer & Yasal Sayfalar

**Files:**
- Create: `components/Footer.tsx`
- Create: `app/[locale]/impressum/page.tsx`
- Create: `app/[locale]/datenschutz/page.tsx`
- Modify: `app/[locale]/page.tsx`

- [ ] **Step 1: Footer.tsx oluştur**

```tsx
// components/Footer.tsx
import { useTranslations } from 'next-intl';
import { getLocale } from 'next-intl/server';
import Link from 'next/link';
import { InstagramLogo, FacebookLogo } from '@phosphor-icons/react/dist/ssr';

export default async function Footer() {
  const t = useTranslations('footer');
  const locale = await getLocale();

  return (
    <footer className="bg-zinc-900 border-t border-zinc-800 py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-display font-bold text-zinc-50">Merla Coffee</span>

        <p className="text-xs text-zinc-500 order-last sm:order-none">{t('copyright')}</p>

        <div className="flex items-center gap-6">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-zinc-500 hover:text-zinc-300 transition-colors">
            <InstagramLogo size={18} weight="light" />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-zinc-500 hover:text-zinc-300 transition-colors">
            <FacebookLogo size={18} weight="light" />
          </a>
          <Link href={`/${locale}/impressum`} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
            {t('impressum')}
          </Link>
          <Link href={`/${locale}/datenschutz`} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
            {t('datenschutz')}
          </Link>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: app/[locale]/impressum/page.tsx oluştur**

```tsx
// app/[locale]/impressum/page.tsx
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function ImpressumPage() {
  const t = useTranslations('impressum');
  return (
    <main className="min-h-screen bg-bg pt-24 pb-16 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display font-bold text-h1 tracking-tighter text-zinc-50 mb-8">{t('heading')}</h1>
        <p className="text-zinc-400 leading-relaxed">{t('placeholder')}</p>
        <Link href="/" className="inline-block mt-12 text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
          Zuruck
        </Link>
      </div>
    </main>
  );
}
```

- [ ] **Step 3: app/[locale]/datenschutz/page.tsx oluştur**

```tsx
// app/[locale]/datenschutz/page.tsx
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function DatenschutzPage() {
  const t = useTranslations('datenschutz');
  return (
    <main className="min-h-screen bg-bg pt-24 pb-16 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display font-bold text-h1 tracking-tighter text-zinc-50 mb-8">{t('heading')}</h1>
        <p className="text-zinc-400 leading-relaxed">{t('placeholder')}</p>
        <Link href="/" className="inline-block mt-12 text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
          Zuruck
        </Link>
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Footer'ı layout'a ekle**

`app/[locale]/layout.tsx` içinde `{children}`'dan sonra:

```tsx
import Footer from '@/components/Footer';
// ...
<NextIntlClientProvider messages={messages}>
  <Nav />
  {children}
  <Footer />
</NextIntlClientProvider>
```

- [ ] **Step 5: Build kontrolü**

```bash
npm run build
```

Expected: 0 hata.

- [ ] **Step 6: Commit**

```bash
git add components/Footer.tsx app/[locale]/impressum app/[locale]/datenschutz app/[locale]/layout.tsx
git commit -m "feat: add Footer and Impressum/Datenschutz legal pages"
```

---

## Task 12: SEO

**Files:**
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`

- [ ] **Step 1: sitemap.ts oluştur**

```ts
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
```

- [ ] **Step 2: robots.ts oluştur**

```ts
// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://merlacoffee.de/sitemap.xml',
  };
}
```

- [ ] **Step 3: TypeScript + Build doğrulama**

```bash
npx tsc --noEmit && npm run build
```

Expected: 0 hata, sitemap.xml erişilebilir.

- [ ] **Step 4: Commit**

```bash
git add app/sitemap.ts app/robots.ts
git commit -m "feat: add sitemap and robots for SEO"
```

---

## Task 13: Vercel Deploy

**Files:**
- Create: `vercel.json`

- [ ] **Step 1: GitHub repo oluştur ve push et**

```bash
git remote add origin https://github.com/YOUR_USERNAME/merlacoffee.git
git branch -M main
git push -u origin main
```

- [ ] **Step 2: vercel.json oluştur**

```json
{
  "framework": "nextjs",
  "buildCommand": "next build",
  "devCommand": "next dev",
  "installCommand": "npm install"
}
```

- [ ] **Step 3: Vercel CLI ile deploy et**

```bash
npx vercel --prod
```

Yönergeleri izle: GitHub repo bağla, environment variable ekle.

- [ ] **Step 4: Vercel dashboard'da env var ekle**

Vercel Dashboard → Project → Settings → Environment Variables:
- `RESEND_API_KEY` → Resend'den aldığın key
- `RESEND_FROM_EMAIL` → `noreply@merlacoffee.de`

- [ ] **Step 5: Domain bağla**

Vercel Dashboard → Project → Settings → Domains:
- `merlacoffee.de` ekle
- DNS kayıtlarını domain sağlayıcında güncelle (Vercel'in verdiği A/CNAME recordları)

- [ ] **Step 6: Son build doğrulama**

```bash
npm run build
```

Expected: 0 hata, tüm sayfalar static/dynamic olarak generate edildi.

- [ ] **Step 7: Commit**

```bash
git add vercel.json
git commit -m "feat: add vercel config"
git push origin main
```

---

## Self-Review

### Spec Coverage

| Spec Maddesi | Task |
|---|---|
| Hero — scroll-pin + parallax | Task 5 |
| Hakkımızda — asymmetric split + tilt | Task 6 |
| Menü — fotoğraflı grid + filtre | Task 7 |
| Konum & Çalışma saatleri | Task 8 |
| Yorumlar — kinetic marquee | Task 9 |
| İletişim formu + Resend | Task 10 |
| Footer + Impressum + Datenschutz | Task 11 |
| DE / EN / TR i18n | Task 2 |
| Design tokens + tipografi | Task 3 |
| Nav + dil seçici + hamburger | Task 4 |
| SEO sitemap + robots | Task 12 |
| Vercel deploy + domain | Task 13 |
| Cabinet Grotesk + Geist font | Task 1 + Task 3 |
| `prefers-reduced-motion` | Her animasyon bileşeninde |

### Açık Maddeler (Faz-1 Dışı)
- Gerçek logo → `components/Nav.tsx` ve `Footer.tsx`'teki text placeholder'ı değiştirilir
- Gerçek renk paleti → `app/globals.css` CSS değişkenleri güncellenir
- Gerçek adres → `components/Location.tsx` Maps iframe src + address string
- Gerçek menü fotoğrafları → `lib/menuData.ts` image URL'leri
