'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Reveal from '@/components/Reveal';
import { media } from '@/styles/media';
import { useTranslation } from 'react-i18next';
import styled, { keyframes } from 'styled-components';
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiGraphql,
  SiVite,
  SiVtex,
  SiSass,
  SiStyledcomponents,
  SiMaterialdesign
} from 'react-icons/si';
import { FaExternalLinkAlt, FaGithub, FaTimes } from 'react-icons/fa';

interface TechIconProps {
  icon: React.ComponentType<{ size?: number; color?: string }>;
}

const TechIcon = styled(({ icon: Icon, ...props }: TechIconProps) => (
  <Icon {...props} size={16} color="currentColor" />
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
  margin: 0 0 3rem;

  ${media.greaterThan('md')} {
    font-size: 1rem;
  }
`;

const SubSectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: ${({ theme }) => theme.text};
  margin: 0 0 1.5rem;

  ${media.greaterThan('md')} {
    font-size: 1.5rem;
  }
`;

const ProjectsGrid = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr;

  ${media.greaterThan('md')} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${media.greaterThan('lg')} {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const ProjectCard = styled.article`
  position: relative;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.currentline};
  border-radius: 16px;
  overflow: hidden;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.15);
    border-color: ${({ theme }) => theme.purple};
  }

  &:focus-within {
    outline: 2px solid ${({ theme }) => theme.purple};
    outline-offset: 2px;
  }
`;

const CardCover = styled.div<{ $bgColor?: string }>`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  background: ${({ theme, $bgColor }) => $bgColor || theme.currentline};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    opacity: 0.03;
    pointer-events: none;
  }
`;

const CoverTitle = styled.span`
  font-size: clamp(1.25rem, 4vw, 2rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.text};
  text-align: center;
  padding: 1rem;
  line-height: 1.2;
  position: relative;
  z-index: 1;
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 1.5rem;
  gap: 1rem;
`;

const CardMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.comment};
`;

const CardPeriod = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
`;

const CardType = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.125rem 0.5rem;
  border: 1px solid ${({ theme }) => theme.currentline};
  border-radius: 999px;
  background: ${({ theme }) => theme.background};
`;

const CardDescription = styled.p`
  font-size: 0.95rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.comment};
  margin: 0;
  flex: 1;
`;

const CardTechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const CardTechTag = styled.span`
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.purple};
  padding: 0.375rem 0.75rem;
  border: 1px solid ${({ theme }) => theme.currentline};
  border-radius: 999px;
  background: ${({ theme }) => theme.background};
  transition:
    border-color 0.2s ease,
    color 0.2s ease;

  ${ProjectCard}:hover & {
    border-color: ${({ theme }) => theme.purple};
  }
`;

const ViewMoreButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: 1px solid ${({ theme }) => theme.purple};
  border-radius: 999px;
  background: transparent;
  color: ${({ theme }) => theme.purple};
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;

  &:hover,
  &:focus-visible {
    background: ${({ theme }) => theme.purple};
    color: #fff;
    outline: none;
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  animation: ${fadeIn} 0.2s ease;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const Modal = styled.div`
  position: relative;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.currentline};
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: ${slideUp} 0.3s ease;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const ModalClose = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid ${({ theme }) => theme.currentline};
  border-radius: 50%;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    color 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.purple};
    color: ${({ theme }) => theme.purple};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  max-height: 90vh;
  padding: 2rem;

  ${media.greaterThan('md')} {
    flex-direction: row;
    padding: 2.5rem;
  }
`;

const ModalMedia = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  background: ${({ theme }) => theme.currentline};
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;

  ${media.greaterThan('md')} {
    width: 50%;
    aspect-ratio: auto;
    height: 100%;
    min-height: 400px;
    margin-bottom: 0;
    margin-right: 2rem;
    flex-shrink: 0;
    border-radius: 12px 0 0 12px;
  }
`;

const ModalMediaTitle = styled.span`
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.text};
  text-align: center;
  padding: 1rem;
  line-height: 1.2;
`;

const ModalContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-width: 0;
`;

const ModalHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 0.75rem 1.5rem;
`;

const ModalTitle = styled.h2`
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.text};
  margin: 0;
  line-height: 1.2;

  ${media.greaterThan('md')} {
    flex: 1;
  }
`;

const ModalPeriod = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.comment};
  white-space: nowrap;
`;

const ModalType = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.purple};
  padding: 0.25rem 0.75rem;
  border: 1px solid ${({ theme }) => theme.currentline};
  border-radius: 999px;
  background: ${({ theme }) => theme.background};
`;

