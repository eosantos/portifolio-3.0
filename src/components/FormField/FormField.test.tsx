'use client';

import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { LanguageProvider } from '@/providers/LanguageProvider';
import { TextInput, TextArea } from '@/components/FormField';

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <ThemeProvider>
      <LanguageProvider>{component}</LanguageProvider>
    </ThemeProvider>
  );
};

describe('FormField - TextInput', () => {
  it('label associado ao campo via htmlFor/id', () => {
    renderWithProviders(
      <TextInput id="test" label="Nome" placeholder="Seu nome" />
    );
    const label = screen.getByLabelText('Nome');
    expect(label).toHaveAttribute('id', 'test');
    expect(screen.getByText('Nome')).toBeInTheDocument();
  });

  it('aria-invalid e aria-describedby quando há erro', () => {
    renderWithProviders(
      <TextInput
        id="test"
        label="Nome"
        placeholder="Seu nome"
        error="Nome é obrigatório"
      />
    );
    const input = screen.getByLabelText('Nome');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'test-error');
    expect(screen.getByRole('alert')).toHaveTextContent('Nome é obrigatório');
  });

  it('texto de erro visível', () => {
    renderWithProviders(
      <TextInput
        id="test"
        label="Nome"
        placeholder="Seu nome"
        error="Nome é obrigatório"
      />
    );
    expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument();
  });

  it('helperText sem erro', () => {
    renderWithProviders(
      <TextInput
        id="test"
        label="Nome"
        placeholder="Seu nome"
        helperText="Ajuda"
      />
    );
    const input = screen.getByLabelText('Nome');
    expect(input).toHaveAttribute('aria-describedby', 'test-helper');
    expect(screen.getByText('Ajuda')).toBeInTheDocument();
  });

  it('helperText não aparece quando há erro', () => {
    renderWithProviders(
      <TextInput
        id="test"
        label="Nome"
        placeholder="Seu nome"
        error="Erro"
        helperText="Ajuda"
      />
    );
    expect(screen.queryByText('Ajuda')).not.toBeInTheDocument();
    expect(screen.getByText('Erro')).toBeInTheDocument();
  });
});

describe('FormField - TextArea', () => {
  it('label associado ao campo via htmlFor/id', () => {
    renderWithProviders(
      <TextArea id="msg" label="Mensagem" placeholder="Sua mensagem" />
    );
    const label = screen.getByLabelText('Mensagem');
    expect(label).toHaveAttribute('id', 'msg');
    expect(screen.getByText('Mensagem')).toBeInTheDocument();
  });

  it('aria-invalid e aria-describedby quando há erro', () => {
    renderWithProviders(
      <TextArea
        id="msg"
        label="Mensagem"
        placeholder="Sua mensagem"
        error="Mensagem muito curta"
      />
    );
    const textarea = screen.getByLabelText('Mensagem');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(textarea).toHaveAttribute('aria-describedby', 'msg-error');
    expect(screen.getByRole('alert')).toHaveTextContent('Mensagem muito curta');
  });

  it('texto de erro visível', () => {
    renderWithProviders(
      <TextArea
        id="msg"
        label="Mensagem"
        placeholder="Sua mensagem"
        error="Mensagem muito curta"
      />
    );
    expect(screen.getByText('Mensagem muito curta')).toBeInTheDocument();
  });
});
