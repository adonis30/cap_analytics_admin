import { NextIntlClientProvider, AbstractIntlMessages } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Sidebar from '@/components/AppSidebar';
import Navbar from '@/components/Navbar';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { SidebarProvider } from '@/components/ui/sidebar';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;

  let messages: AbstractIntlMessages;
  try {
    messages = await getMessages({ locale });
  } catch {
    notFound(); // 404 if locale is invalid
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <NextIntlClientProvider locale={locale} messages={messages}>
              <Sidebar />
              <main className="w-full">
                <Navbar />
                <div className="px-4">{children}</div>
              </main>
            </NextIntlClientProvider>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