const ModalDescription = styled.p`
  font-size: 1rem;
  line-height: 1.7;
  color: ${({ theme }) => theme.comment};
  margin: 0;
`;

const ModalHighlights = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ModalHighlightsTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.text};
  margin: 0 0 0.5rem;
`;

const ModalHighlightsList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

const ModalHighlightItem = styled.li`
  position: relative;
  padding-left: 1.25rem;
  font-size: 0.95rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.comment};

  &::before {
    content: '—';
    position: absolute;
    left: 0;
    color: ${({ theme }) => theme.purple};
  }
`;

const ModalTechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const ModalTechTag = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.purple};
  padding: 0.375rem 0.75rem;
  border: 1px solid ${({ theme }) => theme.currentline};
  border-radius: 999px;
  background: ${({ theme }) => theme.background};
`;

const ModalActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.currentline};
`;

const ActionButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border: 1px solid ${({ theme }) => theme.purple};
  border-radius: 999px;
  background: ${({ theme }) => theme.purple};
  color: #fff;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-decoration: none;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    background: transparent;
    color: ${({ theme }) => theme.purple};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.purple};
    outline-offset: 2px;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const ActionButtonSecondary = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border: 1px solid ${({ theme }) => theme.currentline};
  border-radius: 999px;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.comment};
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  cursor: default;
`;

const GenericIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
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

const getTechIcon = (techName: string) => {
  const icons: Record<
    string,
    React.ComponentType<{ size?: number; color?: string }>
  > = {
    React: SiReact,
    'Next.js': SiNextdotjs,
    'Next.js (SSR)': SiNextdotjs,
    TypeScript: SiTypescript,
    'React Hooks': SiReact,
    'Styled Components': SiStyledcomponents,
    'REST APIs': SiGraphql,
    VTEX: SiVtex,
    'VTEX IO': SiVtex,
    Sass: SiSass,
    TailwindCSS: SiTailwindcss,
    Vite: SiVite,
    GraphQL: SiGraphql,
    'Material UI': SiMaterialdesign
  };
  return icons[techName] || GenericIcon;
};

interface FeaturedProject {
  id: string;
  name: string;
  shortDesc: string;
  fullDesc: string;
  period: string;
  highlights: string[];
  technologies: string[];
  coverColor?: string;
}

interface AllProject {
  id: string;
  name: string;
  shortDesc: string;
  technologies: string[];
  link?: string;
  github?: string;
  type: 'internal' | 'study' | 'training';
  coverColor?: string;
}

const featuredProjects: FeaturedProject[] = [
  {
    id: 'featured1',
    name: 'projects.featured1.name',
    shortDesc: 'projects.featured1.shortDesc',
    fullDesc: 'projects.featured1.fullDesc',
    period: 'projects.featured1.period',
    highlights: [
      'projects.featured1.highlights.0',
      'projects.featured1.highlights.1',
      'projects.featured1.highlights.2',
      'projects.featured1.highlights.3'
    ],
    technologies: [
      'React',
      'Next.js (SSR)',
      'Styled Components',
      'React Hooks'
    ],
    coverColor: '#1a1a2e'
  },
  {
    id: 'featured2',
    name: 'projects.featured2.name',
    shortDesc: 'projects.featured2.shortDesc',
    fullDesc: 'projects.featured2.fullDesc',
    period: 'projects.featured2.period',
    highlights: [
      'projects.featured2.highlights.0',
      'projects.featured2.highlights.1',
      'projects.featured2.highlights.2',
      'projects.featured2.highlights.3'
    ],
    technologies: ['Next.js', 'TypeScript', 'Styled Components', 'REST APIs'],
    coverColor: '#16213e'
  },
  {
    id: 'featured3',
    name: 'projects.featured3.name',
    shortDesc: 'projects.featured3.shortDesc',
    fullDesc: 'projects.featured3.fullDesc',
    period: 'projects.featured3.period',
    highlights: [
      'projects.featured3.highlights.0',
      'projects.featured3.highlights.1',
      'projects.featured3.highlights.2',
      'projects.featured3.highlights.3'
    ],
    technologies: ['React', 'TypeScript', 'VTEX IO', 'Sass'],
    coverColor: '#0f0f23'
  }
];

