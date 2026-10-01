'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Reveal from '@/components/Reveal';
import { media } from '@/styles/media';
import { useTranslation } from 'react-i18next';
import styled, { keyframes } from 'styled-components';
import { TechTagComponent } from '@/components/TechTag';
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
import { createPortal } from 'react-dom';

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
  max-height: 530px;

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

const CardCover = styled.div<{
  $bgColor?: string;
  $coverImage?: string;
}>`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  background: ${({ theme, $bgColor }) => $bgColor || theme.currentline};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  min-height: 230px;

  ${({ $coverImage }) =>
    $coverImage &&
    `
      background-image: url(${$coverImage});
      background-size: cover;
      background-position: top;
      background-repeat: no-repeat;
    `}

  /* Overlay sobre a imagem */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.35) 0%,
      rgba(0, 0, 0, 0.65) 100%
    );
    z-index: 1;
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    opacity: 0.03;
    pointer-events: none;
    z-index: 2;
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
  z-index: 2;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
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
  top: 65px;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99999;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 1.5rem;
  overflow-y: auto;

  animation: ${fadeIn} 0.2s ease;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const Modal = styled.div`
  position: relative;
  width: 100%;
  max-width: 850px;
  max-height: calc(100vh - 140px);
  display: flex;
  flex-direction: column;
  background: #282a36;
  border: 1px solid #44475a;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
  margin: auto;
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
  height: 100%;
  min-height: 0;
  overflow: hidden;

  ${media.greaterThan('md')} {
    flex-direction: row;
  }
`;

const ModalLeftColumn = styled.div`
  flex: 0 0 100%;
  display: flex;
  flex-direction: column;

  ${media.greaterThan('md')} {
    flex: 0 0 50%;
    min-width: 0;
  }
`;

const ModalRightColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;

  ${media.lessThan('md')} {
    margin-top: 1.5rem;
  }
`;

const ModalMedia = styled.div<{ $coverImage?: string }>`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  background: ${({ theme, $coverImage }) =>
    $coverImage ? 'transparent' : theme.currentline};
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  ${media.greaterThan('md')} {
    width: 100%;
    aspect-ratio: auto;
    height: 100%;
    min-height: 400px;
    border-radius: 16px 0 0 16px;
  }

  ${({ $coverImage }) =>
    $coverImage &&
    `
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image: url(${$coverImage});
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      z-index: 0;
    }
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        180deg,
        rgba(0, 0, 0, 0.6) 0%,
        rgba(0, 0, 0, 0.3) 50%,
        rgba(0, 0, 0, 0.7) 100%
      );
      z-index: 1;
    }
  `}
`;

const ModalMediaTitle = styled.span`
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.text};
  text-align: center;
  padding: 1rem;
  line-height: 1.2;
  position: relative;
  z-index: 2;
`;

const ModalContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  overflow: hidden;

  ${media.greaterThan('md')} {
    padding: 0;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 0.75rem 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.currentline};
  margin-bottom: 1rem;
  flex-shrink: 0;
  flex-direction: column;

  ${media.greaterThan('md')} {
    padding-bottom: 1.5rem;
  }
`;

const ModalScrollArea = styled.div`
  flex: 1 1 auto;
  overflow-y: auto;
  min-height: 0;
  padding: 1.5rem;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.background};
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.purple};
    border-radius: 4px;
    border: 2px solid ${({ theme }) => theme.background};
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.purple}cc;
  }

  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.purple}
    ${({ theme }) => theme.background};
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
  padding-bottom: 1rem;
  line-height: 1.7;
  color: ${({ theme }) => theme.comment};
  margin: 0;
`;

const ModalHighlights = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-bottom: 1rem;
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

const ActionButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem;
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

const CardActions = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  margin-top: 0.5rem;

  ${media.greaterThan('md')} {
    justify-content: stretch;
  }

  ${media.lessThan('md')} {
    flex-direction: column;
    align-items: stretch;
  }
`;

