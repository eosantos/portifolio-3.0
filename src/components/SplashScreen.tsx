// src/components/SplashScreen.tsx
'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeOut = keyframes`
  to {
    opacity: 0;
    visibility: hidden;
  }
`;

const SplashContainer = styled.div<{ $fade: boolean }>`
  position: fixed;
  z-index: 9999;
  inset: 0;
  background-color: ${({ theme }) => theme.background};
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.6s ease;
  animation: ${({ $fade }) => ($fade ? fadeOut : 'none')} 0.6s forwards;
`;

export default function SplashScreen() {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFade(true);
    }, 1500); // tempo de exibição do splash

    return () => clearTimeout(timer);
  }, []);

  return (
    <SplashContainer $fade={fade}>
      <Image
        src="/assets/icons/logo-white.png"
        alt="Logo"
        width={150}
        height={150}
        priority
      />
    </SplashContainer>
  );
}
