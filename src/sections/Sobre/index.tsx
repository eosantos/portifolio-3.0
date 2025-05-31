'use client';

import { media } from '@/styles/media';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Section = styled.section`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  margin: 0 auto;

  ${media.greaterThan('lg')} {
    flex-direction: row;
    text-align: left;
    max-width: 1280px;
    place-self: center;
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
  h2 {
    font-size: 2.25rem; /* 36px */
    font-weight: 300;
    margin: 0;
    color: ${({ theme }) => theme.text};
    height: 45px;
  }

  .subtitle-wrapper {
    position: relative;
    margin-bottom: 1.5rem;
  }

  .subtitle {
    display: inline-block;
    font-size: 4.25rem;
    font-weight: 700;
    background: ${({ theme }) => theme.purple};
    position: relative;
    top: 0.75rem;
    padding: 0 0.2em 0 0.2em; /* menos padding na parte inferior */
    line-height: 1;
    overflow: visible;
  }

  p {
    font-size: 1.25rem; /* 20px */
    line-height: 2;
    margin: 0;
    color: ${({ theme }) => theme.text};

    strong {
      color: ${({ theme }) => theme.orange};
      font-weight: 600;
    }
  }
`;

const ParagraphWrapper = styled.div`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;

  p {
    font-size: 1.25rem;
    line-height: 2;
    color: ${({ theme }) => theme.text};
    margin: 30px;

    strong {
      color: ${({ theme }) => theme.orange};
      font-weight: 600;
    }

    &:not(:last-child) {
      margin-bottom: 1.5rem;
      margin: 30px;
    }
  }
`;

export default function AboutSection() {
  const { t } = useTranslation();

  return (
    <>
      <Section id="sobre">
        <Photo>
          <Image
            src="/assets/sobre.svg"
            alt="Eduardo"
            width={330}
            height={330}
          />
        </Photo>

        <Content>
          <h2>{t('about.title')}</h2>

          <div className="subtitle-wrapper">
            <span className="subtitle">{t('about.subtitle')}</span>
          </div>

          <p dangerouslySetInnerHTML={{ __html: t('about.paragraph0') }} />
          <p dangerouslySetInnerHTML={{ __html: t('about.paragraph1') }} />
        </Content>
      </Section>

      <ParagraphWrapper>
        <p dangerouslySetInnerHTML={{ __html: t('about.paragraph2') }} />
        <p dangerouslySetInnerHTML={{ __html: t('about.paragraph3') }} />
      </ParagraphWrapper>
    </>
  );
}
