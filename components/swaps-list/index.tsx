import { Box, Flex, Stack } from '@nelson-ui/react';
import React, { Suspense, useMemo } from 'react';
import { useSwapKeys } from '../../common/store/swaps';
import { useSetTitle } from '../head';
import { Text } from '../text';
import { SwapItem, LoadingRow, EmptyRow, ROW_WIDTHS } from './swap-item';

export const SwapsList: React.FC = () => {
  const [swaps] = useSwapKeys();
  useSetTitle('Swap History');

  const rows = useMemo(() => {
    if (swaps.length === 0) {
      return <EmptyRow />;
    }
    return swaps.map(swap => {
      return (
        <Suspense fallback={<LoadingRow item={swap} />} key={swap.id}>
          <SwapItem item={swap} />
        </Suspense>
      );
    });
  }, [swaps]);
  return (
    <Stack flexWrap="wrap" spacing="$4" width="1120px" mt="$6">
      <Box>
        <Text variant="Heading02" color="$white">
          Swap history
        </Text>
      </Box>
      <Box width="100%">
        <Flex flexDirection="row" py="15px" width="100%">
          <Box width={`${ROW_WIDTHS[0]}px`}>
            <Text variant="Label02" color="$text-dim">
              Swap
            </Text>
          </Box>
          <Box width={`${ROW_WIDTHS[1]}px`}>
            <Text variant="Label02" color="$text-dim">
              Start Date
            </Text>
          </Box>
          <Box width={`${ROW_WIDTHS[2]}px`} flexGrow={1}>
            <Text variant="Label02" color="$text-dim">
              Swap ID
            </Text>
          </Box>
        </Flex>
        <Flex width="100%" flexDirection="column">
          {rows}
        </Flex>
      </Box>
    </Stack>
  );
};
