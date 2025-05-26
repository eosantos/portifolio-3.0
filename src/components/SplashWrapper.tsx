// components/SplashWrapper.tsx
'use client';

import { useEffect, useState } from 'react';
import Header from './Header';
import SplashScreen from './SplashScreen';

export default function SplashWrapper({
  children
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1600);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <SplashScreen />;

  return (
    <>
      <Header />
      {children}
    </>
  );
}
