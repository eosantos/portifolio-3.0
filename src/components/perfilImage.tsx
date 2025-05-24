import Image from 'next/image';
import styled from 'styled-components';
import { media } from '../styles/media';

const ImageWrapper = styled.div`
  margin-top: 2rem;

  img {
    width: 100%;
    max-width: 650px;
    border-radius: 12px;

    /* até 1024 px (lg) a imagem fica menor */
    ${media.lessThan('lg')} {
      max-height: 350px;
    }
  }

  /* em telas menores não precisa de margem extra */
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
