// src/providers/theme-provider.tsx
'use client';

import { createContext, useContext, useState } from 'react';
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
  const [isDark, setIsDark] = useState(false);

  function toggleTheme() {
    setIsDark((prev) => !prev);
  }

  return (
    <ThemeContext.Provider value={{ toggleTheme, isDark }}>
      <StyledProvider theme={isDark ? lightTheme : darkTheme}>
        <GlobalStyle />
        {children}
      </StyledProvider>
    </ThemeContext.Provider>
  );
}
