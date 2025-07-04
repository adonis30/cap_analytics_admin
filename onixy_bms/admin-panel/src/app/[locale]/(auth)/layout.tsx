// app/[locale]/(auth)/layout.tsx
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';

export default async function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;

  const messages = await getMessages({ locale }).catch(() => notFound());

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="flex items-center justify-center min-h-screen bg-gray-100">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
