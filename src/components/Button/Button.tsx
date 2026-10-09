'use client';

import { media } from '@/styles/media';
import styled, { type CSSProperties } from 'styled-components';
import {
  type ComponentPropsWithoutRef,
  type ElementType,
  forwardRef
} from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  as?: ElementType;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  style?: CSSProperties;
}

const StyledButton = styled.button<{
  $variant: ButtonVariant;
  $size: ButtonSize;
  $fullWidth: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: inherit;
  font-weight: 600;
  border-radius: 8px;
  border: 1px solid transparent;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease,
    opacity 0.2s ease,
    transform 0.2s ease;
  white-space: nowrap;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};

  ${({ theme, $variant, $size }) => {
    const sizes = {
      sm: { padding: '0.5rem 1rem', fontSize: '0.875rem', minHeight: '40px' },
      md: { padding: '0.75rem 1.5rem', fontSize: '1rem', minHeight: '44px' },
      lg: { padding: '1rem 2rem', fontSize: '1.125rem', minHeight: '48px' }
    };
    const s = sizes[$size];

    const variants = {
      primary: {
        background: theme.purple,
        color: theme.background,
        borderColor: theme.purple,
        hoverBg: `${theme.purple}dd`,
        hoverBorder: theme.purple
      },
      secondary: {
        background: theme.background,
        color: theme.text,
        borderColor: theme.currentline,
        hoverBg: theme.currentline,
        hoverBorder: theme.currentline
      },
      ghost: {
        background: 'transparent',
        color: theme.text,
        borderColor: 'transparent',
        hoverBg: theme.currentline,
        hoverBorder: 'transparent'
      }
    };
    const v = variants[$variant];

    return `
      padding: ${s.padding};
      font-size: ${s.fontSize};
      min-height: ${s.minHeight};
      background-color: ${v.background};
      color: ${v.color};
      border-color: ${v.borderColor};

      &:hover:not(:disabled) {
        background-color: ${v.hoverBg};
        border-color: ${v.hoverBorder};
        transform: translateY(-1px);
      }

      &:active:not(:disabled) {
        transform: translateY(0);
      }
    `;
  }}

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.purple};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }

  svg {
    flex-shrink: 0;
  }

  ${media.lessThan('sm')} {
    min-height: 44px;
  }
`;

const LoadingSpinner = styled.span`
  width: 1em;
  height: 1em;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      as: Component = 'button',
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      disabled,
      children,
      style,
      ...restProps
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <StyledButton
        ref={ref}
        as={Component}
        $variant={variant}
        $size={size}
        $fullWidth={fullWidth}
        disabled={isDisabled}
        aria-busy={loading}
        aria-disabled={isDisabled}
        style={style}
        {...restProps}
      >
        {loading && <LoadingSpinner aria-hidden="true" />}
        {children}
      </StyledButton>
    );
  }
);

Button.displayName = 'Button';

export type { ButtonProps };