const allProjects: AllProject[] = [
  {
    id: 'featured1',
    name: 'projects.featured1.name',
    shortDesc: 'projects.featured1.shortDesc',
    technologies: [
      'React',
      'Next.js (SSR)',
      'Styled Components',
      'React Hooks'
    ],
    type: 'internal',
    coverColor: '#1a1a2e'
  },
  {
    id: 'featured2',
    name: 'projects.featured2.name',
    shortDesc: 'projects.featured2.shortDesc',
    technologies: ['Next.js', 'TypeScript', 'Styled Components', 'REST APIs'],
    type: 'internal',
    coverColor: '#16213e'
  },
  {
    id: 'featured3',
    name: 'projects.featured3.name',
    shortDesc: 'projects.featured3.shortDesc',
    technologies: ['React', 'TypeScript', 'VTEX IO', 'Sass'],
    type: 'internal',
    coverColor: '#0f0f23'
  },
  {
    id: 'project4',
    name: 'projects.project4.name',
    shortDesc: 'projects.project4.shortDesc',
    technologies: ['TypeScript', 'Vite', 'TailwindCSS', 'GraphQL'],
    link: 'https://event-platform-eosantos.vercel.app',
    github: 'https://github.com/eosantos/event-platform',
    type: 'study',
    coverColor: '#1a1a2e'
  },
  {
    id: 'project5',
    name: 'projects.project5.name',
    shortDesc: 'projects.project5.shortDesc',
    technologies: ['React', 'TypeScript', 'Next.js', 'Material UI'],
    link: 'https://ecommerce-reactjs-app.vercel.app',
    github: 'https://github.com/eosantos/ecommerce-reactjs-app',
    type: 'training',
    coverColor: '#16213e'
  }
];

function FeaturedCard({
  project,
  index,
  t,
  onViewMore
}: {
  project: FeaturedProject;
  index: number;
  t: (key: string) => string;
  onViewMore: () => void;
}) {
  return (
    <Reveal key={project.id} delay={index * 80} y={16}>
      <ProjectCard>
        <CardCover $bgColor={project.coverColor}>
          <CoverTitle>{t(project.name)}</CoverTitle>
        </CardCover>
        <CardContent>
          <CardMeta>
            <CardPeriod>
              {t('projects.period')}: {t(project.period)}
            </CardPeriod>
            <CardType>{t('projects.internalProject')}</CardType>
          </CardMeta>
          <CardDescription>{t(project.shortDesc)}</CardDescription>
          <CardTechStack>
            {project.technologies.map((tech) => (
              <CardTechTag key={tech}>
                <TechIcon icon={getTechIcon(tech)} aria-hidden="true" />
                {tech}
              </CardTechTag>
            ))}
          </CardTechStack>
          <ViewMoreButton
            type="button"
            onClick={onViewMore}
            aria-label={`${t('projects.viewMore')}: ${t(project.name)}`}
          >
            {t('projects.viewMore')}
            <FaExternalLinkAlt aria-hidden="true" size={14} />
          </ViewMoreButton>
        </CardContent>
      </ProjectCard>
    </Reveal>
  );
}

function AllProjectCard({
  project,
  index,
  t
}: {
  project: AllProject;
  index: number;
  t: (key: string) => string;
}) {
  const hasLinks = project.link || project.github;

  return (
    <Reveal key={project.id} delay={index * 60} y={12}>
      <ProjectCard>
        <CardCover $bgColor={project.coverColor}>
          <CoverTitle>{t(project.name)}</CoverTitle>
        </CardCover>
        <CardContent>
          <CardMeta>
            {project.type === 'study' && (
              <CardType>{t('projects.studyProject')}</CardType>
            )}
            {project.type === 'training' && (
              <CardType>{t('projects.trainingProject')}</CardType>
            )}
            {project.type === 'internal' && (
              <CardType>{t('projects.internalProject')}</CardType>
            )}
          </CardMeta>
          <CardDescription>{t(project.shortDesc)}</CardDescription>
          <CardTechStack>
            {project.technologies.map((tech) => (
              <CardTechTag key={tech}>
                <TechIcon icon={getTechIcon(tech)} aria-hidden="true" />
                {tech}
              </CardTechTag>
            ))}
          </CardTechStack>
          {hasLinks && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
                marginTop: '0.5rem'
              }}
            >
              {project.link && (
                <ActionButton
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${t('projects.viewProject')}: ${t(project.name)}`}
                >
                  <FaExternalLinkAlt aria-hidden="true" size={14} />
                  {t('projects.viewProject')}
                </ActionButton>
              )}
              {project.github && (
                <ActionButton
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${t('projects.viewRepo')}: ${t(project.name)}`}
                >
                  <FaGithub aria-hidden="true" size={14} />
                  {t('projects.viewRepo')}
                </ActionButton>
              )}
            </div>
          )}
          {!hasLinks && (
            <ActionButtonSecondary style={{ marginTop: '0.5rem' }}>
              {t('projects.internalProject')}
            </ActionButtonSecondary>
          )}
        </CardContent>
      </ProjectCard>
    </Reveal>
  );
}

