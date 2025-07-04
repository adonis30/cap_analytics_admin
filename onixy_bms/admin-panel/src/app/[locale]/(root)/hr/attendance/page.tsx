import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale });
  return {
    title: `${t('hr.attendance.title')} | HR`,
    description: t('hr.attendance.description'),
  };
}

export default async function AttendancePage() {
  const t = await getTranslations('hr.attendance');
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{t('title')}</h1>
      <p className="text-gray-600 mt-2">{t('description')}</p>
    </div>
  );
}
