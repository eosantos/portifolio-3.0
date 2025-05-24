// src/app/layout.tsx
import type { Metadata } from 'next';
import { Catamaran } from 'next/font/google';
import { ThemeProvider } from '../providers/theme-provider';

// Fonte com todos os pesos (100 a 900)
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
    <html lang="pt-BR">
      <body className={catamaran.className}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
