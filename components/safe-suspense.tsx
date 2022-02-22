import React, { ReactNode, memo } from 'react';
import { IS_SSR } from 'jotai-query-toolkit';
import { ImSpinner7 } from 'react-icons/im';
import PulseLoader from 'react-spinners/PulseLoader';
import { Box, Flex, Stack, IconButton } from '@nelson-ui/react';

const LoadingEl: React.FC = () => {
  return (
    <Flex alignItems="center" justifyContent="center">
      <Stack maxWidth="500px" spacing="$5" pt="150px">
        {/* <IconButton icon={ImSpinner7} size="100px" iconSize="100px" /> */}
        <PulseLoader size="75px" color="$color-slate-85" />
      </Stack>
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
