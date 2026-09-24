import { render, screen, fireEvent, act } from '@testing-library/react';
import { ThemeProvider } from '@/providers/theme-provider';
import { LanguageProvider } from '@/providers/LanguageProvider';
import { ScrollProgressProvider } from '@/hooks/useScrollProgress';
import { scrollToSection } from '@/utils/scrollToSection';
import Home from '@/sections/Home';

vi.mock('@/utils/scrollToSection', () => ({
  scrollToSection: vi.fn()
}));

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
    expect(screen.getByText('home.eyebrow')).toBeInTheDocument();
  });

  it('displays eyebrow with name', () => {
    renderWithProviders(<Home />);
    expect(screen.getByText('home.eyebrow')).toBeInTheDocument();
  });

  it('displays display lines', () => {
    renderWithProviders(<Home />);
    expect(screen.getByText('home.displayA')).toBeInTheDocument();
    expect(screen.getByText('home.displayB')).toBeInTheDocument();
    expect(screen.getByText('home.displayC')).toBeInTheDocument();
  });

  it('displays headline and description', () => {
    renderWithProviders(<Home />);
    expect(screen.getByText('home.headline')).toBeInTheDocument();
    expect(screen.getByText('home.description')).toBeInTheDocument();
  });

  it('renders contact CTA linking to contato', () => {
    renderWithProviders(<Home />);
    const cta = screen.getByRole('link', { name: 'home.contactCta' });
    expect(cta).toBeInTheDocument();
    expect(cta).toHaveAttribute('href', '#contato');
  });

  it('renders skip link linking to sobre', () => {
    renderWithProviders(<Home />);
    const skip = screen.getByRole('link', { name: 'home.skipIntro' });
    expect(skip).toBeInTheDocument();
    expect(skip).toHaveAttribute('href', '#sobre');
  });

  it('smooth-scrolls when skip link clicked', () => {
    renderWithProviders(<Home />);
    const skip = screen.getByRole('link', { name: 'home.skipIntro' });
    act(() => {
      fireEvent.click(skip);
    });
    expect(scrollToSection).toHaveBeenCalledWith('sobre');
  });

  it('smooth-scrolls when contact CTA clicked', () => {
    renderWithProviders(<Home />);
    const cta = screen.getByRole('link', { name: 'home.contactCta' });
    act(() => {
      fireEvent.click(cta);
    });
    expect(scrollToSection).toHaveBeenCalledWith('contato');
  });

  it('has correct container styling', () => {
    const { container } = renderWithProviders(<Home />);
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
  });

  it('does not render profile image (typographic hero)', () => {
    renderWithProviders(<Home />);
    expect(
      screen.queryByTestId('perfil-image-wrapper')
    ).not.toBeInTheDocument();
  });

  it('is accessible - single h1 heading structure', () => {
    renderWithProviders(<Home />);
    const headings = screen.getAllByRole('heading', { level: 1 });
    expect(headings).toHaveLength(1);
  });

  it('renders status badge', () => {
    renderWithProviders(<Home />);
    expect(screen.getByText('home.statusBadge')).toBeInTheDocument();
  });

  it('renders quick highlights', () => {
    renderWithProviders(<Home />);
    expect(screen.getByText('home.highlight1')).toBeInTheDocument();
    expect(screen.getByText('home.highlight2')).toBeInTheDocument();
    expect(screen.getByText('home.highlight3')).toBeInTheDocument();
  });
});
