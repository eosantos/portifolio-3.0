import Image from 'next/image';
import styled from 'styled-components';

const ImageWrapper = styled.div`
  margin-top: 2rem;

  img {
    width: 100%;
    max-width: 650px;
    border-radius: 12px;

    @media (max-width: 1024px) {
      max-height: 350px;
    }
  }

  @media (max-width: 1024px) {
    margin-top: 0;
  }
`;

export default function HomeSection() {
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
