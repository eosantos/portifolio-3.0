'use client';

import Sobre from '@/sections/Sobre';
import Home from 'sections/Home';
import { useTheme } from '../providers/theme-provider';

export default function App() {
  const { toggleTheme, isDark } = useTheme();

  return (
    <main>
      <button onClick={toggleTheme}>
        Mudar para modo {isDark ? 'escuro' : 'claro'}
      </button>
      <Home />
      <Sobre />
      {/* You can add more sections here as needed */}
    </main>
  );
}
