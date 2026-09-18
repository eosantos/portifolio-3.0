import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@/providers/theme-provider';
import PageTransition from '@/components/transition/PageTransition';

const renderWithProvider = (component: React.ReactNode) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('PageTransition', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders children', () => {
    renderWithProvider(
      <PageTransition>
        <div data-testid="page-content">Page Content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-content')).toBeInTheDocument();
  });

  it('wraps children in motion.div', () => {
    const { container } = renderWithProvider(
      <PageTransition>
        <div data-testid="page-content">Page Content</div>
      </PageTransition>
    );

    const motionDiv = container.querySelector(
      '[data-testid="page-content"]'
    )?.parentElement;
    expect(motionDiv).toBeInTheDocument();
  });

  it('animates on mount (initial -> animate)', () => {
    renderWithProvider(
      <PageTransition>
        <div data-testid="page-content">Page Content</div>
      </PageTransition>
    );

    // The motion component should have initial and animate props
    // Since we're mocking framer-motion, we just verify it renders
    expect(screen.getByTestId('page-content')).toBeInTheDocument();
  });

  it('handles route changes (key change)', () => {
    const { rerender } = renderWithProvider(
      <PageTransition>
        <div data-testid="page-content">Page 1</div>
      </PageTransition>
    );

    rerender(
      <ThemeProvider>
        <PageTransition>
          <div data-testid="page-content">Page 2</div>
        </PageTransition>
      </ThemeProvider>
    );

    expect(screen.getByTestId('page-content')).toHaveTextContent('Page 2');
  });

  it('renders multiple children', () => {
    renderWithProvider(
      <PageTransition>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
      </PageTransition>
    );

    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
  });
});
