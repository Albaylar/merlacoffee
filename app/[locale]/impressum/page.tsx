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
