import { useTheme } from '@/providers/theme-provider'; // importe o hook correto
import { FiMoon, FiSun } from 'react-icons/fi';
import styled from 'styled-components';

const ToggleButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    color: ${({ theme }) => theme.purple};
  }
`;

export const ThemeToggle = () => {
  const { toggleTheme, isDark } = useTheme();

  return (
    <ToggleButton onClick={toggleTheme} aria-label="Toggle theme">
      {isDark ? <FiSun /> : <FiMoon />}
    </ToggleButton>
  );
};
