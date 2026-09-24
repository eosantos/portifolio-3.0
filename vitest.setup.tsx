import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  localStorage.clear();
});

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn()
  }),
  useSearchParams: () => new URLSearchParams()
}));

// Mock next/image
vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    width,
    height,
    priority,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean }) => (
    <img src={src} alt={alt} width={width} height={height} {...props} />
  )
}));

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { changeLanguage: vi.fn(), language: 'pt' }
  }),
  initReactI18next: { type: '3rdParty', init: vi.fn() }
}));

// Mock styled-components ThemeProvider
vi.mock('styled-components', async () => {
  const actual = await vi.importActual('styled-components');
  return {
    ...actual,
    ThemeProvider: ({
      children,
      theme
    }: {
      children: React.ReactNode;
      theme: any;
    }) => <actual.ThemeProvider theme={theme}>{children}</actual.ThemeProvider>,
    useTheme: () => ({
      title: 'dark',
      background: '#282a36',
      text: '#f8f8f2',
      currentline: '#44475a',
      selection: '#44475a',
      foreground: '#f8f8f2',
      comment: '#6272a4',
      cyan: '#8be9fd',
      green: '#50fa7b',
      orange: '#ffb86c',
      pink: '#ff79c6',
      purple: '#bd93f9',
      red: '#ff5555',
      yellow: '#f1fa8c'
    }),
    createGlobalStyle: () => () => null
  };
});

// Mock framer-motion
vi.mock('framer-motion', async () => {
  const mockModule = await import('@/__mocks__/framer-motion');
  return mockModule;
});

// Mock gsap: animations are no-ops in tests so content stays visible
// and assertions cover structure/text/hrefs (animation is validated at runtime)
vi.mock('gsap', () => {
  const noopTimeline = () => {
    const tl: Record<string, unknown> = {};
    tl.to = vi.fn(() => tl);
    tl.fromTo = vi.fn(() => tl);
    tl.add = vi.fn(() => tl);
    tl.set = vi.fn(() => tl);
    return tl;
  };
  return {
    gsap: {
      context: vi.fn(() => ({ revert: vi.fn() })),
      timeline: vi.fn(() => noopTimeline()),
      set: vi.fn(),
      to: vi.fn(),
      fromTo: vi.fn(),
      registerPlugin: vi.fn(),
      matchMedia: vi.fn(() => ({ add: vi.fn(), revert: vi.fn() }))
    }
  };
});

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    create: vi.fn(),
    refresh: vi.fn(),
    getAll: vi.fn(() => []),
    kill: vi.fn()
  }
}));

// Mock react-icons
vi.mock('react-icons/fi', () => ({
  FiMenu: ({ 'data-testid': testid = 'menu-icon' }) => (
    <svg data-testid={testid} />
  ),
  FiX: ({ 'data-testid': testid = 'close-icon' }) => (
    <svg data-testid={testid} />
  ),
  FiMoon: ({ 'data-testid': testid = 'moon-icon' }) => (
    <svg data-testid={testid} />
  ),
  FiSun: ({ 'data-testid': testid = 'sun-icon' }) => (
    <svg data-testid={testid} />
  ),
  FiMail: ({ 'data-testid': testid = 'mail-icon' }) => (
    <svg data-testid={testid} />
  ),
  FiGithub: ({ 'data-testid': testid = 'github-icon' }) => (
    <svg data-testid={testid} />
  ),
  FiLinkedin: ({ 'data-testid': testid = 'linkedin-icon' }) => (
    <svg data-testid={testid} />
  ),
  FiSend: ({ 'data-testid': testid = 'send-icon' }) => (
    <svg data-testid={testid} />
  )
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
});

// Mock window.dispatchEvent for splash-complete
const originalDispatchEvent = window.dispatchEvent;
window.dispatchEvent = vi.fn((event) => {
  if (event.type === 'splash-complete') {
    return true;
  }
  return originalDispatchEvent.call(window, event);
});

// ResizeObserver mock
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}));

// IntersectionObserver mock
class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn();
  thresholds = [];
  root = null;
  rootMargin = '';
}
global.IntersectionObserver = MockIntersectionObserver as any;
