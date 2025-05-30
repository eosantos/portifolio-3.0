'use client';

import { media } from '@/styles/media';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
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
    top: 0.75rem;
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
  const { t } = useTranslation();

  return (
    <Section id="sobre">
      <Photo>
        <Image src="/assets/sobre.svg" alt="Eduardo" width={330} height={330} />
      </Photo>

      <Content>
        <h2>{t('about.title')}</h2>

        <div className="subtitle-wrapper">
          <span className="subtitle">{t('about.subtitle')}</span>
        </div>

        <p dangerouslySetInnerHTML={{ __html: t('about.paragraph1') }} />
        <p dangerouslySetInnerHTML={{ __html: t('about.paragraph2') }} />
        <p dangerouslySetInnerHTML={{ __html: t('about.paragraph3') }} />
      </Content>
    </Section>
  );
}
