import styled from 'styled-components';
import { media } from '../styles/media';

const ImageWrapper = styled.div`
  width: 50%;
  aspect-ratio: 1 / 1;
  border-radius: 12px;

  background-image: url('/assets/img/eu.svg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain; /* 👉 Faz a imagem caber sem cortar */
  background-color: ${({ theme }) => theme.background};

  ${media.lessThan('lg')} {
    width: 70%;
    aspect-ratio: 1 / 1;
    margin-top: 0;
  }
`;
export default function PerfilImage() {
  return <ImageWrapper />;
}
