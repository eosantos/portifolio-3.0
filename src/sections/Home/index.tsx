'use client';

import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { media } from '@/styles/media';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Container = styled.section`
  position: relative;
  z-index: 10;
  padding: clamp(2.25rem, 4vh, 4rem) 2rem clamp(2rem, 5vh, 3.5rem)
  margin: 0 auto;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  will-change: transform, opacity;

  ${media.greaterThan('md')} {
    padding-left: 4rem;
    padding-right: 4rem;
  }

  ${media.greaterThan('lg')} {
    height: 100vh;
    height: 100dvh;
    min-height: 600px;
    flex-direction: row;
    align-items: center;
    gap: 4rem;
    overflow: hidden;
  }
`;

const HeroMain = styled.div`
  flex: 1 1 auto;
  min-width: 0;
`;

const HeroAside = styled.aside`
  margin-top: 2.5rem;
  max-width: 420px;
  will-change: transform, opacity;

  ${media.greaterThan('lg')} {
    margin-top: 0;
    flex: 0 0 300px;
    align-self: center;
    border-left: 1px solid ${({ theme }) => theme.currentline};
    padding-left: 2rem;
  }

  @media (max-height: 750px) {
    margin-top: 1.5rem;
  }
`;

const StatusBadge = styled.p`
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  margin: 0 0 1.25rem;
  padding: 0.5rem 1rem;
  border: 1px solid ${({ theme }) => theme.currentline};
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.text};
  white-space: nowrap;
`;

const StatusDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ theme }) => theme.purple};
  flex-shrink: 0;
  animation: pulse 2.4s ease-in-out infinite;

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
      box-shadow: 0 0 0 0 ${({ theme }) => theme.purple}66;
    }
    50% {
      opacity: 0.7;
      box-shadow: 0 0 0 6px transparent;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const HighlightsList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
`;

const HighlightsItem = styled.li`
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  font-size: 0.95rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.text};
  line-height: 1.5;

  &::before {
    content: '—';
    color: ${({ theme }) => theme.comment};
    flex-shrink: 0;
  }

  ${media.greaterThan('md')} {
    font-size: 1rem;
  }
`;

const Eyebrow = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.purple};
  margin: 0 0 1.25rem;

  ${media.greaterThan('md')} {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }
`;

const Display = styled.h1`
  margin: 0;
  font-weight: 700;
  line-height: 0.92;
  letter-spacing: -0.03em;
  color: ${({ theme }) => theme.text};
  font-size: clamp(2.75rem, 9vw, 7rem);
  text-wrap: balance;

  ${media.greaterThan('md')} {
    font-size: clamp(3.5rem, 8.5vw, 7.5rem);
  }

  @media (max-height: 750px) {
    font-size: clamp(2.25rem, 7vh, 3.5rem);
  }
`;

const DisplayLine = styled.span`
  display: block;
  will-change: transform, opacity;
  overflow: hidden;
`;

const Meta = styled.div`
  margin-top: 2rem;
  max-width: 640px;
  will-change: transform, opacity;

  ${media.greaterThan('md')} {
    margin-top: 2.25rem;
  }

  @media (max-height: 750px) {
    margin-top: 1.25rem;
  }
`;

const Stacks = styled.p`
  font-size: 1.15rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.text};
  font-weight: 500;
  margin: 0;

  ${media.greaterThan('md')} {
    font-size: 1.35rem;
  }
`;

const Description = styled.p`
  font-size: 1.05rem;
  margin-top: 1rem;
  line-height: 1.7;
  color: ${({ theme }) => theme.comment};
  font-weight: 400;

  ${media.greaterThan('md')} {
    font-size: 1.15rem;
  }
`;

const CtaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 2rem;
  align-items: center;

  @media (max-height: 750px) {
    margin-top: 1.25rem;
  }
