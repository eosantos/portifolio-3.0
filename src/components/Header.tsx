'use client';

import { motion, useTransform } from 'framer-motion';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useLanguage } from '@/providers/LanguageProvider';
import { media } from '@/styles/media';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiMenu, FiX } from 'react-icons/fi';
import styled, { useTheme } from 'styled-components';
import { useHeaderScroll } from '@/hooks/useHeaderScroll';
import { scrollToSection } from '@/utils/scrollToSection';

const HeaderContainer = styled(motion.header)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  z-index: 99;
  background-color: ${({ theme }) => theme.background};
  border-bottom: 1px solid ${({ theme }) => theme.currentline};
  padding: 0.875rem 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const HeaderInner = styled.div`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  ${media.greaterThan('md')} {
    padding: 0 2rem;
  }
`;

const BrandLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  line-height: 1;
  flex-shrink: 0;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.purple};
    outline-offset: 4px;
    border-radius: 6px;
  }
`;

const BrandWordmark = styled.span<{ $compact: boolean }>`
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  color: ${({ theme }) => theme.text};
  white-space: nowrap;
  max-width: ${({ $compact }) => ($compact ? '0' : '12rem')};
  opacity: ${({ $compact }) => ($compact ? 0 : 1)};
  overflow: hidden;
  transition:
    max-width 0.3s ease,
    opacity 0.25s ease;

  ${media.lessThan('md')} {
    display: none;
  }
`;

const BrandDot = styled.span`
  color: ${({ theme }) => theme.purple};
`;

const NavPill = styled.nav<{ $isOpen: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem;
  border-radius: 999px;
  border: 1px solid transparent;
  background: transparent;

  a {
    position: relative;
    z-index: 1;
    text-decoration: none;
    color: ${({ theme }) => theme.text};
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    padding: 0.5rem 1rem;
    border-radius: 999px;
    white-space: nowrap;
    transition: color 0.2s ease;

    &:hover {
      color: ${({ theme }) => theme.purple};
    }

    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme.purple};
      outline-offset: 2px;
    }
  }

  ${media.lessThan('md')} {
    position: absolute;
    top: calc(100% + 0.5rem);
    left: 1rem;
    right: 1rem;
    background-color: ${({ theme }) => theme.background};
    border: 1px solid ${({ theme }) => theme.currentline};
    border-radius: 16px;
    flex-direction: column;
    align-items: stretch;
    padding: 0.5rem;
    gap: 0.25rem;
    display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.25);
    max-width: none;

    a {
      padding: 0.75rem 1rem;
    }
  }
`;

const NavIndicator = styled.span<{
  $left: number;
  $width: number;
  $visible: boolean;
}>`
  position: absolute;
  top: 0.25rem;
  bottom: 0.25rem;
  left: ${({ $left }) => `${$left}px`};
  width: ${({ $width }) => `${$width}px`};
  border-radius: 999px;
  background: ${({ theme }) => theme.currentline};
  opacity: ${({ $visible }) => ($visible ? 0.55 : 0)};
  transition:
    left 0.25s ease,
    width 0.25s ease,
    opacity 0.2s ease;
  pointer-events: none;

  ${media.lessThan('md')} {
    display: none;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  flex-shrink: 0;
`;

const LangGroup = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.1em;
`;

const LangButton = styled.button<{ $active: boolean }>`
  background: none;
  border: none;
  padding: 0.25rem 0.125rem;
  cursor: pointer;
  font: inherit;
  color: ${({ theme, $active }) => ($active ? theme.text : theme.comment)};
  opacity: ${({ $active }) => ($active ? 1 : 0.75)};
  transition:
    color 0.2s ease,
    opacity 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.text};
    opacity: 1;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.purple};
    outline-offset: 3px;
    border-radius: 2px;
  }
`;

const LangSeparator = styled.span`
  color: ${({ theme }) => theme.comment};
  opacity: 0.6;
  user-select: none;
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  font-size: 1.8rem;
  cursor: pointer;
  padding: 0.25rem;

  ${media.lessThan('md')} {
    display: inline-flex;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.purple};
    outline-offset: 3px;
    border-radius: 4px;
  }
