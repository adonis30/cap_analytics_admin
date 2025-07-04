import {getRequestConfig} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {routing} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const namespaces = ['common', 'homepage']; // add more as needed

  const messages = Object.fromEntries(
    await Promise.all(
      namespaces.map(async (ns) => {
        try {
          const module = await import(`../../messages/${locale}/${ns}.json`);
          return [ns, module.default];
        } catch (error) {
          console.error(`❌ Failed to load: ${locale}/${ns}.json`, error);
          return [ns, {}]; // fallback
        }
      })
    )
  );

  return {
    locale,
    messages
  };
});
