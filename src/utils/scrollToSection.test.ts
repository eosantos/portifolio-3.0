import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { scrollToSection } from './scrollToSection';
import { gsap } from 'gsap';

vi.mock('gsap', () => ({
  gsap: {
    registerPlugin: vi.fn(),
    to: vi.fn()
  }
}));

vi.mock('gsap/ScrollToPlugin', () => ({
  ScrollToPlugin: {}
}));

const gsapMock = vi.mocked(gsap, true);

describe('scrollToSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '<section id="sobre"></section>';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('smooth-scrolls with GSAP by default', () => {
    scrollToSection('sobre');

    expect(gsapMock.registerPlugin).toHaveBeenCalled();
    expect(gsapMock.to).toHaveBeenCalledWith(
      window,
      expect.objectContaining({
        duration: 0.8,
        scrollTo: expect.objectContaining({ offsetY: 72 })
      })
    );
  });

  it('targets the element matching the id', () => {
    scrollToSection('sobre');

    const call = vi.mocked(gsapMock.to).mock.calls[0][1] as {
      scrollTo: { y: unknown };
    };
    expect(call.scrollTo.y).toBe(document.getElementById('sobre'));
  });

  it('jumps instantly under reduced motion', () => {
    // NOTE: no vi.spyOn + mockRestore here — restoring corrupts the global
    // matchMedia mock from vitest.setup (non-configurable property).
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = (() =>
      ({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      }) as unknown as MediaQueryList) as typeof window.matchMedia;

    const scrollIntoViewSpy = vi.fn();
    document.getElementById('sobre')!.scrollIntoView = scrollIntoViewSpy;

    try {
      scrollToSection('sobre');

      expect(scrollIntoViewSpy).toHaveBeenCalled();
      expect(gsapMock.to).not.toHaveBeenCalled();
    } finally {
      window.matchMedia = originalMatchMedia;
    }
  });

  it('does nothing when the target does not exist', () => {
    expect(() => scrollToSection('inexistente')).not.toThrow();
    expect(gsapMock.to).not.toHaveBeenCalled();
  });
});
