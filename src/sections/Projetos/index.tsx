'use client';

import { media } from '@/styles/media';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Section = styled.section`
  padding: 2rem;
  max-width: 1280px;
  margin: 0 auto;

  ${media.greaterThan('md')} {
    padding: 4rem;
  }
`;

const Title = styled.h2`
  font-size: 2.25rem;
  font-weight: 300;
  color: ${({ theme }) => theme.text};
  margin-bottom: 2rem;

  ${media.greaterThan('md')} {
    font-size: 3rem;
  }
`;

const ProjectsGrid = styled.div`
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
  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.currentline};
  border-radius: 12px;
  padding: 1.5rem;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  }

  h3 {
    font-size: 1.25rem;
    color: ${({ theme }) => theme.text};
    margin: 0 0 0.5rem;
  }

  p {
    font-size: 1rem;
    color: ${({ theme }) => theme.comment};
    line-height: 1.6;
    margin: 0 0 1rem;
  }
`;

const TechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const TechTag = styled.span`
  font-size: 0.75rem;
  background: ${({ theme }) => theme.currentline};
  color: ${({ theme }) => theme.purple};
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-weight: 500;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${({ theme }) => theme.comment};

  p {
    margin: 0.5rem 0;
  }
`;

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  github?: string;
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'E-commerce Platform',
    description: 'Full-stack e-commerce with Next.js, Stripe, and PostgreSQL',
    technologies: ['Next.js', 'TypeScript', 'Prisma', 'Stripe', 'Tailwind'],
    link: 'https://example.com',
    github: 'https://github.com'
  },
  {
    id: '2',
    name: 'Task Management App',
    description: 'Real-time collaborative task manager with drag-and-drop',
    technologies: ['React', 'Redux', 'Socket.io', 'Node.js', 'MongoDB'],
    link: 'https://example.com',
    github: 'https://github.com'
  },
  {
    id: '3',
    name: 'Design System',
    description: 'Accessible component library with Storybook and Chromatic',
    technologies: [
      'React',
      'TypeScript',
      'Styled Components',
      'Storybook',
      'Jest'
    ],
    link: 'https://example.com',
    github: 'https://github.com'
  }
];

export default function ProjetosSection() {
  const { t } = useTranslation();

  return (
    <Section id="projetos" aria-labelledby="projetos-title">
      <Title id="projetos-title">{t('projects.title')}</Title>

      {mockProjects.length > 0 ? (
        <ProjectsGrid>
          {mockProjects.map((project) => (
            <ProjectCard key={project.id}>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <TechStack>
                {project.technologies.map((tech) => (
                  <TechTag key={tech}>{tech}</TechTag>
                ))}
              </TechStack>
            </ProjectCard>
          ))}
        </ProjectsGrid>
      ) : (
        <EmptyState>
          <p>{t('projects.empty')}</p>
        </EmptyState>
      )}
    </Section>
  );
}
