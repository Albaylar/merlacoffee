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
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="font-display font-bold tracking-tighter leading-none text-zinc-50 mb-12"
          style={{ fontSize: 'var(--text-h1)' }}
        >
          {t('heading')}
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-start">
          {/* Map */}
          <motion.div
            initial={reduce ? false : { opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[4/3] min-h-[200px] max-h-[360px] bg-zinc-800"
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
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
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
