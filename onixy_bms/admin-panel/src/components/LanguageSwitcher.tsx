'use client';

import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

const locales = ['en', 'fr', 'zh'];

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const currentLocale = useLocale();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    const segments = pathname.split('/');

    segments[1] = newLocale;
    const newPath = segments.join('/');

    // Perform full reload to ensure styling and <html lang=""> updates
    window.location.href = newPath;
  };

  return (
    <select value={currentLocale} onChange={handleChange}>
      {locales.map((locale) => (
        <option key={locale} value={locale}>
          {locale.toUpperCase()}
        </option>
      ))}
    </select>
  );
}
