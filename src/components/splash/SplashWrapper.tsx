// components/SplashWrapper.tsx
'use client';

import Header from '@/components/Header';
import SplashScreen from '@/components/splash/SplashScreen';
import { useEffect, useState } from 'react';

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
