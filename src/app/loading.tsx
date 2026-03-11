'use client';

import styled, { keyframes } from 'styled-components';
import { theme } from '@/styles/theme';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #fbe8fc 0%, #fcf0d957 50%, #f0f9ff 100%);
  z-index: 50;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.lg};
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${theme.colors.border.default};
  border-top-color: ${theme.colors.accent.primary};
  border-radius: ${theme.borderRadius.full};
  animation: ${spin} 0.7s linear infinite;
`;

const Text = styled.p`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.muted};
  font-weight: ${theme.typography.fontWeight.medium};
  letter-spacing: 0.05em;
`;

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
