'use client';

import { useTheme } from '@/providers/theme-provider';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeOut = keyframes`
  to {
    opacity: 0;
    visibility: hidden;
  }
`;

const SplashContainer = styled.div<{ $fade: boolean; $isDark: boolean }>`
  position: fixed;
  z-index: 9999;
  inset: 0;
  background-color: ${({ $isDark }) => ($isDark ? '#282a36' : '#f8f8f2')};
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.6s ease;
  animation: ${({ $fade }) => ($fade ? fadeOut : 'none')} 0.6s forwards;
`;

export default function SplashScreen() {
  const [fade, setFade] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const { isDark } = useTheme();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFade(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!hasMounted) return null;

  return (
    <SplashContainer $fade={fade} $isDark={isDark}>
      <Image
        src={
          isDark
            ? '/assets/icons/logo-white.svg'
            : '/assets/icons/logo-black.svg'
        }
        alt="Logo"
        width={150}
        height={150}
        priority
      />
    </SplashContainer>
  );
}
