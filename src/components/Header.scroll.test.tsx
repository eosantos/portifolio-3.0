/**
 * Regression test for the header scroll blur.
 *
 * Uses the REAL framer-motion (unmocked) to verify the full plumbing:
 * window scroll -> useScroll().scrollY -> useTransform derivations ->
 * inline style on the <header> element.
 *
 * jsdom note: document.scrollingElement is null in jsdom, which makes
 * framer-motion's useScroll() a silent no-op. We stub it to
 * document.documentElement (what real browsers return) so the chain
 * can be exercised. framer-motion reads element.scrollTop, NOT
 * window.scrollY, so scroll position is set on the element.
 */
import { fireEvent, render, act } from '@testing-library/react';
import { ThemeProvider } from '@/providers/theme-provider';
import { LanguageProvider } from '@/providers/LanguageProvider';
import Header from './Header';

vi.unmock('framer-motion');

const renderHeader = () => {
  return render(
    <ThemeProvider>
      <LanguageProvider>
        <Header />
      </LanguageProvider>
    </ThemeProvider>
  );
};

const scrollTo = async (value: number) => {
  await act(async () => {
    document.documentElement.scrollTop = value;
    fireEvent.scroll(window);
    await new Promise((resolve) => setTimeout(resolve, 100));
  });
};

describe('Header scroll blur (real framer-motion)', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark', 'light');
    vi.clearAllMocks();
    Object.defineProperty(document, 'scrollingElement', {
      value: document.documentElement,
      writable: true,
      configurable: true
    });
  });

  afterEach(() => {
    Object.defineProperty(document, 'scrollingElement', {
      value: null,
      writable: true,
      configurable: true
    });
  });

  it('starts transparent with no blur at the top', async () => {
    const { container } = renderHeader();
    await scrollTo(0);

    const header = container.querySelector('header') as HTMLElement;
    expect(header.style.backgroundColor).toContain('rgba(');
    expect(header.style.backgroundColor).toContain(', 0)');
    expect(header.style.backdropFilter).toBe('blur(0px)');
  });

  it('fades background in and increases blur after scrolling', async () => {
    const { container } = renderHeader();

    await scrollTo(250);

    const header = container.querySelector('header') as HTMLElement;
    // background must carry the CORRECT theme color channels (proves the
    // hex-parsing fix: "40, 42, 54" = #282a36, never "282, 36, undefined").
    // jsdom serializes alpha=1 as rgb(), which is correct CSSOM behavior.
    expect(header.style.backgroundColor).toContain('40, 42, 54');
    expect(header.style.backgroundColor).not.toContain('undefined');
    expect(header.style.backdropFilter).toBe('blur(16px)');
  });
});
