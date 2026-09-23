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
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
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
