'use client';

import { FiMoon, FiSun } from 'react-icons/fi';
import styled from 'styled-components';
import { useTheme } from '../providers/theme-provider';

const Button = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${({ theme }) => theme.text};

  &:hover {
    color: ${({ theme }) => theme.purple};
  }
`;

export function ThemeToggle() {
  const { toggleTheme, isDark } = useTheme();

  return (
    <Button onClick={toggleTheme} title="Alternar tema">
      {isDark ? <FiSun /> : <FiMoon />}
    </Button>
  );
}
