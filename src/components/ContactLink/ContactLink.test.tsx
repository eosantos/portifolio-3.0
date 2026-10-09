'use client';

import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { LanguageProvider } from '@/providers/LanguageProvider';
import { ContactLink } from '@/components/ContactLink';

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <ThemeProvider>
      <LanguageProvider>{component}</LanguageProvider>
    </ThemeProvider>
  );
};

describe('ContactLink', () => {
  it('renderiza tipo email com href correto', () => {
    renderWithProviders(
      <ContactLink type="email" href="mailto:test@test.com">
        test@test.com
      </ContactLink>
    );
    const link = screen.getByRole('link', { name: 'test@test.com' });
    expect(link).toHaveAttribute('href', 'mailto:test@test.com');
    expect(screen.getByTestId('mail-icon')).toBeInTheDocument();
  });

  it('renderiza tipo github com href correto', () => {
    renderWithProviders(
      <ContactLink type="github" href="https://github.com/user">
        github.com/user
      </ContactLink>
    );
    const link = screen.getByRole('link', { name: 'github.com/user' });
    expect(link).toHaveAttribute('href', 'https://github.com/user');
    expect(screen.getByTestId('github-icon')).toBeInTheDocument();
  });

  it('renderiza tipo linkedin com href correto', () => {
    renderWithProviders(
      <ContactLink type="linkedin" href="https://linkedin.com/in/user">
        linkedin.com/in/user
      </ContactLink>
    );
    const link = screen.getByRole('link', { name: 'linkedin.com/in/user' });
    expect(link).toHaveAttribute('href', 'https://linkedin.com/in/user');
    expect(screen.getByTestId('linkedin-icon')).toBeInTheDocument();
  });

  it('abre em nova aba com rel noopener noreferrer', () => {
    renderWithProviders(
      <ContactLink
        type="github"
        href="https://github.com/user"
        target="_blank"
        rel="noopener noreferrer"
      >
        github.com/user
      </ContactLink>
    );
    const link = screen.getByRole('link', { name: 'github.com/user' });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