`;

const NAV_LINKS = [
  { href: '#sobre', key: 'about' },
  { href: '#projetos', key: 'projects' },
  { href: '#contato', key: 'contact' }
] as const;

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const theme = useTheme();
  const { lang, toggleLanguage } = useLanguage();
  const { t } = useTranslation();
  const { backgroundOpacity, backdropBlur, heightScale, borderOpacity } =
    useHeaderScroll();

  const logoSrc =
    theme.title === 'light'
      ? '/assets/icons/logo-black.svg'
      : '/assets/icons/logo-white.svg';

  const navRef = useRef<HTMLElement | null>(null);
  const linkRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const [indicator, setIndicator] = useState({
    left: 0,
    width: 0,
    visible: false
  });
  const [hoveredLink, setHoveredLink] = useState<number | null>(null);
  const [activeLink, setActiveLink] = useState<number | null>(null);

  const updateIndicator = (index: number | null) => {
    if (index === null || typeof window === 'undefined') {
      setIndicator((prev) =>
        prev.visible ? { ...prev, visible: false } : prev
      );
      return;
    }
    if (!window.matchMedia('(min-width: 768px)').matches) return;
    const link = linkRefs.current[index];
    const nav = navRef.current;
    if (!link || !nav) return;
    const navRect = nav.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    const next = {
      left: linkRect.left - navRect.left,
      width: linkRect.width,
      visible: true
    };
    setIndicator((prev) =>
      prev.left === next.left &&
      prev.width === next.width &&
      prev.visible === next.visible
        ? prev
        : next
    );
  };

  // Indicator follows hover, falling back to the scroll-spy active section.
  useEffect(() => {
    updateIndicator(hoveredLink ?? activeLink);
  }, [hoveredLink, activeLink]);

  useEffect(() => {
    const handleResize = () => {
      setHoveredLink(null);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll-spy: highlight the section currently crossing the viewport middle.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const ids = ['sobre', 'projetos', 'contato'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = ids.indexOf(entry.target.id);
            if (idx >= 0) setActiveLink(idx);
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px' }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (e: React.MouseEvent, index: number, id: string) => {
    e.preventDefault();
    setActiveLink(index);
    setIsOpen(false);
    scrollToSection(id);
  };

  useEffect(() => {
    const handleScroll = () => {
      setCompact(window.scrollY > 120);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Parse theme hex color (#rrggbb) into rgb channels so the
  // scroll-driven background is always a valid rgba string.
  // (The previous /\d+/g parsing produced invalid values like
  // rgba(282, 36, undefined, …) which browsers ignore, leaving an
  // opaque background that hides the backdrop blur.)
  const hexToRgb = (hex: string): [number, number, number] => {
    const clean = hex.replace('#', '');
    const full =
      clean.length === 3
        ? clean
            .split('')
            .map((c) => c + c)
            .join('')
        : clean;
    const num = parseInt(full, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  };
  const [br, bgc, bb] = hexToRgb(theme.background);

  // Create derived MotionValues for complex transformations
  const backgroundColor = useTransform(
    backgroundOpacity,
    (o: number) => `rgba(${br}, ${bgc}, ${bb}, ${o})`
  );

  const backdropFilter = useTransform(
    backdropBlur,
    (b: number) => `blur(${b}px)`
  );
  const borderColor = useTransform(
    borderOpacity,
    (o: number) => `rgba(68, 71, 90, ${o})`
  );
  const headerScale = useTransform(heightScale, (s: number) => `scaleY(${s})`);

  return (
    <HeaderContainer
      style={{
        backgroundColor,
        backdropFilter,
        WebkitBackdropFilter: backdropFilter,
        borderBottomColor: borderColor,
        transform: headerScale,
        transformOrigin: 'top'
      }}
    >
      <HeaderInner>
        <BrandLink href="/" aria-label={t('nav.home')}>
          <Image
            src={logoSrc}
            alt=""
            aria-hidden="true"
            width={36}
            height={36}
            priority
          />
          <BrandWordmark $compact={compact}>
            Eduardo Oliveira<BrandDot aria-hidden="true">.</BrandDot>
          </BrandWordmark>
        </BrandLink>

        <NavPill
          ref={navRef}
          $isOpen={isOpen}
          onMouseLeave={() => setHoveredLink(null)}
        >
          <NavIndicator
            aria-hidden="true"
            $left={indicator.left}
            $width={indicator.width}
            $visible={indicator.visible}
          />
          {NAV_LINKS.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              ref={(el) => {
                linkRefs.current[index] = el;
              }}
              onMouseEnter={() => setHoveredLink(index)}
              onFocus={() => setHoveredLink(index)}
              onBlur={() => setHoveredLink(null)}
              onClick={(e) =>
                handleNavClick(e, index, link.href.replace('#', ''))
              }
            >
              {t(`nav.${link.key}`)}
            </Link>
          ))}
        </NavPill>

        <RightSection>
          <LangGroup role="group" aria-label="Language / Idioma">
            <LangButton
              $active={lang === 'pt'}
              aria-pressed={lang === 'pt'}
              onClick={() => {
                if (lang !== 'pt') toggleLanguage();
              }}
            >
              PT
            </LangButton>
            <LangSeparator aria-hidden="true">·</LangSeparator>
            <LangButton
              $active={lang === 'en'}
              aria-pressed={lang === 'en'}
              onClick={() => {
                if (lang !== 'en') toggleLanguage();
              }}
            >
              EN
            </LangButton>
          </LangGroup>
          <ThemeToggle />
          <MobileMenuButton
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label="Menu"
          >
            {isOpen ? <FiX /> : <FiMenu />}
          </MobileMenuButton>
        </RightSection>
      </HeaderInner>
    </HeaderContainer>
  );
}
