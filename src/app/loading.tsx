'use client';

import { Container, Overlay, Spinner, Text } from '@/styles/LoadingStyles';

export default function Loading() {
  return (
    <Overlay>
      <Container>
        <Spinner />
        <Text>Loading…</Text>
      </Container>
    </Overlay>
  );
}
