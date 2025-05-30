'use client';

import { ThemeToggle } from '@/components/ThemeToggle';
import { useLanguage } from '@/providers/LanguageProvider';
import { media } from '@/styles/media';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiMenu, FiX } from 'react-icons/fi';
import styled, { useTheme } from 'styled-components';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 99;
  background-color: ${({ theme }) => theme.background};
  border-bottom: 1px solid ${({ theme }) => theme.currentline};
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
`;

const CenterSection = styled.nav<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 2rem;

  a {
    text-decoration: none;
    color: ${({ theme }) => theme.text};
    font-weight: 500;

    &:hover {
      color: ${({ theme }) => theme.purple};
    }
  }

  ${media.lessThan('md')} {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: ${({ theme }) => theme.background};
    flex-direction: column;
    padding: 1rem;
    display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
    max-width: 75%;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: start;
  gap: 1rem;
  flex-shrink: 0;
  margin-right: 5rem;

  ${media.lessThan('md')} {
    justify-content: flex-end;
    width: auto;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  font-size: 1.8rem;

  ${media.lessThan('md')} {
    display: block;
  }
`;

const FlagButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
`;

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();
  const { lang, toggleLanguage } = useLanguage();
  const { t } = useTranslation();

  const logoSrc =
    theme.title === 'light'
      ? '/assets/icons/logo-white.svg'
      : '/assets/icons/logo-black.svg';

  const flagSrc =
    lang === 'pt' ? '/assets/flags/br.svg' : '/assets/flags/us.svg';

  return (
    <HeaderContainer>
      <LeftSection>
        <Link href="/">
          <Image
            src={logoSrc}
            alt="Logo Eduardo"
            width={140}
            height={40}
            priority
          />
        </Link>
      </LeftSection>

      <CenterSection $isOpen={isOpen}>
        <Link href="#sobre">{t('nav.about')}</Link>
        <Link href="#projetos">{t('nav.projects')}</Link>
        <Link href="#contato">{t('nav.contact')}</Link>
      </CenterSection>

      <RightSection>
        <FlagButton onClick={toggleLanguage} title="Mudar idioma">
          <Image
            src={flagSrc}
            alt={lang === 'pt' ? 'Português' : 'English'}
            width={24}
            height={24}
            priority
          />
        </FlagButton>
        <ThemeToggle />
        <MobileMenuButton onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FiX /> : <FiMenu />}
        </MobileMenuButton>
      </RightSection>
    </HeaderContainer>
  );
}
