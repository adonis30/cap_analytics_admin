import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale });
  return {
    title: `${t('hr.performance.title')} | HR`
  };
}

export default async function PerformancePage() {
  const t = await getTranslations('hr.performance');
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{t('title')}</h1>
      <p className="text-gray-600 mt-2">{t('description')}</p>
    </div>
  );
}