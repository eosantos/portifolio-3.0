'use client';

import { ScrollProgressProvider } from '@/hooks/useScrollProgress';
import Home from '@/sections/Home';
//import Identity from '@/sections/Identity';
import Sobre from '@/sections/Sobre';
import Projetos from '@/sections/Projetos';
import Contato from '@/sections/Contato';

export default function App() {
  return (
    <ScrollProgressProvider>
      <main>
        <Home />
        {/* <Identity /> */}
        <Sobre />
        <Projetos />
        <Contato />
      </main>
    </ScrollProgressProvider>
  );
}
