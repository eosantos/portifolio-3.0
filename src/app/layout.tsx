import { FadeWrapper, SplashWrapper } from '@/components/splash';
import { ThemeProvider } from '@/providers/theme-provider';
import type { Metadata } from 'next';
import { Catamaran } from 'next/font/google';
import Script from 'next/script';

const catamaran = Catamaran({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

export const metadata: Metadata = {
  title: 'Dudev',
  description: 'Desenvolvedor Front-end'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            (function () {
              try {
                const storedTheme = localStorage.getItem('theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const theme = storedTheme || (prefersDark ? 'dark' : 'light');
                document.documentElement.classList.add(theme);
              } catch (e) {}
            })();
          `}
        </Script>
      </head>
      <body className={catamaran.className}>
        <ThemeProvider>
          <SplashWrapper>
            <FadeWrapper>{children}</FadeWrapper>
          </SplashWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
