'use client';

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode
} from 'react';

interface RevealProps {
  children: ReactNode;
  /** stagger delay in ms */
  delay?: number;
  /** vertical offset in px for the entrance */
  y?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Minimal scroll-into-view reveal: fade + slight rise, once.
 * - Uses IntersectionObserver (no scroll listeners, no animation libs).
 * - Respects prefers-reduced-motion: content shows immediately, no pin.
 * - SSR-safe: renders hidden, reveals in effect after mount.
 */
export default function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  style
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)')?.matches === true;
    if (prefersReduced) {
      setVisible(true);
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : `translateY(${y}px)`,
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms`,
        willChange: visible ? undefined : 'opacity, transform',
        ...style
      }}
    >
      {children}
    </div>
  );
}
