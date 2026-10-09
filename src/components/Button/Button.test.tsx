'use client';

import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { LanguageProvider } from '@/providers/LanguageProvider';
import { Button } from '@/components/Button';

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <ThemeProvider>
      <LanguageProvider>{component}</LanguageProvider>
    </ThemeProvider>
  );
};

describe('Button', () => {
  it('renderiza variante primary', () => {
    renderWithProviders(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button', { name: 'Primary' })).toBeInTheDocument();
  });

  it('renderiza variante secondary', () => {
    renderWithProviders(<Button variant="secondary">Secondary</Button>);
    expect(
      screen.getByRole('button', { name: 'Secondary' })
    ).toBeInTheDocument();
  });

  it('renderiza variante ghost', () => {
    renderWithProviders(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole('button', { name: 'Ghost' })).toBeInTheDocument();
  });

  it('loading desabilita e sinaliza aria-busy', () => {
    renderWithProviders(<Button loading>Loading</Button>);
    const btn = screen.getByRole('button', { name: 'Loading' });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-busy', 'true');
  });

  it('disabled não dispara onClick', () => {
    const onClick = vi.fn();
    renderWithProviders(
      <Button disabled onClick={onClick}>
        Disabled
      </Button>
    );
    const btn = screen.getByRole('button', { name: 'Disabled' });
    fireEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renderiza children customizados', () => {
    renderWithProviders(
      <Button>
        <span data-testid="custom">Custom</span>
      </Button>
    );
    expect(screen.getByTestId('custom')).toBeInTheDocument();
  });

  it('aplica fullWidth quando true', () => {
    renderWithProviders(<Button fullWidth>Full</Button>);
    const btn = screen.getByRole('button', { name: 'Full' });
    expect(btn).toHaveStyle({ width: '100%' });
  });
});
