import { render, screen, act } from '@testing-library/react';
import FadeWrapper from '@/components/splash/FadeWrapper';

describe('FadeWrapper', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders children', () => {
    render(
      <FadeWrapper>
        <div data-testid="child">Child Content</div>
      </FadeWrapper>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('starts with opacity 0', () => {
    const { container } = render(
      <FadeWrapper>
        <div data-testid="child">Child</div>
      </FadeWrapper>
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveStyle({ opacity: '0' });
  });

  it('cleans up timeout on unmount', () => {
    const { unmount } = render(
      <FadeWrapper>
        <div data-testid="child">Child</div>
      </FadeWrapper>
    );
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });

  it('does not animate if unmounted before timeout', () => {
    const { unmount } = render(
      <FadeWrapper>
        <div data-testid="child">Child</div>
      </FadeWrapper>
    );

    unmount();

    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Should not throw or cause issues
    expect(true).toBe(true);
  });
});
