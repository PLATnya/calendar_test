import Link from 'next/link';
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

const Code = styled.p`
  font-size: 5rem;
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.border.focus};
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

const HomeLink = styled(Link)`
  margin-top: ${theme.spacing.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.xl};
  background: ${theme.colors.accent.primary};
  color: ${theme.colors.text.inverse};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  transition: background ${theme.transitions.fast};
  display: inline-block;

  &:hover {
    background: ${theme.colors.accent.hover};
  }
`;

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
