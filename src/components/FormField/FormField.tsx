'use client';

import { media } from '@/styles/media';
import styled, { css, type DefaultTheme } from 'styled-components';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';

const FormFieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.text};
`;

const HelperText = styled.span<{ $isError?: boolean }>`
  font-size: 0.8125rem;
  color: ${({
    theme,
    $isError
  }: {
    theme: DefaultTheme;
    $isError?: boolean;
  }) => ($isError ? theme.red : theme.comment)};
  min-height: 1.25rem;
`;

const inputBaseStyles = css`
  width: 100%;
  box-sizing: border-box;
  background: ${({ theme }: { theme: DefaultTheme }) => theme.background};
  border: 1px solid ${({ theme }: { theme: DefaultTheme }) => theme.currentline};
  border-radius: 8px;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.text};
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.5;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;

  &::placeholder {
    color: ${({ theme }: { theme: DefaultTheme }) => theme.comment};
  }

  &:hover:not(:disabled):not([aria-invalid='true']) {
    border-color: ${({ theme }: { theme: DefaultTheme }) => theme.purple}88;
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }: { theme: DefaultTheme }) => theme.purple};
    box-shadow: 0 0 0 3px
      ${({ theme }: { theme: DefaultTheme }) => theme.purple}33;
  }

  &:focus:not([aria-invalid='true']) {
    box-shadow: 0 0 0 3px
      ${({ theme }: { theme: DefaultTheme }) => theme.purple}33;
  }

  &[aria-invalid='true'] {
    border-color: ${({ theme }: { theme: DefaultTheme }) => theme.red};
    box-shadow: 0 0 0 3px ${({ theme }: { theme: DefaultTheme }) => theme.red}33;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: ${({ theme }: { theme: DefaultTheme }) => theme.currentline};
  }

  ${media.lessThan('sm')} {
    font-size: 16px;
    min-height: 44px;
  }
`;

const StyledInput = styled.input`
  ${inputBaseStyles}
  padding: 0.875rem 1rem;
`;

const StyledTextarea = styled.textarea`
  ${inputBaseStyles}
  padding: 0.875rem 1rem;
  min-height: 150px;
  resize: vertical;
`;

interface InputProps extends ComponentPropsWithoutRef<'input'> {
  label: string;
  error?: string;
  helperText?: string;
}

export const TextInput = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      error,
      helperText,
      id,
      'aria-describedby': ariaDescribedBy,
      label,
      ...props
    },
    ref
  ) => {
    const errorId = error ? `${id}-error` : undefined;
    const helperId = helperText && !error ? `${id}-helper` : undefined;
    const describedBy =
      [ariaDescribedBy, errorId, helperId].filter(Boolean).join(' ') ||
      undefined;

    return (
      <FormFieldWrapper>
        <Label htmlFor={id}>{label}</Label>
        <StyledInput
          ref={ref}
          id={id}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          aria-required={props.required}
          {...props}
        />
        {error && (
          <HelperText id={errorId} $isError role="alert">
            {error}
          </HelperText>
        )}
        {helperText && !error && (
          <HelperText id={helperId}>{helperText}</HelperText>
        )}
      </FormFieldWrapper>
    );
  }
);

TextInput.displayName = 'TextInput';

interface TextareaProps extends ComponentPropsWithoutRef<'textarea'> {
  label: string;
  error?: string;
  helperText?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      error,
      helperText,
      id,
      'aria-describedby': ariaDescribedBy,
      label,
      ...props
    },
    ref
  ) => {
    const errorId = error ? `${id}-error` : undefined;
    const helperId = helperText && !error ? `${id}-helper` : undefined;
    const describedBy =
      [ariaDescribedBy, errorId, helperId].filter(Boolean).join(' ') ||
      undefined;

    return (
      <FormFieldWrapper>
        <Label htmlFor={id}>{label}</Label>
        <StyledTextarea
          ref={ref}
          id={id}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          aria-required={props.required}
          {...props}
        />
        {error && (
          <HelperText id={errorId} $isError role="alert">
            {error}
          </HelperText>
        )}
        {helperText && !error && (
          <HelperText id={helperId}>{helperText}</HelperText>
        )}
      </FormFieldWrapper>
    );
  }
);

TextArea.displayName = 'TextArea';

export type { InputProps, TextareaProps };
