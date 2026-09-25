'use client';

import { useState, useCallback, useRef } from 'react';
import Reveal from '@/components/Reveal';
import { media } from '@/styles/media';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  SiReact,
  SiNextdotjs,
  SiAngular,
  SiTypescript,
  SiJavascript,
  SiReact as SiReactNative,
  SiStyledcomponents,
  SiSass,
  SiTailwindcss,
  SiRedux,
  SiNodedotjs,
  SiMongodb,
  SiPostgresql,
  SiPhp,
  SiFirebase,
  SiGraphql,
  SiFigma
} from 'react-icons/si';

interface TechIconProps {
  icon: React.ComponentType<{ size?: number; color?: string }>;
}

const TechIcon = styled(({ icon: Icon, ...props }: TechIconProps) => (
  <Icon {...props} size={24} color="currentColor" />
))`
  flex-shrink: 0;
`;

const Section = styled.section`
  position: relative;
  z-index: 5;
  max-width: 1280px;
  margin: 0 auto;
  padding: 5rem 2rem;

  ${media.greaterThan('md')} {
    padding: 7rem 4rem;
  }
`;

const Eyebrow = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.purple};
  margin: 0 0 1.5rem;

  ${media.greaterThan('md')} {
    font-size: 1rem;
  }
`;

const Nav = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.currentline};
`;

const NavButton = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid
    ${({ theme, $active }) => ($active ? theme.purple : theme.currentline)};
  border-radius: 999px;
  background: ${({ theme, $active }) => ($active ? theme.purple : 'transparent')};
  color: ${({ theme, $active }) => ($active ? '#fff' : theme.text)};
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  white-space: nowrap;
  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    color 0.2s ease;

  &:hover,
  &:focus-visible {
    border-color: ${({ theme }) => theme.purple};
    background: ${({ theme, $active }) => ($active ? theme.purple : 'rgba(0, 0, 0, 0.05)')};
    color: ${({ theme, $active }) => ($active ? '#fff' : theme.purple)};
    outline: none;
  }

  ${media.greaterThan('md')} {
    font-size: 0.8rem;
    padding: 0.625rem 1.25rem;
  }
`;

const ContentWrapper = styled.div`
  min-height: 200px;
  position: relative;
`;

const CategoryPanel = styled.div<{ $isActive: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  opacity: ${({ $isActive }) => ($isActive ? 1 : 0)};
  visibility: ${({ $isActive }) => ($isActive ? 'visible' : 'hidden')};
  pointer-events: ${({ $isActive }) => ($isActive ? 'auto' : 'none')};
  transition:
    opacity 0.3s ease,
    visibility 0.3s ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const CategoryTitle = styled.h3`
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.comment};
  margin: 0 0 1.5rem;
  text-align: center;

  ${media.greaterThan('md')} {
    font-size: 0.875rem;
  }
`;

const TechGrid = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
`;

const TechCard = styled.li`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  min-width: 90px;
  max-width: 130px;
  padding: 1rem 0.875rem 1.5rem;
  border: 1px solid ${({ theme }) => theme.currentline};
  border-radius: 12px;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 1px;
    right: 1px;
    height: 3px;
    background: ${({ theme }) => theme.purple};
    border-radius: 0 0 11px 11px;
    opacity: 0.8;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
    border-color: ${({ theme }) => theme.purple};
  }

  ${media.greaterThan('md')} {
    min-width: 100px;
    max-width: 140px;
    padding: 1.25rem 1rem 1.75rem;
  }
`;

const TechName = styled.span`
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-align: center;
  line-height: 1.3;
  color: ${({ theme }) => theme.text};

  ${media.greaterThan('md')} {
    font-size: 0.75rem;
  }
`;

const GenericIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <path d="M9 9h6v6H9z" />
  </svg>
);

