'use client';

import { useEffect } from 'react';
import { Card, Digest, IconCircle, Message, RetryButton, Title, Wrapper } from '@/styles/ErrorStyles';

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
