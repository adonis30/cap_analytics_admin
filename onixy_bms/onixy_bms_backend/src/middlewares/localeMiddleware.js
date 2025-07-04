export const detectLocale = (req, res, next) => {
  const localeFromUrl = req.path.split('/')[1];
  const supportedLocales = ['en', 'fr', 'zh'];

  req.locale = supportedLocales.includes(localeFromUrl)
    ? localeFromUrl
    : 'en';

  next();
};
