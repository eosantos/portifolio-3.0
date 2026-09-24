import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@/providers/theme-provider';
import { LanguageProvider } from '@/providers/LanguageProvider';
import Sobre from '@/sections/Sobre';

class TriggeringObserver {
  callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }

  observe(target: Element) {
    this.callback(
      [{ isIntersecting: true, target } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver
    );
  }

  unobserve() {}
  disconnect() {}
}

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <ThemeProvider>
      <LanguageProvider>{component}</LanguageProvider>
    </ThemeProvider>
  );
};

describe('SobreSection', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark', 'light');
    vi.clearAllMocks();
    vi.stubGlobal('IntersectionObserver', TriggeringObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders without crashing', () => {
    renderWithProviders(<Sobre />);
    expect(screen.getByText('about.quote')).toBeInTheDocument();
  });

  it('displays pull-quote', () => {
    renderWithProviders(<Sobre />);
    expect(screen.getByText('about.quote')).toBeInTheDocument();
  });

  it('displays body paragraphs in order', () => {
    renderWithProviders(<Sobre />);
    const body1 = screen.getByText('about.body1');
    const body2 = screen.getByText('about.body2');
    expect(body1).toBeInTheDocument();
    expect(body2).toBeInTheDocument();
    expect(
      body1.compareDocumentPosition(body2) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });

  it('displays highlight tags', () => {
    renderWithProviders(<Sobre />);
    expect(screen.getByText('about.tag1')).toBeInTheDocument();
    expect(screen.getByText('about.tag2')).toBeInTheDocument();
    expect(screen.getByText('about.tag3')).toBeInTheDocument();
  });

  it('mentions companies as plain text, without logos', () => {
    const { container } = renderWithProviders(<Sobre />);
    expect(container.textContent).toContain('about.body1');
    const images = screen.getAllByRole('img');
    // Only the profile photo exists; no company logos
    expect(images).toHaveLength(1);
    expect(images[0]).toHaveAttribute('alt', 'Eduardo');
  });

  it('renders profile image', () => {
    renderWithProviders(<Sobre />);
    const image = screen.getByAltText('Eduardo');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/assets/sobre.svg');
  });

  it('reveals content when intersecting', () => {
    const { container } = renderWithProviders(<Sobre />);
    const section = container.querySelector('section#sobre');
    expect(section).toBeInTheDocument();
    // After the mocked intersection, content is visible (opacity 1)
    const quote = screen.getByText('about.quote');
    const reveal = quote.closest('div');
    expect(reveal).toHaveStyle({ opacity: '1' });
  });

  it('is accessible - section labelled by quote', () => {
    const { container } = renderWithProviders(<Sobre />);
    const section = container.querySelector('section#sobre');
    expect(section).toBeInTheDocument();
    expect(section?.querySelector('blockquote')).toBeInTheDocument();
  });

  it('shows content immediately under reduced motion', () => {
    // NOTE: do NOT use vi.spyOn + mockRestore on window.matchMedia here:
    // restoring corrupts the global mock from vitest.setup (non-configurable
    // property), making matchMedia() return undefined for later tests.
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = (() =>
      ({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      }) as unknown as MediaQueryList) as typeof window.matchMedia;

    try {
      renderWithProviders(<Sobre />);
      expect(screen.getByText('about.quote')).toBeInTheDocument();
    } finally {
      window.matchMedia = originalMatchMedia;
    }
  });

  it('does not throw when IntersectionObserver is unavailable', () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    expect(() => renderWithProviders(<Sobre />)).not.toThrow();
    expect(screen.getByText('about.quote')).toBeInTheDocument();
  });
});
