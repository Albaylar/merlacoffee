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
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
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
                initial={reduce ? false : { opacity: 0, y: 32, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, y: -8 }}
                transition={{
                  duration: 0.45,
                  delay: i * 0.06,
                  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                }}
                className="group relative rounded-2xl overflow-hidden bg-surface cursor-pointer active:scale-[0.98] transition-transform"
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
