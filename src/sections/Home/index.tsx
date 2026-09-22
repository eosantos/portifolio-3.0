'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import PerfilImage from '@/components/PerfilImage';
import { media } from '@/styles/media';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Container = styled.section`
  position: relative;
  z-index: 10;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  max-width: 1280px;
  margin: 0 auto;
  align-items: center;
  text-align: center;
  min-height: 100vh;
  will-change: transform, opacity;

  ${media.greaterThan('md')} {
    padding: 6rem 4rem;
  }

  ${media.greaterThan('lg')} {
    flex-direction: row;
    text-align: left;
    justify-content: space-between;
    align-items: center;
  }
`;

const Content = styled.div`
  max-width: 600px;
  flex-shrink: 0;
  will-change: transform, opacity;

  h1 {
    font-size: 2.4rem;
    color: ${({ theme }) => theme.text};
    line-height: 1.1;
    font-weight: 300;

    ${media.greaterThan('md')} {
      font-size: 3.2rem;
    }

    ${media.greaterThan('lg')} {
      font-size: 4.5rem;
    }
  }

  p {
    font-size: 1.2rem;
    margin-top: 1.5rem;
    line-height: 1.6;
    color: ${({ theme }) => theme.text};
    font-weight: 300;

    ${media.greaterThan('md')} {
      font-size: 1.4rem;
    }
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 40%;
  aspect-ratio: 1 / 1;
  border-radius: 12px;
  flex-shrink: 0;
  will-change: transform, opacity;

  ${media.lessThan('lg')} {
    width: 100%;
    aspect-ratio: 1 / 1;
    margin-top: 0;
    order: -1;
  }

  ${media.greaterThan('lg')} {
    width: 45%;
  }
`;

const ScrollIndicator = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.comment};
  font-size: 0.875rem;
  opacity: 0.6;
  pointer-events: none;
  z-index: 5;

  ${media.lessThan('md')} {
    display: none;
  }

  svg {
    width: 24px;
    height: 24px;
    animation: bounce 2s ease-in-out infinite;
  }

  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(8px);
    }
  }
`;

export default function HomeSection() {
  const { t } = useTranslation();
  const { scrollYProgress } = useScroll();
  const isReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Create transformed values using Framer Motion's useTransform
  // Hero progress: 0 to 1 over first 60% of scroll
  const heroProgress = useTransform(scrollYProgress, [0, 0.6], [0, 1]);

  // Title scale: 1 -> 0.8 over hero progress
  const titleScale = useTransform(heroProgress, [0, 1], [1, 0.8]);

  // Title opacity: 1 -> 0 over hero progress
  const titleOpacity = useTransform(heroProgress, [0, 0.5], [1, 0]);

  // Description opacity: 1 -> 0 over hero progress (faster fade)
  const descriptionOpacity = useTransform(heroProgress, [0, 0.5], [1, 0]);

  // Content translate Y: 0 -> 60px
  const contentTranslateY = useTransform(heroProgress, [0, 1], [0, 60]);

  // Image scale: 1 -> 0.75
  const imageScale = useTransform(heroProgress, [0, 1], [1, 0.75]);

  // Image opacity: 1 -> 0.5
  const imageOpacity = useTransform(heroProgress, [0, 1], [1, 0.5]);

  // Image translate Y: 0 -> -40px
  const imageTranslateY = useTransform(heroProgress, [0, 1], [0, -40]);

  // Indicator opacity: 1 -> 0
  const indicatorOpacity = useTransform(heroProgress, [0, 0.3], [1, 0]);

  if (isReducedMotion) {
    // For reduced motion, return static values
    return (
      <Container id="home">
        <Container style={{ minHeight: '100vh' }}>
          <Content>
            <motion.h1
              style={{
                opacity: 1,
                transform: 'scale(1)',
                transformOrigin: 'left top'
              }}
              transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {t('home.title')}
            </motion.h1>
            <motion.p
              style={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {t('home.description')}
            </motion.p>
          </Content>
          <ImageWrapper>
            <PerfilImage />
          </ImageWrapper>
        </Container>
      </Container>
    );
  }

  return (
    <Container id="home">
      <motion.div
        style={{
          opacity: descriptionOpacity,
          transform: contentTranslateY
        }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <Content>
          <motion.h1
            style={{
              opacity: titleOpacity,
              transform: titleScale
            }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {t('home.title')}
          </motion.h1>
          <motion.p
            style={{ opacity: descriptionOpacity }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {t('home.description')}
          </motion.p>
        </Content>
      </motion.div>

      <motion.div
        style={{
          opacity: imageOpacity,
          transform: imageScale,
          y: imageTranslateY,
          transformOrigin: 'center center'
        }}
        transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <ImageWrapper>
          <PerfilImage />
        </ImageWrapper>
      </motion.div>

      <motion.div
        style={{ opacity: indicatorOpacity }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <ScrollIndicator>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
          <span>Scroll</span>
        </ScrollIndicator>
      </motion.div>
    </Container>
  );
}
