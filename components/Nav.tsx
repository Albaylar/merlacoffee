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
    if (LOCALES.includes(segments[1] as typeof LOCALES[number])) {
      segments[1] = newLocale;
      router.push(segments.join('/'));
    } else {
      router.push(`/${newLocale}`);
    }
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
                  aria-label={`Switch language to ${l}`}
                  aria-pressed={locale === l}
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
            className="md:hidden text-zinc-400 hover:text-zinc-50 transition-colors -mr-2 p-2"
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
            className="fixed inset-0 z-[60] bg-bg flex flex-col px-6 pt-[max(2rem,env(safe-area-inset-top))] pb-8"
          >
            <div className="flex items-center justify-between mb-12">
              <span className="font-display font-bold text-xl">Merla Coffee</span>
              <button
                onClick={() => setMenuOpen(false)}
                className="text-zinc-400 hover:text-zinc-50 transition-colors p-2 -mr-2"
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
                  exit={reduce ? undefined : { opacity: 0, x: -20 }}
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
                  aria-label={`Switch language to ${l}`}
                  aria-pressed={locale === l}
                  className={`text-sm uppercase tracking-wider px-4 py-3 rounded transition-colors ${
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
