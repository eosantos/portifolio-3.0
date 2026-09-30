'use client';

import { media } from '@/styles/media';
import styled from 'styled-components';

interface TechIconProps {
  icon: React.ComponentType<{ size?: number; color?: string }>;
}

const TechIcon = styled(({ icon: Icon, ...props }: TechIconProps) => (
  <Icon {...props} size={16} color="currentColor" />
))`
  flex-shrink: 0;
  width: 16px;
  height: 16px;
`;

const TechTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.purple};
  padding: 0.375rem 0.75rem;
  border: 1px solid ${({ theme }) => theme.currentline};
  border-radius: 999px;
  background: ${({ theme }) => theme.background};
  transition:
    border-color 0.2s ease,
    color 0.2s ease;

  ${media.greaterThan('md')} {
    font-size: 0.75rem;
    padding: 0.4375rem 0.875rem;
  }
`;

const TechTagText = styled.span`
  flex: 1 1 auto;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

interface TechTagProps {
  children: React.ReactNode;
  icon?: React.ComponentType<{ size?: number; color?: string }>;
  className?: string;
}

export function TechTagComponent({ children, icon, className }: TechTagProps) {
  return (
    <TechTag className={className}>
      {icon && <TechIcon icon={icon} aria-hidden="true" />}
      <TechTagText>{children}</TechTagText>
    </TechTag>
  );
}

const ModalTechTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.purple};
  padding: 0.375rem 0.75rem;
  border: 1px solid ${({ theme }) => theme.currentline};
  border-radius: 999px;
  background: ${({ theme }) => theme.background};
`;

const ModalTechTagText = styled.span`
  flex: 1 1 auto;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export function ModalTechTagComponent({
  children,
  icon
}: {
  children: React.ReactNode;
  icon?: React.ComponentType<{ size?: number; color?: string }>;
}) {
  return (
    <ModalTechTag>
      {icon && <TechIcon icon={icon} aria-hidden="true" />}
      <ModalTechTagText>{children}</ModalTechTagText>
    </ModalTechTag>
  );
}
