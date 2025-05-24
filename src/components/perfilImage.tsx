import Image from 'next/image';
import styled from 'styled-components';
import { media } from '../styles/media';

const ImageWrapper = styled.div`
  margin-top: 2rem;

  img {
    width: 100%;
    max-width: 650px;
    height: auto; /* mantém a proporção */
    border-radius: 12px;
    background-color: ${({ theme }) => theme.background}; /* opcional */

    ${media.lessThan('lg')} {
      max-height: 350px;
      width: auto; /* para manter proporção na media query */
    }
  }

  ${media.lessThan('lg')} {
    margin-top: 0;
  }
`;

export default function PerfilImage() {
  return (
    <ImageWrapper>
      <Image
        src="/assets/eu.svg"
        alt="Eduardo"
        width={650}
        height={650}
        priority
      />
    </ImageWrapper>
  );
}
