import { FiMoon, FiSun } from 'react-icons/fi';
import styled, { useTheme } from 'styled-components';

const ToggleButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  flex-shrink: 0;
`;

export const ThemeToggle = () => {
  const theme = useTheme();
  const isDark = theme.text === 'dark';

  return <ToggleButton>{isDark ? <FiSun /> : <FiMoon />}</ToggleButton>;
};