function ProjectModal({
  project,
  onClose,
  t
}: {
  project: FeaturedProject | null;
  onClose: () => void;
  t: (key: string) => string;
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const isMounted = useRef(false);

  // Only run effect when modal is actually open (project is not null) and component is mounted
  useEffect(() => {
    isMounted.current = true;

    if (!project || !isMounted.current) return;

    previousActiveElement.current = document.activeElement as HTMLElement;
    document.body.style.overflow = 'hidden';
    modalRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        const focusableElements =
          modalRef.current?.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
        if (!focusableElements || focusableElements.length === 0) return;
        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      if (isMounted.current) {
        document.body.style.overflow = '';
      }
      document.removeEventListener('keydown', handleKeyDown);
      previousActiveElement.current?.focus();
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <ModalOverlay
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <Modal ref={modalRef} tabIndex={-1} onClick={(e) => e.stopPropagation()}>
        <ModalClose onClick={onClose} aria-label={t('projects.close')}>
          <FaTimes aria-hidden="true" size={20} />
        </ModalClose>
        <ModalBody>
          <ModalMedia>
            <ModalMediaTitle>{t(project.name)}</ModalMediaTitle>
          </ModalMedia>
          <ModalContent>
            <ModalHeader>
              <ModalTitle id="modal-title">{t(project.name)}</ModalTitle>
              <ModalPeriod>
                {t('projects.period')}: {t(project.period)}
              </ModalPeriod>
              <ModalType>{t('projects.internalProject')}</ModalType>
            </ModalHeader>
            <ModalDescription>{t(project.fullDesc)}</ModalDescription>
            <ModalHighlights>
              <ModalHighlightsTitle>
                {t('projects.highlights')}
              </ModalHighlightsTitle>
              <ModalHighlightsList>
                {project.highlights.map((highlight, index) => (
                  <ModalHighlightItem key={index}>
                    {t(highlight)}
                  </ModalHighlightItem>
                ))}
              </ModalHighlightsList>
            </ModalHighlights>
            <ModalTechStack>
              <ModalHighlightsTitle>
                {t('projects.technologies')}
              </ModalHighlightsTitle>
              {project.technologies.map((tech) => (
                <ModalTechTag key={tech}>
                  <TechIcon icon={getTechIcon(tech)} aria-hidden="true" />
                  {tech}
                </ModalTechTag>
              ))}
            </ModalTechStack>
            <ModalActions>
              <ActionButtonSecondary>
                {t('projects.internalProject')}
              </ActionButtonSecondary>
            </ModalActions>
          </ModalContent>
        </ModalBody>
      </Modal>
    </ModalOverlay>
  );
}

export default function ProjetosSection() {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState<FeaturedProject | null>(null);

  const handleOpenModal = useCallback((project: FeaturedProject) => {
    setOpenModal(project);
  }, []);

  const handleCloseModal = useCallback(() => {
    setOpenModal(null);
  }, []);

  return (
    <Section id="projetos" aria-labelledby="projetos-title">
      <Reveal>
        <Eyebrow id="projetos-title">{t('projects.title')}</Eyebrow>
      </Reveal>

      <Reveal delay={100} y={16}>
        <SubSectionTitle>{t('projects.featured')}</SubSectionTitle>
        <ProjectsGrid>
          {featuredProjects.map((project, index) => (
            <FeaturedCard
              key={project.id}
              project={project}
              index={index}
              t={t}
              onViewMore={() => handleOpenModal(project)}
            />
          ))}
        </ProjectsGrid>
      </Reveal>

      <Reveal delay={200} y={16}>
        <SubSectionTitle>{t('projects.all')}</SubSectionTitle>
        <ProjectsGrid>
          {allProjects.map((project, index) => (
            <AllProjectCard
              key={project.id}
              project={project}
              index={index}
              t={t}
            />
          ))}
        </ProjectsGrid>
      </Reveal>

      <ProjectModal project={openModal} onClose={handleCloseModal} t={t} />
    </Section>
  );
}
