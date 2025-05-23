// src/app/page.tsx
'use client';

import { useTheme } from '../providers/theme-provider';

export default function Home() {
  const { toggleTheme, isDark } = useTheme();

  return (
    <main>
      <h1>Olá, eu sou o Eduardo 👋</h1>
      <button onClick={toggleTheme}>
        Mudar para modo {isDark ? 'claro' : 'escuro'}
      </button>
    </main>
  );
}
