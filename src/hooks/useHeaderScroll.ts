'use client';

import { useEffect, useState } from 'react';
import { useScroll, useTransform, MotionValue } from 'framer-motion';

function createMockMotionValue<T>(value: T): MotionValue<T> {
  return {
    get: () => value,
    onChange: () => {},
    on: () => () => {},
    interpolate: (fn: (v: T) => string) => createMockMotionValue(fn(value))
  } as unknown as MotionValue<T>;
}

export function useHeaderScroll() {
  const { scrollY } = useScroll();
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  const backgroundOpacity = useTransform(scrollY, [0, 100], [0, 1]);
  const backdropBlur = useTransform(scrollY, [0, 200], [0, 16]);
  const heightScale = useTransform(scrollY, [0, 200], [1, 0.9]);
  const borderOpacity = useTransform(scrollY, [0, 100], [0, 1]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setIsReducedMotion(event.matches);
    };

    mediaQuery.addEventListener?.('change', handler);
    return () => mediaQuery.removeEventListener?.('change', handler);
  }, []);

  if (isReducedMotion) {
    return {
      backgroundOpacity: createMockMotionValue(1),
      backdropBlur: createMockMotionValue(16),
      heightScale: createMockMotionValue(1),
      borderOpacity: createMockMotionValue(1)
    };
  }

  return {
    backgroundOpacity,
    backdropBlur,
    heightScale,
    borderOpacity
  };
}
