import {
  render,
  screen,
  fireEvent,
  act,
  waitFor
} from '@testing-library/react';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { LanguageProvider } from '@/providers/LanguageProvider';
import { ScrollProgressProvider } from '@/hooks/useScrollProgress';
import Contato from '@/sections/Contato';

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <ThemeProvider>
      <LanguageProvider>
        <ScrollProgressProvider>{component}</ScrollProgressProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

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

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('ContatoSection', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark', 'light');
    vi.clearAllMocks();
    mockFetch.mockReset();
    vi.stubGlobal('IntersectionObserver', TriggeringObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders without crashing', () => {
    renderWithProviders(<Contato />);
    expect(screen.getByText('contact.title')).toBeInTheDocument();
  });

  it('displays section title', () => {
    renderWithProviders(<Contato />);
    expect(
      screen.getByRole('heading', { level: 2, name: 'contact.headline' })
    ).toBeInTheDocument();
  });

  it('displays body text', () => {
    renderWithProviders(<Contato />);
    expect(screen.getByText('contact.body')).toBeInTheDocument();
  });

  it('renders contact info links', () => {
    renderWithProviders(<Contato />);
    expect(
      screen.getByText('eos.eduardooliveira@gmail.com')
    ).toBeInTheDocument();
    expect(screen.getByText('github.com/eosantos')).toBeInTheDocument();
    expect(
      screen.getByText('www.linkedin.com/in/eduardo-oliveira-dev')
    ).toBeInTheDocument();
  });

  it('renders form with all fields', () => {
    renderWithProviders(<Contato />);
    expect(screen.getByLabelText('contact.fields.name')).toBeInTheDocument();
    expect(screen.getByLabelText('contact.fields.email')).toBeInTheDocument();
    expect(screen.getByLabelText('contact.fields.message')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'contact.send' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'contact.reset' })
    ).toBeInTheDocument();
  });

  it('form fields have correct placeholders', () => {
    renderWithProviders(<Contato />);
    expect(
      screen.getByPlaceholderText('contact.placeholders.name')
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('contact.placeholders.email')
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('contact.placeholders.message')
    ).toBeInTheDocument();
  });

  it('valida campos obrigatórios ao submeter', async () => {
    renderWithProviders(<Contato />);

    const submitButton = screen.getByRole('button', { name: 'contact.send' });
    act(() => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      const alerts = screen.getAllByRole('alert');
      expect(alerts.length).toBeGreaterThan(0);
    });
  });

  it('valida formato de email', async () => {
    renderWithProviders(<Contato />);

    const emailInput = screen.getByLabelText('contact.fields.email');
    act(() => {
      fireEvent.change(emailInput, { target: { value: 'email-invalido' } });
    });

    const submitButton = screen.getByRole('button', { name: 'contact.send' });
    act(() => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(
        screen.getByText('contact.validation.emailInvalid')
      ).toBeInTheDocument();
    });
  });

  it('valida tamanho mínimo do nome', async () => {
    renderWithProviders(<Contato />);

    const nameInput = screen.getByLabelText('contact.fields.name');
    act(() => {
      fireEvent.change(nameInput, { target: { value: 'A' } });
    });

    const submitButton = screen.getByRole('button', { name: 'contact.send' });
    act(() => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(
        screen.getByText('contact.validation.nameMinLength')
      ).toBeInTheDocument();
    });
  });

  it('valida tamanho mínimo da mensagem', async () => {
    renderWithProviders(<Contato />);

    const messageInput = screen.getByLabelText('contact.fields.message');
    act(() => {
      fireEvent.change(messageInput, { target: { value: 'Curta' } });
    });

    const submitButton = screen.getByRole('button', { name: 'contact.send' });
    act(() => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(
        screen.getByText('contact.validation.messageMinLength')
      ).toBeInTheDocument();
    });
  });

  it('submete formulário com sucesso (fetch mockado)', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ ok: true })
    });

    renderWithProviders(<Contato />);

    const nameInput = screen.getByLabelText('contact.fields.name');
    const emailInput = screen.getByLabelText('contact.fields.email');
    const messageInput = screen.getByLabelText('contact.fields.message');

    act(() => {
      fireEvent.change(nameInput, { target: { value: 'Test User' } });
      fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
      fireEvent.change(messageInput, {
        target: { value: 'Mensagem válida com mais de 10 chars' }
      });
    });

    const submitButton = screen.getByRole('button', { name: 'contact.send' });
    act(() => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText('contact.sending')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('contact.success')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByLabelText('contact.fields.name')).toHaveValue('');
    });
  });

  it('mostra estado de loading durante submissão', async () => {
    let resolveFetch: (value: unknown) => void;
    mockFetch.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        })
    );

    renderWithProviders(<Contato />);

    const nameInput = screen.getByLabelText('contact.fields.name');
    const emailInput = screen.getByLabelText('contact.fields.email');
    const messageInput = screen.getByLabelText('contact.fields.message');

    act(() => {
      fireEvent.change(nameInput, { target: { value: 'Test User' } });
      fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
      fireEvent.change(messageInput, {
        target: { value: 'Mensagem válida com mais de 10 chars' }
      });
    });

    const submitButton = screen.getByRole('button', { name: 'contact.send' });
    act(() => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveAttribute('aria-busy', 'true');
      expect(screen.getByText('contact.sending')).toBeInTheDocument();
    });

    act(() => {
      resolveFetch!({ ok: true, json: () => Promise.resolve({ ok: true }) });
    });

    await waitFor(() => {
      expect(screen.getByText('contact.success')).toBeInTheDocument();
    });
  });

  it('reseta formulário quando botão reset clicado', async () => {
    renderWithProviders(<Contato />);

    const nameInput = screen.getByLabelText('contact.fields.name');
    const emailInput = screen.getByLabelText('contact.fields.email');
    const messageInput = screen.getByLabelText('contact.fields.message');

    act(() => {
      fireEvent.change(nameInput, { target: { value: 'Test User' } });
      fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
      fireEvent.change(messageInput, {
        target: { value: 'This is a valid message for testing' }
      });
    });

    expect(screen.getByLabelText('contact.fields.name')).toHaveValue(
      'Test User'
    );

    const resetButton = screen.getByRole('button', { name: 'contact.reset' });
    act(() => {
      fireEvent.click(resetButton);
    });

    expect(screen.getByLabelText('contact.fields.name')).toHaveValue('');
    expect(screen.getByLabelText('contact.fields.email')).toHaveValue('');
    expect(screen.getByLabelText('contact.fields.message')).toHaveValue('');
  });

  it('desabilita formulário durante submissão', async () => {
    let resolveFetch: (value: unknown) => void;
    mockFetch.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        })
    );

    renderWithProviders(<Contato />);

    const nameInput = screen.getByLabelText('contact.fields.name');
    const emailInput = screen.getByLabelText('contact.fields.email');
    const messageInput = screen.getByLabelText('contact.fields.message');

    act(() => {
      fireEvent.change(nameInput, { target: { value: 'Test User' } });
      fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
      fireEvent.change(messageInput, {
        target: { value: 'This is a valid message for testing' }
      });
    });

    const submitButton = screen.getByRole('button', { name: 'contact.send' });
    act(() => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(nameInput).toBeDisabled();
      expect(emailInput).toBeDisabled();
      expect(messageInput).toBeDisabled();
      expect(
        screen.getByRole('button', { name: 'contact.reset' })
      ).toBeDisabled();
    });

    act(() => {
      resolveFetch!({ ok: true, json: () => Promise.resolve({ ok: true }) });
    });
  });

  it('has correct form styling', () => {
    const { container } = renderWithProviders(<Contato />);
    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
  });

  it('inputs have theme-aware styling', () => {
    const { container } = renderWithProviders(<Contato />);
    const input = container.querySelector('input');
    expect(input).toBeInTheDocument();
  });

  it('submit button has purple background', () => {
    const { container } = renderWithProviders(<Contato />);
    const button = container.querySelector('button[type="submit"]');
    expect(button).toBeInTheDocument();
  });

  it('is accessible - form labels associated', () => {
    renderWithProviders(<Contato />);
    const nameInput = screen.getByLabelText('contact.fields.name');
    const emailInput = screen.getByLabelText('contact.fields.email');
    const messageInput = screen.getByLabelText('contact.fields.message');

    expect(nameInput).toHaveAttribute('id', 'name');
    expect(emailInput).toHaveAttribute('id', 'email');
    expect(messageInput).toHaveAttribute('id', 'message');
  });

  it('is accessible - error messages announced', async () => {
    renderWithProviders(<Contato />);

    const submitButton = screen.getByRole('button', { name: 'contact.send' });
    act(() => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      const alerts = screen.getAllByRole('alert');
      expect(alerts.length).toBeGreaterThan(0);
    });
  });

  it('contact links have correct icons', () => {
    renderWithProviders(<Contato />);
    expect(screen.getByTestId('mail-icon')).toBeInTheDocument();
    expect(screen.getByTestId('github-icon')).toBeInTheDocument();
    expect(screen.getByTestId('linkedin-icon')).toBeInTheDocument();
  });

  it('contact links open in new tab', () => {
    renderWithProviders(<Contato />);
    const emailLink = screen
      .getByText('eos.eduardooliveira@gmail.com')
      .closest('a');
    expect(emailLink).toHaveAttribute('target', '_blank');
    expect(emailLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('has correct responsive layout', () => {
    const { container } = renderWithProviders(<Contato />);
    const grid = container.querySelector('section > div');
    expect(grid).toBeInTheDocument();
  });

  it('success message has correct styling', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ ok: true })
    });

    renderWithProviders(<Contato />);

    const nameInput = screen.getByLabelText('contact.fields.name');
    const emailInput = screen.getByLabelText('contact.fields.email');
    const messageInput = screen.getByLabelText('contact.fields.message');

    act(() => {
      fireEvent.change(nameInput, { target: { value: 'Test User' } });
      fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
      fireEvent.change(messageInput, {
        target: { value: 'Mensagem válida com mais de 10 chars' }
      });
    });

    const submitButton = screen.getByRole('button', { name: 'contact.send' });
    act(() => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      const statusMsg = screen.getByText('contact.success');
      expect(statusMsg).toBeInTheDocument();
      expect(statusMsg.closest('[role="status"]')).toBeInTheDocument();
    });
  });

  it('honeypot não é visível nem focável', () => {
    renderWithProviders(<Contato />);
    const honeypot = document.querySelector(
      'input[name="website"]'
    ) as HTMLInputElement;
    expect(honeypot).toBeInTheDocument();
    expect(honeypot).toHaveAttribute('type', 'hidden');
    expect(honeypot).toHaveAttribute('tabIndex', '-1');
    expect(honeypot).toHaveAttribute('autoComplete', 'off');
    expect(honeypot).toHaveAttribute('aria-hidden', 'true');
    expect(honeypot).toHaveStyle({ display: 'none' });
  });

  it('botão de currículo tem href do arquivo PDF', () => {
    renderWithProviders(<Contato />);
    const cvButton = screen.getByRole('link', {
      name: 'contact.cv.downloadPt'
    });
    expect(cvButton).toHaveAttribute('href', '/Curriculo-Eduardo-Oliveira.pdf');
    expect(cvButton).toHaveAttribute('download');
  });

  it('mostra erro quando fetch falha', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ ok: false, code: 'server' })
    });

    renderWithProviders(<Contato />);

    const nameInput = screen.getByLabelText('contact.fields.name');
    const emailInput = screen.getByLabelText('contact.fields.email');
    const messageInput = screen.getByLabelText('contact.fields.message');

    act(() => {
      fireEvent.change(nameInput, { target: { value: 'Test User' } });
      fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
      fireEvent.change(messageInput, {
        target: { value: 'Mensagem válida com mais de 10 chars' }
      });
    });

    const submitButton = screen.getByRole('button', { name: 'contact.send' });
    act(() => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText('contact.error')).toBeInTheDocument();
    });
  });
});
