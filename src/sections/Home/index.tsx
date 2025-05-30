'use client';

import PerfilImage from '@/components/PerfilImage';
import { media } from '@/styles/media';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Container = styled.section`
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  ${media.greaterThan('md')} {
    padding: 6rem 4rem;
  }

  ${media.greaterThan('lg')} {
    flex-direction: row;
    text-align: left;
    justify-content: space-around;
  }
`;

const Content = styled.div`
  max-width: 600px;

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
  const { t } = useTranslation();

  return (
    <Container>
      <Content>
        <h1>{t('home.title')}</h1>
        <p>{t('home.description')}</p>
      </Content>
      <PerfilImage />
    </Container>
  );
}
