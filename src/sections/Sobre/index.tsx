'use client';

import Reveal from '@/components/Reveal';
import { media } from '@/styles/media';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Section = styled.section`
  position: relative;
  z-index: 5;
  max-width: 1280px;
  margin: 0 auto;
  padding: 6rem 2rem;

  ${media.greaterThan('md')} {
    padding: 8rem 4rem;
  }
`;

const Eyebrow = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.purple};
  margin: 0 0 2rem;

  ${media.greaterThan('md')} {
    font-size: 1rem;
  }
`;

const PullQuote = styled.blockquote`
  margin: 0 0 4rem;
  max-width: 900px;
  font-size: clamp(1.9rem, 4.5vw, 3.25rem);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.text};

  ${media.greaterThan('md')} {
    margin-bottom: 5rem;
  }
`;

const QuoteMark = styled.span`
  color: ${({ theme }) => theme.purple};
`;

const Grid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;

  ${media.greaterThan('lg')} {
    flex-direction: row;
    gap: 4rem;
    align-items: flex-start;
  }
`;

const Photo = styled.div`
  flex-shrink: 0;
  width: 100%;
  max-width: 330px;
  aspect-ratio: 1 / 1;
  border-radius: 12px;
  overflow: hidden;
  margin: 0 auto;

  ${media.greaterThan('lg')} {
    margin: 0;
    position: sticky;
    top: 6rem;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Body = styled.div`
  flex: 1 1 auto;
  min-width: 0;

  p {
    font-size: 1.125rem;
    line-height: 1.8;
    margin: 0;
    color: ${({ theme }) => theme.text};

    & + p {
      margin-top: 1.5rem;
    }

    ${media.greaterThan('md')} {
      font-size: 1.25rem;
    }
  }
`;

const Tags = styled.ul`
  list-style: none;
  margin: 2.5rem 0 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const Tag = styled.li`
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.currentline};
  border-radius: 999px;
  padding: 0.5rem 1rem;
  white-space: nowrap;
`;

export default function AboutSection() {
  const { t } = useTranslation();

  return (
    <Section id="sobre" aria-labelledby="sobre-quote">
      <Reveal>
        <Eyebrow>{t('nav.about')}</Eyebrow>
      </Reveal>

      <Reveal delay={100}>
        <PullQuote id="sobre-quote">
          <QuoteMark aria-hidden="true">“</QuoteMark>
          {t('about.quote')}
          <QuoteMark aria-hidden="true">”</QuoteMark>
        </PullQuote>
      </Reveal>

      <Grid>
        <Reveal delay={150}>
          <Photo>
            <Image
              src="/assets/sobre.svg"
              alt="Eduardo"
              width={330}
              height={330}
            />
          </Photo>
        </Reveal>

        <Body>
          <Reveal delay={200}>
            <p>{t('about.body1')}</p>
          </Reveal>
          <Reveal delay={300}>
            <p>{t('about.body2')}</p>
          </Reveal>
          <Reveal delay={350}>
            <p>{t('about.body3')}</p>
          </Reveal>
          <Reveal delay={400}>
            <Tags aria-label={t('nav.about')}>
              <Tag>{t('about.tag1')}</Tag>
              <Tag>{t('about.tag2')}</Tag>
              <Tag>{t('about.tag3')}</Tag>
              <Tag>{t('about.tag4')}</Tag>
            </Tags>
          </Reveal>
        </Body>
      </Grid>
    </Section>
  );
}
