import React from 'react';
import styled from 'styled-components';

interface DebugTextProps {
  content: unknown;
  title?: string;
  className?: string;
}

const RawDebugText: React.FC<DebugTextProps> = ({ title, content, className }) => (
  <Container className={className}>
    <Title>[DEBUG] {title}</Title>
    {JSON.stringify(content, undefined, 2)}
  </Container>
);

export const DebugText = styled(RawDebugText)``;

const Container = styled.code`
  display: block;
  background-color: ${({ theme }) => theme.gridHeader.cardFade};
  padding: 0.5rem;
  margin: 0.25rem 0;
  white-space: pre;
  overflow-x: auto;
`;

const Title = styled.div`
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: 700;
  margin-bottom: 0.125rem;
`;
