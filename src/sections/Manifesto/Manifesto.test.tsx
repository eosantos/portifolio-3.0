import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@/providers/theme-provider';
import { LanguageProvider } from '@/providers/LanguageProvider';
import Manifesto from '@/sections/Manifesto';

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

describe('ManifestoSection', () => {
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
    renderWithProviders(<Manifesto />);
    expect(screen.getByText('identity.code')).toBeInTheDocument();
  });

  it('renders CODE → CREATE → INSPIRE as one sequence', () => {
    renderWithProviders(<Manifesto />);
    const code = screen.getByText('identity.code');
    const create = screen.getByText('identity.create');
    const inspire = screen.getByText('identity.inspire');
    expect(code).toBeInTheDocument();
    expect(create).toBeInTheDocument();
    expect(inspire).toBeInTheDocument();
    expect(
      code.compareDocumentPosition(create) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    expect(
      create.compareDocumentPosition(inspire) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });

  it('renders supporting tagline', () => {
    renderWithProviders(<Manifesto />);
    expect(screen.getByText('manifesto.tagline')).toBeInTheDocument();
  });

  it('reveals words on intersection', () => {
    renderWithProviders(<Manifesto />);
    const code = screen.getByText('identity.code');
    const reveal = code.closest('div');
    expect(reveal).toHaveStyle({ opacity: '1' });
  });

  it('has accessible section label', () => {
    const { container } = renderWithProviders(<Manifesto />);
    const section = container.querySelector('section#manifesto');
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute('aria-label', 'manifesto.label');
  });
});
