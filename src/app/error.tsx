'use client';

import { useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';

const Wrapper = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #fbe8fc 0%, #fcf0d957 50%, #f0f9ff 100%);
  padding: ${theme.spacing.xl};
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.lg};
  background: #ffffff;
  border: 1px solid ${theme.colors.border.default};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.xxl};
  max-width: 480px;
  width: 100%;
  box-shadow: ${theme.shadows.lg};
  text-align: center;
`;

const IconCircle = styled.div`
  width: 56px;
  height: 56px;
  border-radius: ${theme.borderRadius.full};
  background: #fee2e2;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  line-height: 1;
`;

const Title = styled.h2`
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
`;

const Message = styled.p`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
  line-height: ${theme.typography.lineHeight.relaxed};
`;

const Digest = styled.code`
  font-family: ${theme.typography.fontFamily.mono};
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.text.muted};
  background: ${theme.colors.surface};
  padding: 2px 6px;
  border-radius: ${theme.borderRadius.sm};
`;

const RetryButton = styled.button`
  margin-top: ${theme.spacing.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.xl};
  background: ${theme.colors.accent.primary};
  color: ${theme.colors.text.inverse};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  transition: background ${theme.transitions.fast};
  cursor: pointer;
  border: none;

  &:hover {
    background: ${theme.colors.accent.hover};
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.accent.primary};
    outline-offset: 2px;
  }
`;

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('[ErrorBoundary]', error);
  }, [error]);

  return (
    <Wrapper>
      <Card>
        <IconCircle>⚠️</IconCircle>
        <Title>Something went wrong</Title>
        <Message>{error.message || 'An unexpected error occurred. Please try again.'}</Message>
        {error.digest && <Digest>Error ID: {error.digest}</Digest>}
        <RetryButton onClick={reset}>Try again</RetryButton>
      </Card>
    </Wrapper>
  );
}
