import React, { ReactNode, memo } from 'react';
import { IS_SSR } from 'jotai-query-toolkit';
import { Flex } from '@nelson-ui/react';
import { StarIcon } from './icons/star';
import { keyframes } from '@nelson-ui/core';

const spin = keyframes({
  '0%': { transform: 'rotateY(0deg)' },
  '100%': { transform: 'rotateY(360deg)' },
});

const LoadingEl: React.FC = () => {
  return (
    <Flex alignItems="center" justifyContent="center">
      <StarIcon h={200} opacity={0.6} animation={`${spin()} 3s linear infinite`} />
    </Flex>
  );
};

export const Loading = memo(LoadingEl);

export const SafeSuspense: React.FC<{
  onlyOnClient?: boolean;
  fallback: NonNullable<ReactNode> | null;
}> = ({ fallback, onlyOnClient, children }) => {
  if (IS_SSR && onlyOnClient) return <>{children}</>;
  if (IS_SSR) return <>{fallback}</>;
  return <React.Suspense fallback={fallback}>{children}</React.Suspense>;
};
