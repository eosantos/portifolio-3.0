// src/sections/About/index.tsx
'use client';

import { media } from '@/styles/media';
import Image from 'next/image';
import styled from 'styled-components';

const Section = styled.section`
  padding: 6rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;

  ${media.greaterThan('lg')} {
    flex-direction: row;
    text-align: left;
    justify-content: space-evenly;
    align-items: flex-start;
  }
`;

const Photo = styled.div`
  flex-shrink: 0;
  width: 330px;
  height: 330px;
  border-radius: 12px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Content = styled.div`
  max-width: 800px;

  h2 {
    font-size: 2.25rem; /* 36px */
    font-weight: 300;
    margin-bottom: 1rem;
    color: ${({ theme }) => theme.text};
  }

  .subtitle-wrapper {
    position: relative;
    margin-bottom: 1.5rem;
  }

  .subtitle {
    display: inline-block;
    font-size: 1.25rem;
    font-weight: 500;
    padding: 0.5rem 1rem;
    background: ${({ theme }) => theme.background};
    border: 2px solid ${({ theme }) => theme.text};
    position: relative;
    top: 0.75rem; /* faz o “overflow” para baixo */
  }

  p {
    font-size: 1.25rem; /* 20px */
    line-height: 1.6;
    color: ${({ theme }) => theme.text};

    strong {
      color: ${({ theme }) => theme.orange};
      font-weight: 600;
    }
  }
`;

export default function AboutSection() {
  return (
    <Section id="sobre">
      <Photo>
        <Image src="/assets/sobre.svg" alt="Eduardo" width={330} height={330} />
      </Photo>

      <Content>
        <h2>sobre mim</h2>

        <div className="subtitle-wrapper">
          <span className="subtitle">quem eu sou</span>
        </div>

        <p>
          Meu nome é <strong>Eduardo Oliveira</strong>. <br />
          Sou desenvolvedor
          <strong>front-end</strong> com sólida experiência em{' '}
          <strong>ReactJS</strong>, <strong>JavaScript</strong> e{' '}
          <strong>TypeScript</strong>, e atualmente focado em projetos com{' '}
          <strong>Next.js</strong>. Tenho paixão por criar interfaces
          responsivas e intuitivas, buscando sempre a melhor experiência de
          usuário. Utilizo ferramentas como <strong>Styled-Components</strong> e{' '}
          <strong>SASS</strong> para layouts modernos e funcionais.
          <br />
          <br />
        </p>
        <p>
          Minha experiência inclui <strong>Redux</strong> para state management,
          <strong> Axios</strong> para requisições HTTP e recursos do{' '}
          <strong>Next.js</strong> como API Routes e SSR. Também trabalho com{' '}
          <strong>NodeJS</strong>, <strong>Bootstrap</strong>,{' '}
          <strong>MUI</strong>, <strong>Jest</strong>, <strong>Cypress</strong>,{' '}
          <strong>SQL</strong> e <strong>Docker</strong>. Utilizo{' '}
          <strong>Figma</strong> para wireframes e protótipos.
          <br />
          <br />
          Tenho conhecimentos em arquitetura de software e metodologias ágeis
          (Scrum, Kanban) e estudo <strong>Node.js</strong> para me tornar
          full-stack. Estou aberto a oportunidades e desafios empolgantes na
          indústria de tecnologia. Sinta-se à vontade para entrar em contato!
        </p>
      </Content>
    </Section>
  );
}
