import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@/providers/theme-provider';
import { LanguageProvider } from '@/providers/LanguageProvider';
import Identity from '@/sections/Identity';

vi.mock('gsap', () => {
  const chainable = () => {
    const tl: Record<string, unknown> = {};
    tl.to = vi.fn(() => tl);
    tl.fromTo = vi.fn(() => tl);
    tl.add = vi.fn(() => tl);
    tl.set = vi.fn(() => tl);
    return tl;
  };
  return {
    gsap: {
      context: vi.fn(() => ({ revert: vi.fn() })),
      timeline: vi.fn(() => chainable()),
      set: vi.fn(),
      to: vi.fn(),
      fromTo: vi.fn(),
      registerPlugin: vi.fn(),
      matchMedia: vi.fn(() => ({ add: vi.fn(), revert: vi.fn() }))
    }
  };
});

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    create: vi.fn(),
    refresh: vi.fn(),
    getAll: vi.fn(() => [])
  }
}));

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <ThemeProvider>
      <LanguageProvider>{component}</LanguageProvider>
    </ThemeProvider>
  );
};

describe('IdentitySection', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark', 'light');
    vi.clearAllMocks();
  });

  it('renders without crashing or console errors', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { unmount } = renderWithProviders(<Identity />);
    expect(screen.getByText('identity.code')).toBeInTheDocument();
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
    unmount();
  });

  it('renders the full CODE → CREATE → INSPIRE sequence', () => {
    renderWithProviders(<Identity />);
    expect(screen.getByText('identity.code')).toBeInTheDocument();
    expect(screen.getByText('identity.create')).toBeInTheDocument();
    expect(screen.getByText('identity.inspire')).toBeInTheDocument();
  });

  it('renders transition content to projects', () => {
    renderWithProviders(<Identity />);
    expect(screen.getByText('identity.transitionTitle')).toBeInTheDocument();
    expect(screen.getByText('identity.transitionText')).toBeInTheDocument();
  });

  it('renders progress indicator', () => {
    renderWithProviders(<Identity />);
    expect(screen.getByText('identity.scroll')).toBeInTheDocument();
  });

  it('unmounts cleanly (ScrollTrigger cleanup)', () => {
    const { unmount } = renderWithProviders(<Identity />);
    expect(() => unmount()).not.toThrow();
  });
});
