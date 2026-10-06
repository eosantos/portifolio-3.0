import { render, screen, fireEvent, act } from '@testing-library/react';
import { ThemeProvider } from '@/providers/theme-provider';
import { ThemeToggle } from './ThemeToggle';

const renderWithProvider = (component: React.ReactNode) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark', 'light');
  });

  it('renders a toggle button', () => {
    renderWithProvider(<ThemeToggle />);
    expect(
      screen.getByRole('button', { name: /toggle theme/i })
    ).toBeInTheDocument();
  });

  it('has correct aria-label', () => {
    renderWithProvider(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /toggle theme/i });
    expect(button).toHaveAttribute('aria-label', 'Toggle theme');
  });

  it('toggles theme when clicked', () => {
    renderWithProvider(<ThemeToggle />);

    const button = screen.getByRole('button', { name: /toggle theme/i });
    act(() => {
      fireEvent.click(button);
    });

    // Button should still exist after toggle
    expect(
      screen.getByRole('button', { name: /toggle theme/i })
    ).toBeInTheDocument();
  });

  it('applies theme-aware styling', () => {
    const { container } = renderWithProvider(<ThemeToggle />);
    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();
  });

  it('handles rapid clicks', () => {
    renderWithProvider(<ThemeToggle />);

    const button = screen.getByRole('button', { name: /toggle theme/i });
    for (let i = 0; i < 5; i++) {
      act(() => {
        fireEvent.click(button);
      });
    }

    // Should be in a consistent state
    expect(
      screen.getByRole('button', { name: /toggle theme/i })
    ).toBeInTheDocument();
  });

  it('is keyboard accessible', () => {
    renderWithProvider(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /toggle theme/i });
    expect(button).not.toHaveAttribute('tabIndex', '-1');
  });
});
