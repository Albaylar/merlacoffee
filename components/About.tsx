'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useMotionValue, useTransform, useReducedMotion } from 'motion/react';
import Image from 'next/image';

export default function About() {
  const t = useTranslations('about');
  const reduce = useReducedMotion();

  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(window.matchMedia('(hover: none)').matches);
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [4, -4]);
  const rotateY = useTransform(x, [-100, 100], [-4, 4]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce || isTouch) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const cubicEase = [0.16, 1, 0.3, 1] as [number, number, number, number];

  const fadeLeft = {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: cubicEase } },
  };

  const fadeRight = {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: cubicEase } },
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
            {(['p1', 'p2', 'p3'] as const).map((key, i) => (
              <motion.p
                key={key}
                initial={reduce ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.65, ease: cubicEase, delay: 0.15 + i * 0.12 }}
                className="text-zinc-400 leading-relaxed"
              >
                {t(key)}
              </motion.p>
            ))}
          </div>
        </motion.div>

        {/* Right: Image with tilt */}
        <motion.div
          variants={reduce ? undefined : fadeRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          style={reduce || isTouch ? {} : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative aspect-[4/5] rounded-2xl overflow-hidden cursor-none"
        >
          <Image
            src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&h=1000&q=85&auto=format&fit=crop"
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
