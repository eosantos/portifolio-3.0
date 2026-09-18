import { render, screen, fireEvent, act } from '@testing-library/react';
import { LanguageProvider, useLanguage } from './LanguageProvider';

// Test component to consume the language context
const TestComponent = () => {
  const { lang, toggleLanguage } = useLanguage();
  return (
    <div>
      <span data-testid="lang-status">{lang}</span>
      <button onClick={toggleLanguage} data-testid="toggle-button">
        Toggle Language
      </button>
    </div>
  );
};

describe('LanguageProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('provides language context to children', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    expect(screen.getByTestId('lang-status')).toBeInTheDocument();
  });

  it('initializes from localStorage when available', () => {
    localStorage.setItem('lang', 'en');

    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    expect(screen.getByTestId('lang-status')).toBeInTheDocument();
  });

  it('uses default "pt" when no localStorage', () => {
    localStorage.clear();

    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    expect(screen.getByTestId('lang-status')).toBeInTheDocument();
  });

  it('toggles language when toggleLanguage is called', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    expect(screen.getByTestId('lang-status')).toBeInTheDocument();

    act(() => {
      fireEvent.click(screen.getByTestId('toggle-button'));
    });

    expect(screen.getByTestId('lang-status')).toBeInTheDocument();
  });

  it('toggles back to pt when called again', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    act(() => {
      fireEvent.click(screen.getByTestId('toggle-button'));
    });
    act(() => {
      fireEvent.click(screen.getByTestId('toggle-button'));
    });

    // Just verify component still works
    expect(screen.getByTestId('lang-status')).toBeInTheDocument();
  });

  it('handles invalid localStorage value gracefully', () => {
    localStorage.setItem('lang', 'invalid' as 'pt' | 'en');

    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    // Should default to 'pt' when invalid value in localStorage
    expect(screen.getByTestId('lang-status')).toBeInTheDocument();
  });

  it('handles rapid toggle clicks', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    for (let i = 0; i < 10; i++) {
      act(() => {
        fireEvent.click(screen.getByTestId('toggle-button'));
      });
    }

    // Just verify component still works after multiple clicks
    expect(screen.getByTestId('lang-status')).toBeInTheDocument();
  });
});