`;

const PrimaryCta = styled.a`
  display: inline-flex;
  align-items: center;
  padding: 1rem 2rem;
  border-radius: 999px;
  background: ${({ theme }) => theme.purple};
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    opacity: 0.92;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.purple};
    outline-offset: 3px;
  }
`;

const SkipLink = styled.a`
  display: inline-flex;
  align-items: center;
  padding: 1rem 1.25rem;
  color: ${({ theme }) => theme.comment};
  font-size: 0.95rem;
  font-weight: 500;
  text-decoration: underline;
  text-underline-offset: 4px;
  text-decoration-thickness: 1px;
  transition:
    color 0.2s ease,
    opacity 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.text};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.purple};
    outline-offset: 3px;
    border-radius: 4px;
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

  @media (max-height: 800px) {
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

  const eyebrowRef = useRef<HTMLParagraphElement | null>(null);
  const lineRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const stacksRef = useRef<HTMLParagraphElement | null>(null);
  const descRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const asideRef = useRef<HTMLElement | null>(null);
  const indicatorRef = useRef<HTMLDivElement | null>(null);

  // Entrance timeline: runs once on mount (not scroll-driven, not repeated).
  // Targets are plain styled nodes; Framer Motion owns the parent motion.*
  // nodes for scroll, so the two libraries never write to the same node.
  useEffect(() => {
    if (isReducedMotion) return;

    const targets = [
      eyebrowRef.current,
      ...lineRefs.current,
      stacksRef.current,
      descRef.current,
      ctaRef.current,
      asideRef.current,
      indicatorRef.current
    ].filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.set(eyebrowRef.current, { autoAlpha: 0, y: 16 });
      gsap.set(lineRefs.current, { yPercent: 110 });
      gsap.set(
        [stacksRef.current, descRef.current, ctaRef.current, asideRef.current],
        {
          autoAlpha: 0,
          y: 24
        }
      );
      gsap.set(indicatorRef.current, { autoAlpha: 0 });

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.to(eyebrowRef.current, { autoAlpha: 1, y: 0, duration: 0.35 }, 0.05)
        .to(
          lineRefs.current,
          { yPercent: 0, duration: 0.6, stagger: 0.08 },
          0.15
        )
        .to(stacksRef.current, { autoAlpha: 1, y: 0, duration: 0.45 }, 0.55)
        .to(descRef.current, { autoAlpha: 1, y: 0, duration: 0.45 }, 0.65)
        .to(ctaRef.current, { autoAlpha: 1, y: 0, duration: 0.45 }, 0.75)
        .to(asideRef.current, { autoAlpha: 1, y: 0, duration: 0.45 }, 0.8)
        .to(indicatorRef.current, { autoAlpha: 1, duration: 0.4 }, 0.9);
    });

    return () => {
      ctx.revert();
    };
  }, [isReducedMotion]);

  // Hero progress: 0 to 1 over first 60% of page scroll
  const heroProgress = useTransform(scrollYProgress, [0, 0.6], [0, 1]);

  // Kinetic type: each display line drifts at a different speed (depth)
  const lineAY = useTransform(heroProgress, [0, 1], [0, 50]);
  const lineBY = useTransform(heroProgress, [0, 1], [0, 90]);
  const lineCY = useTransform(heroProgress, [0, 1], [0, 130]);
  const displayOpacity = useTransform(heroProgress, [0, 0.55], [1, 0]);

  // Meta block fades faster so CTAs hand over to the next scene
  const metaOpacity = useTransform(heroProgress, [0, 0.4], [1, 0]);
  const metaY = useTransform(heroProgress, [0, 1], [0, 40]);

  // Eyebrow lifts away first
  const eyebrowOpacity = useTransform(heroProgress, [0, 0.25], [1, 0]);

  // Indicator fades immediately
  const indicatorOpacity = useTransform(heroProgress, [0, 0.2], [1, 0]);

  // Aside drifts with the scene, slightly slower than the main block
  const asideOpacity = useTransform(heroProgress, [0, 0.45], [1, 0]);
  const asideY = useTransform(heroProgress, [0, 1], [0, 30]);

  if (isReducedMotion) {
    return (
      <Container id="home">
        <HeroMain>
          <Eyebrow>{t('home.eyebrow')}</Eyebrow>
          <Display>
            <DisplayLine>{t('home.displayA')}</DisplayLine>
            <DisplayLine>{t('home.displayB')}</DisplayLine>
            <DisplayLine>{t('home.displayC')}</DisplayLine>
          </Display>
          <Meta>
            <Stacks>{t('home.headline')}</Stacks>
            <Description>{t('home.description')}</Description>
            <CtaRow>
              <PrimaryCta href="#contato">{t('home.contactCta')}</PrimaryCta>
              <SkipLink href="#sobre">{t('home.skipIntro')}</SkipLink>
            </CtaRow>
          </Meta>
        </HeroMain>
        <HeroAside aria-label={t('home.statusBadge')}>
          <StatusBadge>
            <StatusDot aria-hidden="true" />
            {t('home.statusBadge')}
          </StatusBadge>
          <HighlightsList>
            <HighlightsItem>{t('home.highlight1')}</HighlightsItem>
            <HighlightsItem>{t('home.highlight2')}</HighlightsItem>
            <HighlightsItem>{t('home.highlight3')}</HighlightsItem>
          </HighlightsList>
        </HeroAside>
      </Container>
    );
  }

  return (
    <Container id="home">
      <HeroMain>
        <motion.div style={{ opacity: eyebrowOpacity }}>
          <Eyebrow ref={eyebrowRef}>{t('home.eyebrow')}</Eyebrow>
        </motion.div>

        <Display
          aria-label={`${t('home.displayA')} ${t('home.displayB')} ${t('home.displayC')}`}
        >
          <DisplayLine
            aria-hidden="true"
            ref={(el) => {
              lineRefs.current[0] = el;
            }}
          >
            <motion.span
              style={{ y: lineAY, opacity: displayOpacity, display: 'block' }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {t('home.displayA')}
            </motion.span>
          </DisplayLine>
          <DisplayLine
            aria-hidden="true"
            ref={(el) => {
              lineRefs.current[1] = el;
            }}
          >
            <motion.span
              style={{ y: lineBY, opacity: displayOpacity, display: 'block' }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {t('home.displayB')}
            </motion.span>
          </DisplayLine>
          <DisplayLine
            aria-hidden="true"
            ref={(el) => {
              lineRefs.current[2] = el;
            }}
          >
            <motion.span
              style={{ y: lineCY, opacity: displayOpacity, display: 'block' }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {t('home.displayC')}
            </motion.span>
          </DisplayLine>
        </Display>

        <motion.div
          style={{ opacity: metaOpacity, y: metaY }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Meta>
            <Stacks ref={stacksRef}>{t('home.headline')}</Stacks>
            <Description ref={descRef}>{t('home.description')}</Description>
            <CtaRow ref={ctaRef}>
              <PrimaryCta href="#contato">{t('home.contactCta')}</PrimaryCta>
              <SkipLink href="#sobre">{t('home.skipIntro')}</SkipLink>
            </CtaRow>
          </Meta>
        </motion.div>
      </HeroMain>

      <motion.div
        style={{ opacity: asideOpacity, y: asideY }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <HeroAside ref={asideRef} aria-label={t('home.statusBadge')}>
          <StatusBadge>
            <StatusDot aria-hidden="true" />
            {t('home.statusBadge')}
          </StatusBadge>
          <HighlightsList>
            <HighlightsItem>{t('home.highlight1')}</HighlightsItem>
            <HighlightsItem>{t('home.highlight2')}</HighlightsItem>
            <HighlightsItem>{t('home.highlight3')}</HighlightsItem>
          </HighlightsList>
        </HeroAside>
      </motion.div>

      <motion.div
        style={{ opacity: indicatorOpacity }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <ScrollIndicator ref={indicatorRef}>
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
