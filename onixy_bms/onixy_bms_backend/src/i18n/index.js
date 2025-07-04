import path from 'path';
import fs from 'fs';

const localesPath = path.resolve('src/i18n/locales');

const translations = {};
['en', 'fr', 'zh'].forEach((lang) => {
  const filePath = path.join(localesPath, `${lang}.json`);
  translations[lang] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
});

export const getTranslation = (locale = 'en', key) => {
  return translations[locale]?.[key] || translations['en'][key] || key;
};
