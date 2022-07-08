import type { ReactNode } from 'react';
import React, { memo } from 'react';
import { Flex } from '@nelson-ui/react';
import { keyframes } from '@nelson-ui/core';
import { Box } from '@nelson-ui/react';
import { styled } from '@stitches/react';
import { useIsSSR } from '../common/hooks/use-is-ssr';

const spin = keyframes({
  '0%': { transform: 'rotateY(0deg)' },
  '100%': { transform: 'rotateY(360deg)' },
});

const circleSpin = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

const CircleBorder = styled(Box, {
  width: '100px',
  height: '100px',
  padding: '3px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '50%',
  background: 'linear-gradient(180deg, #121212 0%, #3D3D3D 100%);',
});

const CircleCore = styled(Box, {
  width: '100%',
  height: '100%',
  backgroundColor: '$background',
  borderRadius: '50%',
});

const LoadingEl: React.FC = () => {
  return (
    <Flex alignItems="center" justifyContent="center">
      {/* <StarIcon h={200} opacity={0.6} animation={`${spin()} 3s linear infinite`} /> */}
      <CircleBorder animation={`${circleSpin()} .8s linear 0s infinite`}>
        <CircleCore />
      </CircleBorder>
    </Flex>
  );
};

export const Loading = memo(LoadingEl);

export const SafeSuspense: React.FC<{
  onlyOnClient?: boolean;
  fallback: NonNullable<ReactNode> | null;
}> = ({ fallback, onlyOnClient, children }) => {
  const isSSR = useIsSSR();
  if (isSSR && onlyOnClient) return <>{children}</>;
  if (isSSR) return <>{fallback}</>;
  return <React.Suspense fallback={fallback}>{children}</React.Suspense>;
};
