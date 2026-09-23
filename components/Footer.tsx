import { getLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { InstagramLogo, FacebookLogo } from '@phosphor-icons/react/dist/ssr';

export default async function Footer() {
  const [t, locale] = await Promise.all([getTranslations('footer'), getLocale()]);

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
