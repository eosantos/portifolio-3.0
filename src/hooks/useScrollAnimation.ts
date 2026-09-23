'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useScrollAnimation() {
  const ctxRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    ctxRef.current = gsap.context(() => {});

    return () => {
      ctxRef.current?.revert();
    };
  }, []);

  return ctxRef.current;
}

export function createScrollTrigger(config: ScrollTrigger.Vars) {
  return ScrollTrigger.create(config);
}

// ScrollTrigger.getScrollDirection is not available in all versions
export function getScrollProgress(): number {
  return 1;
}
