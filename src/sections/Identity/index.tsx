'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import { media } from '@/styles/media';
import styled from 'styled-components';

gsap.registerPlugin(ScrollTrigger);

const Container = styled.section`
  position: relative;
  z-index: 5;
  background: ${({ theme }) => theme.background};
  overflow: hidden;
`;

const Stage = styled.div`
  position: relative;
  height: 100vh;
  height: 100svh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WordsContainer = styled.div`
  position: relative;
  z-index: 10;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const WordWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  text-align: center;
  will-change: transform, opacity;
  pointer-events: none;
  width: 100%;
  padding: 0 1rem;
`;

const WordHeading = styled.h1`
  font-size: clamp(3.5rem, 11vw, 12rem);
  font-weight: 700;
  line-height: 1;
  color: ${({ theme }) => theme.text};
  letter-spacing: -0.02em;
  white-space: nowrap;
  margin: 0;
  will-change: transform, opacity;

  ${media.lessThan('md')} {
    font-size: clamp(2.75rem, 13vw, 5rem);
    white-space: normal;
  }
`;

const WordSub = styled.div`
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  align-items: center;
  opacity: 0;
`;

const WordSubLine = styled.span`
  display: block;
  font-size: clamp(0.95rem, 2vw, 1.25rem);
  font-weight: 300;
  color: ${({ theme }) => theme.comment};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0;
  will-change: opacity, transform;
`;

const ProgressIndicator = styled.div`
  position: absolute;
  bottom: 2.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  z-index: 20;
  pointer-events: none;
  opacity: 0.7;

  ${media.lessThan('md')} {
    bottom: 1.75rem;
  }
`;

const ProgressBar = styled.div`
  width: 60px;
  height: 2px;
  background: ${({ theme }) => theme.currentline};
  border-radius: 1px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  width: 0%;
  height: 100%;
  background: ${({ theme }) => theme.purple};
  will-change: width;
`;

const ScrollLabel = styled.span`
  font-size: 0.7rem;
  color: ${({ theme }) => theme.comment};
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-weight: 500;
`;

const ContentBelow = styled.div`
  position: relative;
  z-index: 1;
  padding: 6rem 2rem 8rem;
  background: ${({ theme }) => theme.background};

  ${media.greaterThan('md')} {
    padding: 8rem 4rem 10rem;
  }
`;

const TransitionContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  color: ${({ theme }) => theme.text};
`;

const TransitionTitle = styled.h2`
  font-size: clamp(1.75rem, 4.5vw, 3rem);
  font-weight: 300;
  margin-bottom: 1.5rem;
  letter-spacing: -0.01em;
`;

const TransitionText = styled.p`
  font-size: 1.125rem;
  line-height: 1.8;
  color: ${({ theme }) => theme.comment};
  max-width: 600px;
  margin: 0 auto;

  ${media.lessThan('md')} {
    font-size: 1rem;
  }
`;

const SrOnly = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

const words = [
  { id: 'code', label: 'code' },
  { id: 'create', label: 'create' },
  { id: 'inspire', label: 'inspire' }
] as const;

