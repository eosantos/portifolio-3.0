'use client';

import { ScrollProgressProvider } from '@/hooks/useScrollProgress';
import Home from '@/sections/Home';
import Manifesto from '@/sections/Manifesto';
import Sobre from '@/sections/Sobre';
import Stacks from '@/sections/Stacks';
import Projetos from '@/sections/Projetos';
import Contato from '@/sections/Contato';

export default function App() {
  return (
    <ScrollProgressProvider>
      <main>
        <Home />
        <Manifesto />
        <Sobre />
        <Stacks />
        <Projetos />
        <Contato />
      </main>
    </ScrollProgressProvider>
  );
}
