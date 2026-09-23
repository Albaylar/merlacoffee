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
