'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useReducedMotion } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const wordContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};
const wordReveal = {
  hidden: { opacity: 0, y: 64, skewY: 3 },
  visible: { opacity: 1, y: 0, skewY: 0, transition: { duration: 0.85, ease: EASE } },
};

export default function Hero() {
  const t = useTranslations('hero');
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !sectionRef.current || !imageRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=100%',
        pin: true,
        pinSpacing: false,
      });

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
          src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1600&h=900&q=85&auto=format&fit=crop"
          alt="Merla Coffee"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-zinc-950/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        {/* Word-by-word H1 reveal */}
        <motion.h1
          variants={reduce ? undefined : wordContainer}
          initial="hidden"
          animate="visible"
          className="font-display font-bold tracking-tighter leading-none text-zinc-50 mb-6 flex flex-wrap"
          style={{ fontSize: 'var(--text-display)', gap: '0 0.25em' }}
        >
          {['Merla', 'Coffee'].map((word) => (
            <span key={word} className="overflow-hidden inline-block">
              <motion.span variants={reduce ? undefined : wordReveal} className="inline-block">
                {word}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.55 }}
          className="text-body-lg text-zinc-400 mb-10 max-w-md"
        >
          {t('tagline')}
        </motion.p>

        <motion.a
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.75 }}
          href="#menu"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-accent text-zinc-50 font-medium text-sm tracking-wide hover:bg-[#d4704a] active:scale-[0.98] transition-all duration-200"
        >
          {t('cta')}
        </motion.a>
      </div>
    </section>
  );
}
