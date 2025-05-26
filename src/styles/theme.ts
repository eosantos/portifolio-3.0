// src/styles/theme.ts
export const lightTheme = {
  title: 'dark',
  background: '#f8f8f2',
  text: '#282a36',
  currentline: '#44475a',
  selection: '#44475a',
  foreground: '#f8ff2',
  comment: '#6272a4',
  can: '#8be9fd',
  geen: '#50fa7b',
  orange: '#ffb86c',
  pink: '#ff79c6',
  purple: '#bd93f9',
  red: '#ff5555',
  yellow: '#f1fa8c'
};

export const darkTheme = {
  title: 'light',
  background: '#282a36',
  text: '#f8f8f2',
  currentline: '#44475a',
  selection: '#44475a',
  foreground: '#f8ff2',
  comment: '#6272a4',
  can: '#8be9fd',
  geen: '#50fa7b',
  orange: '#ffb86c',
  pink: '#ff79c6',
  purple: '#bd93f9',
  red: '#ff5555',
  yellow: '#f1fa8c'
};

export type ThemeType = typeof lightTheme;
