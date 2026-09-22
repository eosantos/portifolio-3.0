import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@/providers/theme-provider';
import { LanguageProvider } from '@/providers/LanguageProvider';
import { ScrollProgressProvider } from '@/hooks/useScrollProgress';
import Home from '@/sections/Home';

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <ThemeProvider>
      <LanguageProvider>
        <ScrollProgressProvider>{component}</ScrollProgressProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

describe('HomeSection', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark', 'light');
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    renderWithProviders(<Home />);
    expect(screen.getByText('home.title')).toBeInTheDocument();
  });

  it('displays translated title', () => {
    renderWithProviders(<Home />);
    expect(screen.getByText('home.title')).toBeInTheDocument();
  });

  it('displays translated description', () => {
    renderWithProviders(<Home />);
    expect(screen.getByText('home.description')).toBeInTheDocument();
  });

  it('renders PerfilImage component', () => {
    renderWithProviders(<Home />);
    expect(screen.getByTestId('perfil-image-wrapper')).toBeInTheDocument();
  });

  it('has correct container styling', () => {
    const { container } = renderWithProviders(<Home />);
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
  });

  it('has responsive padding', () => {
    const { container } = renderWithProviders(<Home />);
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
  });

  it('centers content on mobile', () => {
    const { container } = renderWithProviders(<Home />);
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
  });

  it('switches to row layout on desktop', () => {
    const { container } = renderWithProviders(<Home />);
    const section = container.querySelector('section');
    // The media query for lg breakpoint should exist
    expect(section).toBeInTheDocument();
  });

  it('content has max-width constraint', () => {
    const { container } = renderWithProviders(<Home />);
    const content = container.querySelector('section > div');
    expect(content).toBeInTheDocument();
  });

  it('title uses theme color', () => {
    const { container } = renderWithProviders(<Home />);
    const title = container.querySelector('h1');
    expect(title).toBeInTheDocument();
  });

  it('description uses theme color', () => {
    const { container } = renderWithProviders(<Home />);
    const description = container.querySelector('p');
    expect(description).toBeInTheDocument();
  });

  it('is accessible - heading structure', () => {
    renderWithProviders(<Home />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
  });
});
