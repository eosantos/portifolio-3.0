import { useTheme } from '@/providers/theme-provider';
import styled from 'styled-components';

const Track = styled.button`
  position: relative;
  width: 54px;
  height: 30px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.currentline};
  background: transparent;
  cursor: pointer;
  flex-shrink: 0;
  padding: 0;
  transition: border-color 0.3s ease;

  &:hover {
    border-color: ${({ theme }) => theme.purple};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.purple};
    outline-offset: 3px;
  }
`;

const Knob = styled.span<{ $isDark: boolean }>`
  position: absolute;
  top: 3px;
  left: 3px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: ${({ theme }) => theme.text};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transform: translateX(${({ $isDark }) => ($isDark ? '24px' : '0')});
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  overflow: hidden;
`;

const IconWrap = styled.span<{ $visible: boolean; $rotate: boolean }>`
  position: absolute;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.background};
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: rotate(${({ $rotate }) => ($rotate ? '0deg' : '-90deg')})
    scale(${({ $visible }) => ($visible ? 1 : 0.5)});
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
`;

function SunIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />
      <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.5 13.2A8.5 8.5 0 1 1 10.8 3.5a7 7 0 0 0 9.7 9.7Z" />
    </svg>
  );
}

export const ThemeToggle = () => {
  const { toggleTheme, isDark } = useTheme();

  return (
    <Track
      onClick={toggleTheme}
      aria-label="Toggle theme"
      aria-pressed={isDark}
      type="button"
    >
      <Knob $isDark={isDark}>
        <IconWrap $visible={!isDark} $rotate={!isDark}>
          <SunIcon />
        </IconWrap>
        <IconWrap $visible={isDark} $rotate={isDark}>
          <MoonIcon />
        </IconWrap>
      </Knob>
    </Track>
  );
};