const CardActionButton = styled(ActionButton)`
  flex: 1 1 0;
  justify-content: center;
  min-width: 0;

  ${media.lessThan('md')} {
    width: 100%;
  }
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
  coverImage?: string;
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
  coverImage?: string;
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
    coverColor: '#1a1a2e',
    coverImage: '/assets/MockupTelasMagalu.png'
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
    coverColor: '#16213e',
    coverImage: '/assets/MockupTelasEqseed.png'
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
    coverColor: '#0f0f23',
    coverImage:
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80'
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
    coverColor: '#1a1a2e',
    coverImage:
      'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80'
  },
  {
    id: 'featured2',
    name: 'projects.featured2.name',
    shortDesc: 'projects.featured2.shortDesc',
    technologies: ['Next.js', 'TypeScript', 'Styled Components', 'REST APIs'],
    type: 'internal',
    coverColor: '#16213e',
    coverImage:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80'
  },
  {
    id: 'featured3',
    name: 'projects.featured3.name',
    shortDesc: 'projects.featured3.shortDesc',
    technologies: ['React', 'TypeScript', 'VTEX IO', 'Sass'],
    type: 'internal',
    coverColor: '#0f0f23',
    coverImage:
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80'
  },
  {
    id: 'project4',
    name: 'projects.project4.name',
    shortDesc: 'projects.project4.shortDesc',
    technologies: ['TypeScript', 'Vite', 'TailwindCSS', 'GraphQL'],
    link: 'https://event-platform-eosantos.vercel.app',
    github: 'https://github.com/eosantos/event-platform',
    type: 'study',
    coverColor: '#1a1a2e',
    coverImage:
      'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&q=80'
  },
  {
    id: 'project5',
    name: 'projects.project5.name',
    shortDesc: 'projects.project5.shortDesc',
    technologies: ['React', 'TypeScript', 'Next.js', 'Material UI'],
    link: 'https://ecommerce-reactjs-app.vercel.app',
    github: 'https://github.com/eosantos/ecommerce-reactjs-app',
    type: 'training',
    coverColor: '#16213e',
    coverImage:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80'
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
        <CardCover
          $bgColor={project.coverColor}
          $coverImage={project.coverImage}
        >
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
              <TechTagComponent key={tech} icon={getTechIcon(tech)}>
                {tech}
              </TechTagComponent>
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
        <CardCover
          $bgColor={project.coverColor}
          $coverImage={project.coverImage}
        >
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
              <TechTagComponent key={tech} icon={getTechIcon(tech)}>
                {tech}
              </TechTagComponent>
            ))}
          </CardTechStack>
          {hasLinks && (
            <CardActions>
              {project.link && (
                <CardActionButton
                  as="a"
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${t('projects.viewProject')}: ${t(project.name)}`}
                >
                  <FaExternalLinkAlt aria-hidden="true" size={14} />
                  {t('projects.viewProject')}
                </CardActionButton>
              )}
              {project.github && (
                <CardActionButton
                  as="a"
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${t('projects.viewRepo')}: ${t(project.name)}`}
                >
                  <FaGithub aria-hidden="true" size={14} />
                  {t('projects.viewRepo')}
                </CardActionButton>
              )}
            </CardActions>
          )}
          {!hasLinks && (
            <CardActions>
              <ActionButtonSecondary>
                {t('projects.internalProject')}
              </ActionButtonSecondary>
            </CardActions>
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
  const scrollAreaRef = useRef<HTMLDivElement>(null);
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

  // Reset scroll position when project changes
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = 0;
    }
  }, [project]);

  if (!project) return null;

  const modalContent = (
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
          <ModalLeftColumn>
            <ModalMedia $coverImage={project.coverImage}>
              <ModalMediaTitle>{t(project.name)}</ModalMediaTitle>
            </ModalMedia>
          </ModalLeftColumn>
          <ModalRightColumn>
            <ModalContent>
              <ModalScrollArea ref={scrollAreaRef}>
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
                <ModalHighlightsTitle>
                  {t('projects.technologies')}
                </ModalHighlightsTitle>
                <ModalTechStack>
                  {project.technologies.map((tech) => (
                    <TechTagComponent key={tech} icon={getTechIcon(tech)}>
                      {tech}
                    </TechTagComponent>
                  ))}
                </ModalTechStack>
              </ModalScrollArea>
            </ModalContent>
          </ModalRightColumn>
        </ModalBody>
      </Modal>
    </ModalOverlay>
  );

  return createPortal(modalContent, document.body);
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
