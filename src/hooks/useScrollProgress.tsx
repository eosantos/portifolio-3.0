'use client';

import {
  useEffect,
  useState,
  createContext,
  useContext,
  ReactNode
} from 'react';
import { useScroll, useTransform, MotionValue } from 'framer-motion';

interface ScrollProgressContextValue {
  scrollY: MotionValue<number>;
  scrollYProgress: MotionValue<number>;
  heroProgress: MotionValue<number>;
  isReducedMotion: boolean;
}

const ScrollProgressContext = createContext<ScrollProgressContextValue | null>(
  null
);

export function ScrollProgressProvider({ children }: { children: ReactNode }) {
  const { scrollY, scrollYProgress } = useScroll();
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  const heroProgress = useTransform(scrollYProgress, [0, 0.6], [0, 1]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setIsReducedMotion(event.matches);
    };

    mediaQuery.addEventListener?.('change', handler);
    return () => mediaQuery.removeEventListener?.('change', handler);
  }, []);

  const mockHeroProgress = {
    get: () => 0,
    onChange: () => {},
    current: 0,
    prev: 0,
    prevFrameValue: 0,
    updatedAt: 0,
    on: () => () => {},
    interpolate: (fn: (v: number) => string | number) => {
      const result = {
        get: () => fn(0),
        onChange: () => {},
        current: fn(0),
        prev: fn(0),
        prevFrameValue: fn(0),
        updatedAt: 0,
        on: () => () => {},
        interpolate: () => mockHeroProgress
      };
      return result;
    }
  } as unknown as MotionValue<number>;

  const value: ScrollProgressContextValue = {
    scrollY,
    scrollYProgress,
    heroProgress: isReducedMotion ? mockHeroProgress : heroProgress,
    isReducedMotion
  };

  return (
    <ScrollProgressContext.Provider value={value as ScrollProgressContextValue}>
      {children}
    </ScrollProgressContext.Provider>
  );
}

export function useScrollProgress() {
  const context = useContext(ScrollProgressContext);
  if (!context) {
    throw new Error(
      'useScrollProgress must be used within ScrollProgressProvider'
    );
  }
  return context;
}

export function useScrollYProgress() {
  const { scrollYProgress, isReducedMotion } = useScrollProgress();
  return { scrollYProgress, isReducedMotion };
}
