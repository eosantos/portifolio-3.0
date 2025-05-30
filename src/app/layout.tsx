import { FadeWrapper, SplashWrapper } from '@/components/splash';
import PageTransition from '@/components/transition/PageTransition';
import '@/i18n';
import { LanguageProvider } from '@/providers/LanguageProvider';
import { ThemeProvider } from '@/providers/theme-provider';
import type { Metadata } from 'next';
import { Catamaran } from 'next/font/google';
import Script from 'next/script';

const catamaran = Catamaran({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

export const metadata: Metadata = {
  title: {
    default: 'Dudev – Desenvolvedor Front-end',
    template: '%s | Dudev'
  },
  description:
    'Portfólio de Eduardo – Desenvolvedor Front-end focado em performance, acessibilidade e design moderno.',
  keywords: [
    'Desenvolvedor Front-end',
    'React Developer',
    'Portfólio Dev',
    'Next.js',
    'Eduardo Dev',
    'Frontend Developer',
    'UI Developer'
  ],
  authors: [{ name: 'Eduardo', url: 'https://dudev.com.br' }],
  creator: 'Eduardo',
  metadataBase: new URL('https://dudev.com.br'),
  openGraph: {
    title: 'Dudev – Desenvolvedor Front-end',
    description:
      'Portfólio de Eduardo com foco em interfaces modernas e performáticas.',
    url: 'https://dudev.com.br',
    siteName: 'Dudev',
    images: [
      {
        url: '/assets/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Imagem de capa do site Dudev'
      }
    ],
    locale: 'pt_BR',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dudev – Desenvolvedor Front-end',
    description: 'Interfaces modernas, acessíveis e performáticas.',
    images: ['/assets/og-image.png'],
    creator: '@dudev'
  }
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
          <LanguageProvider>
            <SplashWrapper>
              <FadeWrapper>
                <PageTransition>{children}</PageTransition>
              </FadeWrapper>
            </SplashWrapper>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
