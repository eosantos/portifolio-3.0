'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { ThemeProvider as StyledProvider } from 'styled-components';
import { GlobalStyle } from '../styles/global';
import { darkTheme, lightTheme } from '../styles/theme';

type ThemeContextType = {
  toggleTheme: () => void;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return true;
    return document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    const root = document.documentElement;
    const newTheme = isDark ? 'dark' : 'light';

    root.classList.remove(isDark ? 'light' : 'dark');
    root.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
  }, [isDark]);

  function toggleTheme() {
    setIsDark((prev) => !prev);
  }

  return (
    <ThemeContext.Provider value={{ toggleTheme, isDark }}>
      <StyledProvider theme={isDark ? darkTheme : lightTheme}>
        <GlobalStyle />
        {children}
      </StyledProvider>
    </ThemeContext.Provider>
  );
}
