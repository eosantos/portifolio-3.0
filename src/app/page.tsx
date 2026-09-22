'use client';

import { ScrollProgressProvider } from '@/hooks/useScrollProgress';
import Home from '@/sections/Home';
import Sobre from '@/sections/Sobre';
import Projetos from '@/sections/Projetos';
import Contato from '@/sections/Contato';

export default function App() {
  return (
    <ScrollProgressProvider>
      <main>
        <Home />
        <Sobre />
        <Projetos />
        <Contato />
      </main>
    </ScrollProgressProvider>
  );
}
