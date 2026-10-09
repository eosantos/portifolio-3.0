'use client';

import { media } from '@/styles/media';
import styled from 'styled-components';
import {
  type ComponentPropsWithoutRef,
  type ElementType,
  forwardRef
} from 'react';
import { FiMail, FiGithub, FiLinkedin } from 'react-icons/fi';

interface ContactLinkProps extends ComponentPropsWithoutRef<'a'> {
  type: 'email' | 'github' | 'linkedin';
  children: React.ReactNode;
  as?: ElementType;
}

const iconMap = {
  email: FiMail,
  github: FiGithub,
  linkedin: FiLinkedin
} as const;

const StyledLink = styled.a<{ $type: ContactLinkProps['type'] }>`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.currentline};
  border-radius: 999px;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  white-space: nowrap;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.purple};
    background-color: ${({ theme }) => theme.currentline};
    color: ${({ theme }) => theme.purple};
    transform: translateX(4px);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.purple};
    outline-offset: 2px;
  }

  svg {
    flex-shrink: 0;
    width: 18px;
    height: 18px;
    color: ${({ theme }) => theme.purple};
    transition: color 0.2s ease;
  }

  &:hover svg {
    color: ${({ theme }) => theme.purple};
  }

  ${media.lessThan('sm')} {
    width: 100%;
    justify-content: center;
  }
`;

export const ContactLink = forwardRef<HTMLAnchorElement, ContactLinkProps>(
  ({ type, children, as: Component = 'a', ...props }, ref) => {
    const Icon = iconMap[type];

    return (
      <StyledLink ref={ref} as={Component} $type={type} {...props}>
        <Icon aria-hidden="true" size={18} />
        {children}
      </StyledLink>
    );
  }
);

ContactLink.displayName = 'ContactLink';

export type { ContactLinkProps };
