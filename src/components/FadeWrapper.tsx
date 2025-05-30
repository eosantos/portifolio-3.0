'use client';

import { ReactNode, useEffect, useState } from 'react';
import styled from 'styled-components';

const FadeContainer = styled.div<{ $visible: boolean }>`
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.6s ease;
`;

export default function FadeWrapper({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(true);
    }, 2100); // mesmo tempo do SplashScreen
    return () => clearTimeout(timeout);
  }, []);

  return <FadeContainer $visible={visible}>{children}</FadeContainer>;
}
