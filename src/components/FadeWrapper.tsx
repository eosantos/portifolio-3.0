'use client';

import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Wrapper = styled.div<{ $animate: boolean }>`
  opacity: 0;
  animation: ${({ $animate }) => ($animate ? fadeIn : 'none')} 0.8s ease
    forwards;
`;

export default function FadeWrapper({
  children
}: {
  children: React.ReactNode;
}) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100); // delay para suavizar
    return () => clearTimeout(timer);
  }, []);

  return <Wrapper $animate={animate}>{children}</Wrapper>;
}