const techStack = {
  frontend: [
    { name: 'React', icon: SiReact },
    { name: 'Next.js', icon: SiNextdotjs },
    { name: 'Angular', icon: SiAngular },
    { name: 'TypeScript', icon: SiTypescript },
    { name: 'JavaScript', icon: SiJavascript }
  ],
  mobile: [{ name: 'React Native', icon: SiReactNative }],
  styling: [
    { name: 'Styled Components', icon: SiStyledcomponents },
    { name: 'Sass', icon: SiSass },
    { name: 'TailwindCSS', icon: SiTailwindcss }
  ],
  state: [
    { name: 'Redux', icon: SiRedux },
    { name: 'Hookstate', icon: GenericIcon }
  ],
  backend: [
    { name: 'Node.js', icon: SiNodedotjs },
    { name: 'MongoDB', icon: SiMongodb },
    { name: 'PostgreSQL', icon: SiPostgresql },
    { name: 'PHP', icon: SiPhp },
    { name: 'Firebase', icon: SiFirebase },
    { name: 'GraphQL', icon: SiGraphql },
    { name: 'REST APIs', icon: GenericIcon }
  ],
  product: [
    { name: 'Design Systems', icon: GenericIcon },
    { name: 'Acessibilidade', icon: GenericIcon },
    { name: 'Figma', icon: SiFigma }
  ]
} as const;

type CategoryKey = keyof typeof techStack;

interface CategoryPanelProps {
  category: CategoryKey;
  isActive: boolean;
  t: (key: string) => string;
}

function CategoryPanelComponent({ category, isActive, t }: CategoryPanelProps) {
  const items = techStack[category];

  return (
    <CategoryPanel
      $isActive={isActive}
      role="tabpanel"
      aria-labelledby={`tab-${category}`}
    >
      <CategoryTitle id={`tabpanel-${category}`}>
        {t(`stacks.categories.${category}` as const)}
      </CategoryTitle>
      <TechGrid
        role="list"
        aria-label={t(`stacks.categories.${category}` as const)}
      >
        {items.map((tech, index) => (
          <Reveal key={tech.name} delay={index * 30} y={12}>
            <TechCard role="listitem">
              <TechIcon icon={tech.icon} aria-hidden="true" />
              <TechName>{tech.name}</TechName>
            </TechCard>
          </Reveal>
        ))}
      </TechGrid>
    </CategoryPanel>
  );
}

export default function StacksSection() {
  const { t } = useTranslation();

  const categories: CategoryKey[] = [
    'frontend',
    'mobile',
    'styling',
    'state',
    'backend',
    'product'
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : categories.length - 1));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setActiveIndex((prev) => (prev < categories.length - 1 ? prev + 1 : 0));
      }
    },
    [categories.length]
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        setActiveIndex((prev) => (prev < categories.length - 1 ? prev + 1 : 0));
      } else {
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : categories.length - 1));
      }
    }
  };

  return (
    <Section
      id="stacks"
      aria-labelledby="stacks-eyebrow"
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <Reveal>
        <Eyebrow id="stacks-eyebrow">{t('stacks.label')}</Eyebrow>
      </Reveal>

      <Nav role="tablist" aria-label={t('stacks.label')}>
        {categories.map((category, index) => (
          <Reveal key={category} delay={index * 50} y={8}>
            <NavButton
              id={`tab-${category}`}
              role="tab"
              aria-selected={index === activeIndex}
              aria-controls={`tabpanel-${category}`}
              $active={index === activeIndex}
              onClick={() => setActiveIndex(index)}
            >
              {t(`stacks.categories.${category}` as const)}
            </NavButton>
          </Reveal>
        ))}
      </Nav>

      <ContentWrapper ref={wrapperRef} role="region" aria-live="polite">
        {categories.map((category, index) => (
          <CategoryPanelComponent
            key={category}
            category={category}
            isActive={index === activeIndex}
            t={t}
          />
        ))}
      </ContentWrapper>
    </Section>
  );
}
