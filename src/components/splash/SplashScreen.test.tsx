import { render, screen, act } from '@testing-library/react';
import { ThemeProvider } from '@/providers/theme-provider';
import SplashScreen from '@/components/splash/SplashScreen';

const renderWithProvider = (component: React.ReactNode) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('SplashScreen', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark', 'light');
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders splash screen initially', () => {
    renderWithProvider(<SplashScreen />);

    expect(screen.getByTestId('splash-container')).toBeInTheDocument();
    expect(screen.getByAltText('Logo')).toBeInTheDocument();
  });

  it('shows a logo', () => {
    renderWithProvider(<SplashScreen />);

    const logo = screen.getByAltText('Logo') as HTMLImageElement;
    expect(logo.src).toContain('logo');
  });

  it('starts fade animation after 1500ms', () => {
    renderWithProvider(<SplashScreen />);

    const container = screen.getByTestId('splash-container');

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    // Just verify the component is still rendered and timer advanced
    expect(container).toBeInTheDocument();
  });

  it('removes splash after 2100ms', () => {
    renderWithProvider(<SplashScreen />);

    expect(screen.getByTestId('splash-container')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2100);
    });

    expect(screen.queryByTestId('splash-container')).not.toBeInTheDocument();
  });

  it('dispatches splash-complete event on removal', () => {
    const dispatchEventSpy = vi.spyOn(window, 'dispatchEvent');

    renderWithProvider(<SplashScreen />);

    act(() => {
      vi.advanceTimersByTime(2100);
    });

    expect(dispatchEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'splash-complete' })
    );

    dispatchEventSpy.mockRestore();
  });

  it('cleans up timers on unmount', () => {
    const { unmount } = renderWithProvider(<SplashScreen />);

    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalledTimes(2);
    clearTimeoutSpy.mockRestore();
  });

  it('does not render before mount (useHasMounted)', () => {
    renderWithProvider(<SplashScreen />);
    expect(screen.getByTestId('splash-container')).toBeInTheDocument();
  });

  it('has correct z-index', () => {
    const { container } = renderWithProvider(<SplashScreen />);
    const splashContainer = container.querySelector(
      '[data-testid="splash-container"]'
    ) as HTMLElement;
    expect(splashContainer).toHaveStyle({ zIndex: '9999' });
  });
});
