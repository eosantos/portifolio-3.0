import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

let pluginRegistered = false;

function ensurePlugin(): boolean {
  if (typeof window === 'undefined') return false;
  if (!pluginRegistered) {
    gsap.registerPlugin(ScrollToPlugin);
    pluginRegistered = true;
  }
  return true;
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)')?.matches === true
  );
}

/**
 * Smooth-scrolls to a section by id (without the leading `#`).
 * - Uses GSAP ScrollToPlugin (~0.8s, eased) for a perceptible but quick transition.
 * - Falls back to instant jump when reduced motion is preferred or GSAP is unavailable.
 * - No-ops (without throwing) when the target element does not exist.
 * - Anchor `hrefs` are kept on links for progressive enhancement when JS is off.
 */
export function scrollToSection(id: string): void {
  if (typeof document === 'undefined') return;
  const target = document.getElementById(id);
  if (!target) return;

  if (prefersReducedMotion() || !ensurePlugin()) {
    target.scrollIntoView();
    return;
  }

  gsap.to(window, {
    duration: 0.8,
    ease: 'power3.inOut',
    scrollTo: { y: target, offsetY: 72 }
  });
}
