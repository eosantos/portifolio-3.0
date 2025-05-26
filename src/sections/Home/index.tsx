'use client';

import PerfilImage from '@/components/PerfilImage';
import { media } from '@/styles/media';
import styled from 'styled-components';

const Container = styled.section`
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  ${media.greaterThan('md')} {
    padding: 6rem 0rem;
  }

  ${media.greaterThan('lg')} {
    flex-direction: row;
    text-align: left;
    justify-content: space-around;
  }
`;

const Content = styled.div`
  max-width: 600px;
  align-items: center;

  ${media.greaterThan('lg')} {
    padding: 0rem 3rem;
  }

  h1 {
    font-size: 2.4rem;
    color: ${({ theme }) => theme.text};

    ${media.greaterThan('md')} {
      font-size: 3.2rem;
    }

    ${media.greaterThan('lg')} {
      font-size: 4rem;
    }
  }

  p {
    font-size: 1.2rem;
    margin-top: 1rem;
    line-height: 1.6;
    color: ${({ theme }) => theme.text};

    ${media.greaterThan('md')} {
      font-size: 1.4rem;
    }
  }
`;

export default function HomeSection() {
  return (
    <Container>
      <Content>
        <h1>Olá, eu sou o Eduardo 👋</h1>
        <p>
          Desenvolvedor Front-end com foco em interfaces performáticas,
          acessíveis e com ótimo design. Vamos criar algo incrível juntos?
        </p>
      </Content>
      <PerfilImage />
    </Container>
  );
}
