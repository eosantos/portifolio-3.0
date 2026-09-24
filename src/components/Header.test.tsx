import { render, screen, fireEvent, act } from '@testing-library/react';
import { ThemeProvider } from '@/providers/theme-provider';
import { LanguageProvider } from '@/providers/LanguageProvider';
import Header from './Header';

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <ThemeProvider>
      <LanguageProvider>{component}</LanguageProvider>
    </ThemeProvider>
  );
};

describe('Header', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark', 'light');
    vi.clearAllMocks();
  });

  it('renders brand lockup with icon and wordmark', () => {
    renderWithProviders(<Header />);

    const brand = screen.getByRole('link', { name: 'nav.home' });
    expect(brand).toBeInTheDocument();
    expect(brand).toHaveAttribute('href', '/');
    expect(brand).toHaveTextContent('Eduardo Oliveira');
    // Icon is decorative inside a labelled link
    expect(brand.querySelector('img')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    renderWithProviders(<Header />);

    expect(screen.getByText('nav.about')).toBeInTheDocument();
    expect(screen.getByText('nav.projects')).toBeInTheDocument();
    expect(screen.getByText('nav.contact')).toBeInTheDocument();
  });

  it('renders textual language toggle without flags', () => {
    renderWithProviders(<Header />);

    expect(screen.getByRole('button', { name: 'PT' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'EN' })).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('marks active language with aria-pressed', () => {
    renderWithProviders(<Header />);

    expect(screen.getByRole('button', { name: 'PT' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    expect(screen.getByRole('button', { name: 'EN' })).toHaveAttribute(
      'aria-pressed',
      'false'
    );
  });

  it('toggles language when EN button clicked', () => {
    renderWithProviders(<Header />);

    const enButton = screen.getByRole('button', { name: 'EN' });
    act(() => {
      fireEvent.click(enButton);
    });

    expect(screen.getByRole('button', { name: 'EN' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
  });

  it('does not toggle when active language clicked', () => {
    renderWithProviders(<Header />);

    const ptButton = screen.getByRole('button', { name: 'PT' });
    act(() => {
      fireEvent.click(ptButton);
    });

    expect(screen.getByRole('button', { name: 'PT' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
  });

  it('renders theme toggle', () => {
    renderWithProviders(<Header />);

    expect(
      screen.getByRole('button', { name: /toggle theme/i })
    ).toBeInTheDocument();
  });

  it('renders mobile menu button on small screens', () => {
    renderWithProviders(<Header />);

    expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
  });

  it('toggles mobile menu when menu button clicked', () => {
    renderWithProviders(<Header />);

    const menuButton = screen.getByTestId('menu-icon').closest('button');
    expect(menuButton).toBeInTheDocument();

    act(() => {
      fireEvent.click(menuButton!);
    });

    expect(screen.getByTestId('close-icon')).toBeInTheDocument();
  });

  it('closes mobile menu when link clicked', () => {
    renderWithProviders(<Header />);

    const menuButton = screen.getByTestId('menu-icon').closest('button');
    act(() => {
      fireEvent.click(menuButton!);
    });

    expect(screen.getByTestId('close-icon')).toBeInTheDocument();

    const aboutLink = screen.getByText('nav.about');
    act(() => {
      fireEvent.click(aboutLink);
    });
  });

  it('has fixed positioning', () => {
    const { container } = renderWithProviders(<Header />);
    const header = container.querySelector('header');
    expect(header).toBeInTheDocument();
  });

  it('has theme-aware background and border', () => {
    const { container } = renderWithProviders(<Header />);
    const header = container.querySelector('header');
    expect(header).toBeInTheDocument();
  });

  it('nav links have hover effect', () => {
    const { container } = renderWithProviders(<Header />);
    const navLink = container.querySelector('nav a');
    expect(navLink).toBeInTheDocument();
  });

  it('is keyboard accessible', () => {
    renderWithProviders(<Header />);

    const navLinks = screen.getAllByRole('link');
    navLinks.forEach((link) => {
      expect(link).not.toHaveAttribute('tabIndex', '-1');
    });

    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).not.toHaveAttribute('tabIndex', '-1');
    });
  });

  it('enters compact mode after scrolling past threshold', () => {
    renderWithProviders(<Header />);

    act(() => {
      Object.defineProperty(window, 'scrollY', {
        value: 200,
        writable: true,
        configurable: true
      });
      fireEvent.scroll(window);
    });

    const brand = screen.getByRole('link', { name: 'nav.home' });
    expect(brand.querySelector('img')).toBeInTheDocument();
  });

  it('shows sliding indicator on nav hover', () => {
    const { container } = renderWithProviders(<Header />);
    const aboutLink = screen.getByText('nav.about');

    act(() => {
      fireEvent.mouseEnter(aboutLink);
    });

    const nav = container.querySelector('nav');
    expect(nav).toBeInTheDocument();
  });
});
