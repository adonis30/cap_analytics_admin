import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'fr', 'zh'], // Supported locales
  defaultLocale: 'en',         // Fallback
  pathnames: {
    '/': '/', // Home route
    '/pathnames': {
      fr: '/noms-de-chemins',
      zh: '/路径名称',
      // English uses the default "/pathnames"
    }
  }
});
