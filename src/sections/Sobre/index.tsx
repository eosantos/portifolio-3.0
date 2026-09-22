'use client';

import { motion } from 'framer-motion';
import { media } from '@/styles/media';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { useScrollYProgress } from '@/hooks/useScrollProgress';
import styled from 'styled-components';

const Section = styled.section`
  position: relative;
  z-index: 5;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  margin: 0 auto;
  background: ${({ theme }) => theme.background};

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
  will-change: transform, opacity;

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
  const { scrollYProgress, isReducedMotion } = useScrollYProgress();

  const scrollProgress = scrollYProgress.get();
  const sectionProgress = isReducedMotion
    ? 1
    : scrollProgress > 0.2
      ? Math.min((scrollProgress - 0.2) * 2.5, 1)
      : 0;

  const photoOpacity = isReducedMotion ? 1 : sectionProgress;
  const photoTranslateY = isReducedMotion ? 0 : (1 - sectionProgress) * 40;
  const contentOpacity = isReducedMotion ? 1 : sectionProgress * 1.2;
  const contentTranslateY = isReducedMotion ? 0 : (1 - sectionProgress) * 30;
  const subtitleScale = isReducedMotion ? 1 : sectionProgress;
  const subtitleOpacity = isReducedMotion
    ? 1
    : sectionProgress > 0
      ? sectionProgress
      : 0;
  const paragraphOpacity = isReducedMotion
    ? 1
    : sectionProgress > 0.3
      ? (sectionProgress - 0.3) * 1.5
      : 0;
  const paragraphTranslateY = isReducedMotion
    ? 0
    : (1 - Math.min(sectionProgress * 1.5, 1)) * 30;

  return (
    <>
      <Section id="sobre">
        <motion.div
          style={{
            opacity: photoOpacity,
            transform: `translateY(${photoTranslateY}px)`
          }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Photo>
            <Image
              src="/assets/sobre.svg"
              alt="Eduardo"
              width={330}
              height={330}
            />
          </Photo>
        </motion.div>

        <motion.div
          style={{
            opacity: contentOpacity,
            transform: `translateY(${contentTranslateY}px)`
          }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Content>
            <motion.h2
              style={{ opacity: contentOpacity }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {t('about.title')}
            </motion.h2>

            <motion.div
              className="subtitle-wrapper"
              style={{
                opacity: subtitleOpacity,
                transform: `scale(${subtitleScale})`,
                transformOrigin: 'left center'
              }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <span className="subtitle">{t('about.subtitle')}</span>
            </motion.div>

            <motion.p
              dangerouslySetInnerHTML={{ __html: t('about.paragraph0') }}
              style={{
                opacity: paragraphOpacity,
                transform: `translateY(${paragraphTranslateY}px)`
              }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
            <motion.p
              dangerouslySetInnerHTML={{ __html: t('about.paragraph1') }}
              style={{
                opacity: paragraphOpacity,
                transform: `translateY(${paragraphTranslateY}px)`
              }}
              transition={{
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.1
              }}
            />
          </Content>
        </motion.div>
      </Section>

      <motion.div
        style={{
          opacity: paragraphOpacity,
          transform: `translateY(${paragraphTranslateY}px)`
        }}
        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
      >
        <ParagraphWrapper>
          <motion.p
            dangerouslySetInnerHTML={{ __html: t('about.paragraph2') }}
            style={{ opacity: paragraphOpacity }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
          <motion.p
            dangerouslySetInnerHTML={{ __html: t('about.paragraph3') }}
            style={{ opacity: paragraphOpacity }}
            transition={{
              duration: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.1
            }}
          />
        </ParagraphWrapper>
      </motion.div>
    </>
  );
}
