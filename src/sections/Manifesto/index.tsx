'use client';

import Reveal from '@/components/Reveal';
import { media } from '@/styles/media';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Section = styled.section`
  position: relative;
  z-index: 5;
  max-width: 1280px;
  margin: 0 auto;
  padding: 5rem 2rem;
  text-align: center;
  background: ${({ theme }) => theme.background};

  ${media.greaterThan('md')} {
    padding: 7rem 4rem;
  }
`;

const Words = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: center;
  gap: 0.75rem 1.25rem;
`;

const Word = styled.span`
  font-size: clamp(2.5rem, 7vw, 5rem);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.text};
  white-space: nowrap;
`;

const Separator = styled.span`
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 300;
  color: ${({ theme }) => theme.purple};
  user-select: none;
`;

const Tagline = styled.p`
  margin: 2rem auto 0;
  max-width: 560px;
  font-size: 1.125rem;
  line-height: 1.7;
  color: ${({ theme }) => theme.comment};
  font-weight: 400;

  ${media.greaterThan('md')} {
    font-size: 1.25rem;
  }
`;

const words = ['code', 'create', 'inspire'] as const;

export default function ManifestoSection() {
  const { t } = useTranslation();

  return (
    <Section id="manifesto" aria-label={t('manifesto.label')}>
      <Words>
        {words.map((word, index) => (
          <Reveal key={word} delay={index * 120} y={20}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'baseline',
                gap: '1.25rem'
              }}
            >
              <Word>{t(`identity.${word}`)}</Word>
              {index < words.length - 1 && (
                <Separator aria-hidden="true">→</Separator>
              )}
            </span>
          </Reveal>
        ))}
      </Words>
      <Reveal delay={360} y={16}>
        <Tagline>{t('manifesto.tagline')}</Tagline>
      </Reveal>
    </Section>
  );
}
