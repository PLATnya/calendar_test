'use client';

import { Card, Code, HomeLink, Message, Title, Wrapper } from '@/styles/NotFoundStyles';

export default function NotFound() {
  return (
    <Wrapper>
      <Card>
        <Code>404</Code>
        <Title>Page not found</Title>
        <Message>The page you are looking for does not exist or has been moved.</Message>
        <HomeLink href="/">Go back home</HomeLink>
      </Card>
    </Wrapper>
  );
}
