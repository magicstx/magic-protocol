import React from 'react';
import { Box, Stack } from '@nelson-ui/react';
import { Text } from './text';
import { atom } from 'jotai';
import { useAtomValue } from 'jotai/utils';

export const footerSwapIdState = atom<string | undefined>(undefined);

export const Footer: React.FC = () => {
  const swapId = useAtomValue(footerSwapIdState);
  return (
    <Box width="100%" textAlign="center" pb="42px">
      <Stack spacing="6px">
        <Box>
          <Text variant="Caption02" display="inline-block" color="$color-slate-85">
            Keep this tab open.
          </Text>{' '}
          <Text
            variant="Caption02"
            display="inline-block"
            textDecoration="underline !important"
            color="$color-slate-85"
            href="https://docs.magic.fun"
            target="_blank"
            as="a"
          >
            Need help?
          </Text>
        </Box>
        {swapId ? (
          <Text color="$color-primary" variant="Caption02">
            Swap: {swapId}
          </Text>
        ) : null}
      </Stack>
    </Box>
  );
};
