import React from 'react';
import styled from 'styled-components';

// Definindo a interface para as props, incluindo a transient prop $weight
interface StyledH1Props {
  size?: 'large' | 'small';
  $weight?: 'normal' | 'bold' | 'light';
  color?: 'primary' | 'secondary';
}

interface H1Props {
  size?: 'large' | 'small';
  weight?: 'normal' | 'bold' | 'light';
  color?: 'primary' | 'secondary';
  children: React.ReactNode;
}

// Usando a interface StyledH1Props para definir o tipo das props do StyledH1
const StyledH1 = styled.h1<StyledH1Props>`
  font-family: 'Catamaran', sans-serif;
  font-size: ${({ size }) => (size === 'large' ? '56px' : '32px')};
  font-weight: ${({ $weight }) =>
    $weight === 'bold' ? '700' : $weight === 'light' ? '300' : '400'};
  color: ${({ color }) => (color === 'secondary' ? '#000000' : '#0a490a')};

  text-align: center;
`;

const H1: React.FC<H1Props> = ({
  children,
  size = 'large',
  weight = 'normal',
  color = 'primary'
}) => {
  return (
    <StyledH1 size={size} $weight={weight} color={color}>
      {children}
    </StyledH1>
  );
};

export default H1;
