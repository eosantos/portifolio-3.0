import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@/providers/theme-provider';
import PerfilImage from './PerfilImage';

const renderWithProvider = (component: React.ReactNode) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('PerfilImage', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark', 'light');
  });

  it('renders without crashing', () => {
    renderWithProvider(<PerfilImage />);
    expect(screen.getByTestId('perfil-image-wrapper')).toBeInTheDocument();
  });

  it('applies correct background image', () => {
    const { container } = renderWithProvider(<PerfilImage />);
    const wrapper = container.querySelector(
      '[data-testid="perfil-image-wrapper"]'
    ) as HTMLElement;
    expect(wrapper).toHaveStyle({
      backgroundImage: expect.stringContaining('eu.svg')
    });
  });

  it('has correct border radius', () => {
    const { container } = renderWithProvider(<PerfilImage />);
    const wrapper = container.querySelector(
      '[data-testid="perfil-image-wrapper"]'
    ) as HTMLElement;
    expect(wrapper).toHaveStyle({ borderRadius: '12px' });
  });

  it('responsive width on mobile', () => {
    const { container } = renderWithProvider(<PerfilImage />);
    const wrapper = container.querySelector(
      '[data-testid="perfil-image-wrapper"]'
    ) as HTMLElement;
    expect(wrapper).toBeInTheDocument();
  });

  it('does not render img tag (uses background-image)', () => {
    renderWithProvider(<PerfilImage />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
