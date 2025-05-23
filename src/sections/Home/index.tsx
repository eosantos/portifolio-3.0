'use client';

import styled from 'styled-components';

export const Container = styled.section`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 4rem 2rem;
`;

export const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
`;

export const Subtitle = styled.p`
  font-size: 1.5rem;
  font-weight: 400;
  margin-top: 1rem;
  max-width: 600px;
`;

export default function HomeSection() {
  return (
    <Container id="home">
      <Title>Olá, eu sou o Eduardo 👋</Title>
      <Subtitle>
        Desenvolvedor Front-End apaixonado por criar interfaces incríveis.
      </Subtitle>
    </Container>
  );
}