export default function IdentitySection() {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const wordRefs = useRef<Array<HTMLDivElement | null>>([]);
  const subRefs = useRef<Array<HTMLDivElement | null>>([]);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    mediaQuery.addEventListener?.('change', handler);
    return () => mediaQuery.removeEventListener?.('change', handler);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const stage = stageRef.current;
    if (!stage) return;

    const ctx = gsap.context(() => {
      const buildTimeline = (isMobile: boolean) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: 'top top',
            end: isMobile ? '+=160%' : '+=250%',
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progressRef.current) {
                progressRef.current.style.width = `${self.progress * 100}%`;
              }
            }
          }
        });

        const [codeEl, createEl, inspireEl] = wordRefs.current;
        const [codeSub, createSub, inspireSub] = subRefs.current;
        if (!codeEl || !createEl || !inspireEl) return tl;

        gsap.set([createEl, inspireEl], { autoAlpha: 0 });
        gsap.set(codeEl, { autoAlpha: 1, xPercent: -50, yPercent: -50 });
        gsap.set([createEl, inspireEl], { xPercent: -50, yPercent: -50 });

        tl.fromTo(
          codeEl,
          { y: 60, scale: 0.94, autoAlpha: 0 },
          { y: 0, scale: 1, autoAlpha: 1, ease: 'power3.out', duration: 1 },
          0
        );

        if (codeSub) {
          tl.fromTo(
            codeSub.children,
            { autoAlpha: 0, y: 16 },
            {
              autoAlpha: 1,
              y: 0,
              stagger: 0.12,
              ease: 'power3.out',
              duration: 0.4
            },
            0.6
          );
          tl.to(codeSub.children, { autoAlpha: 0, duration: 0.25 }, 1.6);
        }

        tl.to(
          codeEl,
          { scale: 1.12, autoAlpha: 0, ease: 'power3.inOut', duration: 1 },
          1.7
        ).fromTo(
          createEl,
          { scale: 0.92, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, ease: 'power3.inOut', duration: 1 },
          '<'
        );

        if (createSub) {
          tl.fromTo(
            createSub.children,
            { autoAlpha: 0, y: 16 },
            {
              autoAlpha: 1,
              y: 0,
              stagger: 0.12,
              ease: 'power3.out',
              duration: 0.4
            },
            2.5
          );
          tl.to(createSub.children, { autoAlpha: 0, duration: 0.25 }, 3.2);
        }

        tl.to(
          createEl,
          { scale: 1.12, autoAlpha: 0, ease: 'power3.inOut', duration: 1 },
          3.5
        ).fromTo(
          inspireEl,
          { scale: 0.92, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, ease: 'power3.inOut', duration: 1 },
          '<'
        );

        if (inspireSub) {
          tl.fromTo(
            inspireSub.children,
            { autoAlpha: 0, y: 16 },
            {
              autoAlpha: 1,
              y: 0,
              stagger: 0.12,
              ease: 'power3.out',
              duration: 0.4
            },
            4.3
          );
        }

        tl.to(
          inspireEl,
          {
            scale: isMobile ? 1.3 : 1.5,
            yPercent: -110,
            autoAlpha: 0,
            ease: 'power2.inOut',
            duration: 0.9
          },
          5.2
        );

        return tl;
      };

      const mm = gsap.matchMedia();
      mm.add('(min-width: 768px)', () => {
        buildTimeline(false);
      });
      mm.add('(max-width: 767px)', () => {
        buildTimeline(true);
      });
    }, stage);

    const onFontsReady = () => {
      ScrollTrigger.refresh();
    };

    if (document.fonts?.ready) {
      document.fonts.ready.then(onFontsReady).catch(() => undefined);
    }
    window.addEventListener('resize', onFontsReady);

    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener('resize', onFontsReady);
      ctx.revert();
    };
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <Container ref={containerRef} id="identity">
        <div style={{ padding: '6rem 2rem', textAlign: 'center' }}>
          {words.map((word) => (
            <div key={word.id} style={{ marginBottom: '3rem' }}>
              <WordHeading>{t(`identity.${word.label}`)}</WordHeading>
            </div>
          ))}
        </div>
        <ContentBelow>
          <TransitionContent>
            <TransitionTitle>{t('identity.transitionTitle')}</TransitionTitle>
            <TransitionText>{t('identity.transitionText')}</TransitionText>
          </TransitionContent>
        </ContentBelow>
      </Container>
    );
  }

  return (
    <Container ref={containerRef} id="identity">
      <Stage ref={stageRef}>
        <WordsContainer role="region" aria-label="Identidade">
          <SrOnly>
            {words.map((w) => t(`identity.${w.label}`)).join(' ')}
          </SrOnly>
          {words.map((word, index) => (
            <WordWrapper
              key={word.id}
              ref={(el) => {
                wordRefs.current[index] = el;
              }}
              aria-hidden="true"
              style={{ opacity: index === 0 ? 1 : 0 }}
            >
              <WordHeading>{t(`identity.${word.label}`)}</WordHeading>
              <WordSub
                ref={(el) => {
                  subRefs.current[index] = el;
                }}
              >
                <WordSubLine>{t(`identity.${word.id}Line1`)}</WordSubLine>
                <WordSubLine>{t(`identity.${word.id}Line2`)}</WordSubLine>
              </WordSub>
            </WordWrapper>
          ))}
        </WordsContainer>

        <ProgressIndicator aria-hidden="true">
          <ProgressBar>
            <ProgressFill ref={progressRef} />
          </ProgressBar>
          <ScrollLabel>{t('identity.scroll')}</ScrollLabel>
        </ProgressIndicator>
      </Stage>

      <ContentBelow>
        <TransitionContent>
          <TransitionTitle>{t('identity.transitionTitle')}</TransitionTitle>
          <TransitionText>{t('identity.transitionText')}</TransitionText>
        </TransitionContent>
      </ContentBelow>
    </Container>
  );
}
