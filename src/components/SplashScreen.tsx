'use client';

import { useHasMounted } from '@/hooks/useHasMounted';
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

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
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

const AnimatedLogo = styled(Image)`
  animation: ${bounce} 1.2s infinite;
`;

export default function SplashScreen() {
  const [fade, setFade] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const hasMounted = useHasMounted();
  const { isDark } = useTheme();

  useEffect(() => {
    const fadeTimeout = setTimeout(() => {
      setFade(true);
    }, 1500); // tempo antes de começar o fade

    const removeTimeout = setTimeout(() => {
      setShowSplash(false);
    }, 2100); // 1500 + 600ms de animação

    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(removeTimeout);
    };
  }, []);

  if (!hasMounted || !showSplash) return null;

  return (
    <SplashContainer $fade={fade} $isDark={isDark}>
      <AnimatedLogo
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
