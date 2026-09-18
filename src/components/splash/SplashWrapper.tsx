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
    // Wait for SplashScreen to signal completion via custom event
    const handleSplashComplete = () => {
      setIsLoading(false);
    };

    window.addEventListener('splash-complete', handleSplashComplete);

    // Fallback timeout in case event never fires
    const fallbackTimer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => {
      window.removeEventListener('splash-complete', handleSplashComplete);
      clearTimeout(fallbackTimer);
    };
  }, []);

  if (isLoading) return <SplashScreen />;

  return (
    <>
      <Header />
      {children}
    </>
  );
}
