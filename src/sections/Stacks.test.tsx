import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@/providers/theme-provider';
import { LanguageProvider } from '@/providers/LanguageProvider';
import Stacks from '@/sections/Stacks';

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

describe('StacksSection', () => {
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
    renderWithProviders(<Stacks />);
    expect(screen.getByText('stacks.label')).toBeInTheDocument();
  });

  it('displays section eyebrow', () => {
    renderWithProviders(<Stacks />);
    expect(screen.getByText('stacks.label')).toBeInTheDocument();
  });

  it('displays category navigation tabs', () => {
    renderWithProviders(<Stacks />);
    expect(
      screen.getByRole('tab', { name: 'stacks.categories.frontend' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('tab', { name: 'stacks.categories.mobile' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('tab', { name: 'stacks.categories.styling' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('tab', { name: 'stacks.categories.state' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('tab', { name: 'stacks.categories.backend' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('tab', { name: 'stacks.categories.product' })
    ).toBeInTheDocument();
  });

  it('shows frontend technologies by default', () => {
    renderWithProviders(<Stacks />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Next.js')).toBeInTheDocument();
    expect(screen.getByText('Angular')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
  });

  it('switches category when tab is clicked', () => {
    renderWithProviders(<Stacks />);

    // Initially frontend is active
    expect(screen.getByText('React')).toBeInTheDocument();

    // Click on mobile tab
    const mobileTab = screen.getByRole('tab', {
      name: 'stacks.categories.mobile'
    });
    fireEvent.click(mobileTab);

    // Mobile category should be active
    expect(screen.getByText('React Native')).toBeInTheDocument();
  });

  it('switches category with keyboard arrows', () => {
    renderWithProviders(<Stacks />);

    const section = screen.getByRole('region', { name: 'stacks.label' });

    // Press ArrowRight to go to next category (mobile)
    fireEvent.keyDown(section, { key: 'ArrowRight' });
    expect(screen.getByText('React Native')).toBeInTheDocument();

    // Press ArrowRight to go to next category (styling)
    fireEvent.keyDown(section, { key: 'ArrowRight' });
    expect(screen.getByText('Styled Components')).toBeInTheDocument();

    // Press ArrowLeft to go back to mobile
    fireEvent.keyDown(section, { key: 'ArrowLeft' });
    expect(screen.getByText('React Native')).toBeInTheDocument();
  });

  it('displays all frontend technologies', () => {
    renderWithProviders(<Stacks />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Next.js')).toBeInTheDocument();
    expect(screen.getByText('Angular')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
  });

  it('displays mobile technologies when active', () => {
    renderWithProviders(<Stacks />);
    const mobileTab = screen.getByRole('tab', {
      name: 'stacks.categories.mobile'
    });
    fireEvent.click(mobileTab);
    expect(screen.getByText('React Native')).toBeInTheDocument();
  });

  it('displays styling technologies when active', () => {
    renderWithProviders(<Stacks />);
    const stylingTab = screen.getByRole('tab', {
      name: 'stacks.categories.styling'
    });
    fireEvent.click(stylingTab);
    expect(screen.getByText('Styled Components')).toBeInTheDocument();
    expect(screen.getByText('Sass')).toBeInTheDocument();
    expect(screen.getByText('TailwindCSS')).toBeInTheDocument();
  });

  it('displays state management technologies when active', () => {
    renderWithProviders(<Stacks />);
    const stateTab = screen.getByRole('tab', {
      name: 'stacks.categories.state'
    });
    fireEvent.click(stateTab);
    expect(screen.getByText('Redux')).toBeInTheDocument();
    expect(screen.getByText('Hookstate')).toBeInTheDocument();
  });

  it('displays backend technologies when active', () => {
    renderWithProviders(<Stacks />);
    const backendTab = screen.getByRole('tab', {
      name: 'stacks.categories.backend'
    });
    fireEvent.click(backendTab);
    expect(screen.getByText('Node.js')).toBeInTheDocument();
    expect(screen.getByText('MongoDB')).toBeInTheDocument();
    expect(screen.getByText('PostgreSQL')).toBeInTheDocument();
    expect(screen.getByText('PHP')).toBeInTheDocument();
    expect(screen.getByText('Firebase')).toBeInTheDocument();
    expect(screen.getByText('GraphQL')).toBeInTheDocument();
    expect(screen.getByText('REST APIs')).toBeInTheDocument();
  });

  it('displays product & UX technologies when active', () => {
    renderWithProviders(<Stacks />);
    const productTab = screen.getByRole('tab', {
      name: 'stacks.categories.product'
    });
    fireEvent.click(productTab);
    expect(screen.getByText('Design Systems')).toBeInTheDocument();
    expect(screen.getByText('Acessibilidade')).toBeInTheDocument();
    expect(screen.getByText('Figma')).toBeInTheDocument();
  });

  it('reveals content when intersecting', () => {
    const { container } = renderWithProviders(<Stacks />);
    const section = container.querySelector('section#stacks');
    expect(section).toBeInTheDocument();
    const eyebrow = screen.getByText('stacks.label');
    const reveal = eyebrow.closest('div');
    expect(reveal).toHaveStyle({ opacity: '1' });
  });

  it('is accessible - section labelled by eyebrow', () => {
    const { container } = renderWithProviders(<Stacks />);
    const section = container.querySelector('section#stacks');
    expect(section).toBeInTheDocument();
    expect(section?.getAttribute('aria-labelledby')).toBe('stacks-eyebrow');
  });

  it('shows content immediately under reduced motion', () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = (() =>
      ({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      }) as unknown as MediaQueryList) as typeof window.matchMedia;

    try {
      renderWithProviders(<Stacks />);
      expect(screen.getByText('stacks.label')).toBeInTheDocument();
    } finally {
      window.matchMedia = originalMatchMedia;
    }
  });

  it('does not throw when IntersectionObserver is unavailable', () => {
    vi.stubGlobal('IntersectionObserver', undefined as never);
    expect(() => renderWithProviders(<Stacks />)).not.toThrow();
    expect(screen.getByText('stacks.label')).toBeInTheDocument();
  });
});
