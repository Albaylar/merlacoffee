'use client';

import { useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, useReducedMotion, useAnimationControls } from 'motion/react';
import { Star } from '@phosphor-icons/react';

const REVIEWS = [
  { id: 1, name: 'Emma S.', rating: 5, de: 'Der beste Kaffee in der Stadt. Absolute Empfehlung!', en: 'Best coffee in the city. Highly recommended!', tr: 'Şehrin en iyi kahvesi. Kesinlikle tavsiye ederim!' },
  { id: 2, name: 'Jonas M.', rating: 5, de: 'Entspannte Atmosphäre und unglaublich guter Filter-Kaffee.', en: 'Relaxed atmosphere and incredibly good filter coffee.', tr: 'Rahatlatıcı atmosfer ve inanılmaz iyi filtre kahve.' },
  { id: 3, name: 'Sofia K.', rating: 5, de: 'Mein täglicher Lieblingsort. Die Flat Whites sind perfekt.', en: 'My daily favorite spot. The flat whites are perfect.', tr: "Günlük favori yerim. Flat white'ler mükemmel." },
  { id: 4, name: 'Lukas B.', rating: 5, de: 'Tolle Qualität, freundliches Personal und schönes Ambiente.', en: 'Great quality, friendly staff and beautiful ambiance.', tr: 'Harika kalite, güler yüzlü personel ve güzel ortam.' },
  { id: 5, name: 'Mia R.', rating: 5, de: 'Der Matcha Latte ist ein Traum. Komme immer wieder gerne.', en: 'The matcha latte is a dream. I keep coming back.', tr: 'Matcha latte bir rüya gibi. Tekrar tekrar geliyorum.' },
  { id: 6, name: 'Noah W.', rating: 5, de: 'Handwerklich zubereiteter Kaffee auf höchstem Niveau.', en: 'Handcrafted coffee at the highest level.', tr: 'En yüksek seviyede el yapımı kahve.' },
];

const MARQUEE_TRANSITION = {
  duration: 30,
  repeat: Infinity,
  ease: 'linear' as const,
};

export default function Reviews() {
  const t = useTranslations('reviews');
  const locale = useLocale() as 'de' | 'en' | 'tr';
  const reduce = useReducedMotion();
  const controls = useAnimationControls();

  // Duplicate for seamless loop
  const doubled = [...REVIEWS, ...REVIEWS];

  useEffect(() => {
    if (!reduce) {
      controls.start({ x: ['0%', '-50%'], transition: MARQUEE_TRANSITION });
    }
  }, [reduce, controls]);

  return (
    <section id="reviews" className="relative z-10 bg-bg py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="font-display font-bold tracking-tighter leading-none text-zinc-50"
          style={{ fontSize: 'var(--text-h1)' }}
        >
          {t('heading')}
        </motion.h2>
      </div>

      {/* Marquee track */}
      <div
        className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]"
        onMouseEnter={() => controls.stop()}
        onMouseLeave={() => {
          if (!reduce) {
            controls.start({ x: ['0%', '-50%'], transition: MARQUEE_TRANSITION });
          }
        }}
      >
        <motion.div
          animate={controls}
          className="flex gap-3 sm:gap-6"
          style={{ width: 'max-content' }}
        >
          {doubled.map((review, i) => (
            <div
              key={`${review.id}-${i}`}
              className="w-[80vw] sm:w-[340px] flex-shrink-0 bg-surface rounded-2xl p-6 border border-zinc-800"
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
