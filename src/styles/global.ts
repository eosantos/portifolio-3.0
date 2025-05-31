import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    font-family: 'catamatan', sans-serif;
    transition: background 0.3s ease, color 0.3s ease;
  }
`;
