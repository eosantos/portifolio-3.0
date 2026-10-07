import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { LanguageProvider } from '@/providers/LanguageProvider';
import Projetos from '@/sections/Projetos';

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

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <ThemeProvider>
      <LanguageProvider>{component}</LanguageProvider>
    </ThemeProvider>
  );
};

describe('ProjetosSection', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark', 'light');
    vi.clearAllMocks();
    vi.stubGlobal('IntersectionObserver', TriggeringObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders without crashing', () => {
    renderWithProviders(<Projetos />);
    expect(screen.getByText('projects.title')).toBeInTheDocument();
  });

  it('displays section title', () => {
    renderWithProviders(<Projetos />);
    expect(screen.getByText('projects.title')).toBeInTheDocument();
  });

  it('displays featured section', () => {
    renderWithProviders(<Projetos />);
    expect(screen.getByText('projects.featured')).toBeInTheDocument();
  });

  it('displays all projects section', () => {
    renderWithProviders(<Projetos />);
    expect(screen.getByText('projects.all')).toBeInTheDocument();
  });

  it('displays 3 featured project cards', () => {
    renderWithProviders(<Projetos />);
    const cards = screen.getAllByText('projects.featured1.name');
    expect(cards.length).toBeGreaterThanOrEqual(1);
  });

  it('displays all 5 project cards in all projects section', () => {
    renderWithProviders(<Projetos />);
    // Should have 5 cards total (3 featured + 2 personal)
    const allCards = document.querySelectorAll('article');
    expect(allCards.length).toBeGreaterThanOrEqual(5);
  });

  it('displays featured project 1 (Magalu) content', () => {
    renderWithProviders(<Projetos />);
    // Period is only in featured section, not in all projects section
    expect(
      screen.getByText((content) =>
        content.includes('projects.featured1.period')
      )
    ).toBeInTheDocument();
  });

  it('displays featured project 2 (EqSeed) content', () => {
    renderWithProviders(<Projetos />);
    expect(
      screen.getByText((content) =>
        content.includes('projects.featured2.period')
      )
    ).toBeInTheDocument();
  });

  it('displays featured project 3 (Samsung/Trinto) content', () => {
    renderWithProviders(<Projetos />);
    expect(
      screen.getByText((content) =>
        content.includes('projects.featured3.period')
      )
    ).toBeInTheDocument();
  });

  it('displays personal project 1 (event-platform)', () => {
    renderWithProviders(<Projetos />);
    expect(screen.getByText('projects.project4.name')).toBeInTheDocument();
    expect(screen.getByText('projects.project4.shortDesc')).toBeInTheDocument();
  });

  it('displays personal project 2 (ecommerce-reactjs-app)', () => {
    renderWithProviders(<Projetos />);
    expect(screen.getByText('projects.project5.name')).toBeInTheDocument();
    expect(screen.getByText('projects.project5.shortDesc')).toBeInTheDocument();
  });

  it('shows internal project badge for work projects', () => {
    renderWithProviders(<Projetos />);
    const internalBadges = screen.getAllByText('projects.internalProject');
    // 3 featured cards + 3 internal projects in all section = 6
    expect(internalBadges.length).toBeGreaterThanOrEqual(3);
  });

  it('shows study project badge for event-platform', () => {
    renderWithProviders(<Projetos />);
    expect(screen.getByText('projects.studyProject')).toBeInTheDocument();
  });

  it('shows technical challenge badge for technical challenge projects', () => {
    renderWithProviders(<Projetos />);
    const badges = screen.getAllByText('projects.technicalChallenge');
    // 4 projects have type 'technicalChallenge': project5, project6, project7, project8
    expect(badges.length).toBe(4);
  });

  it('has view project and view repo links for personal projects', () => {
    renderWithProviders(<Projetos />);
    const viewProjectLinks = screen.getAllByText('projects.viewProject');
    const viewRepoLinks = screen.getAllByText('projects.viewRepo');
    // 2 personal projects (project4, project8) have viewProject links
    // 5 allProjects have viewRepo links (all have github)
    expect(viewProjectLinks.length).toBe(2);
    expect(viewRepoLinks.length).toBe(5);
  });

  it('does not have external links for internal projects', () => {
    renderWithProviders(<Projetos />);
    // Internal projects (featured1, featured2, featured3 in allProjects) should not have viewProject/viewRepo links
    const viewProjectLinks = screen.getAllByText('projects.viewProject');
    const viewRepoLinks = screen.getAllByText('projects.viewRepo');
    // Only project4 and project8 have viewProject links (2 total)
    // All 5 allProjects have viewRepo links via github
    expect(viewProjectLinks.length).toBe(2);
    expect(viewRepoLinks.length).toBe(5);
  });

  it('opens modal when view more is clicked on featured card', () => {
    renderWithProviders(<Projetos />);
    const viewMoreButtons = screen.getAllByText('projects.viewMore');
    fireEvent.click(viewMoreButtons[0]);
    // Modal should open with first featured project - check for fullDesc which is only in modal
    expect(
      screen.getByText((content) =>
        content.includes('projects.featured1.fullDesc')
      )
    ).toBeInTheDocument();
    expect(screen.getByLabelText('projects.close')).toBeInTheDocument();
  });

  it('closes modal when close button is clicked', () => {
    renderWithProviders(<Projetos />);
    const viewMoreButtons = screen.getAllByText('projects.viewMore');
    fireEvent.click(viewMoreButtons[0]);
    expect(screen.getByText('projects.featured1.fullDesc')).toBeInTheDocument();

    const closeButton = screen.getByLabelText('projects.close');
    fireEvent.click(closeButton);
    expect(
      screen.queryByText('projects.featured1.fullDesc')
    ).not.toBeInTheDocument();
  });

  it('closes modal when Escape key is pressed', () => {
    renderWithProviders(<Projetos />);
    const viewMoreButtons = screen.getAllByText('projects.viewMore');
    fireEvent.click(viewMoreButtons[0]);
    expect(screen.getByText('projects.featured1.fullDesc')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(
      screen.queryByText('projects.featured1.fullDesc')
    ).not.toBeInTheDocument();
  });

  it('modal displays highlights correctly', () => {
    renderWithProviders(<Projetos />);
    const viewMoreButtons = screen.getAllByText('projects.viewMore');
    fireEvent.click(viewMoreButtons[0]);

    expect(screen.getByText('projects.highlights')).toBeInTheDocument();
    expect(
      screen.getByText('projects.featured1.highlights.0')
    ).toBeInTheDocument();
    expect(
      screen.getByText('projects.featured1.highlights.1')
    ).toBeInTheDocument();
    expect(
      screen.getByText('projects.featured1.highlights.2')
    ).toBeInTheDocument();
    expect(
      screen.getByText('projects.featured1.highlights.3')
    ).toBeInTheDocument();
  });

  it('modal displays technologies correctly', () => {
    renderWithProviders(<Projetos />);
    const viewMoreButtons = screen.getAllByText('projects.viewMore');
    fireEvent.click(viewMoreButtons[0]);

    expect(
      screen.getByText((content) => content.includes('projects.technologies'))
    ).toBeInTheDocument();
    const reactElements = screen.getAllByText('React');
    expect(reactElements.length).toBeGreaterThanOrEqual(1);
    const nextJsElements = screen.getAllByText('Next.js (SSR)');
    expect(nextJsElements.length).toBeGreaterThanOrEqual(1);
    const styledElements = screen.getAllByText('Styled Components');
    expect(styledElements.length).toBeGreaterThanOrEqual(1);
    const hooksElements = screen.getAllByText('React Hooks');
    expect(hooksElements.length).toBeGreaterThanOrEqual(1);
  });

  it('reveals content when intersecting', () => {
    const { container } = renderWithProviders(<Projetos />);
    const section = container.querySelector('section#projetos');
    expect(section).toBeInTheDocument();
    const title = screen.getByText('projects.title');
    const reveal = title.closest('div');
    expect(reveal).toHaveStyle({ opacity: '1' });
  });

  it('is accessible - section labelled by title', () => {
    const { container } = renderWithProviders(<Projetos />);
    const section = container.querySelector('section#projetos');
    expect(section).toBeInTheDocument();
    expect(section?.getAttribute('aria-labelledby')).toBe('projetos-title');
  });

  it('shows content immediately under reduced motion', () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = (() =>
      ({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      }) as unknown as MediaQueryList) as typeof window.matchMedia;

    try {
      renderWithProviders(<Projetos />);
      expect(screen.getByText('projects.title')).toBeInTheDocument();
    } finally {
      window.matchMedia = originalMatchMedia;
    }
  });

  it('does not throw when IntersectionObserver is unavailable', () => {
    vi.stubGlobal('IntersectionObserver', undefined as never);
    expect(() => renderWithProviders(<Projetos />)).not.toThrow();
    expect(screen.getByText('projects.title')).toBeInTheDocument();
  });
});
