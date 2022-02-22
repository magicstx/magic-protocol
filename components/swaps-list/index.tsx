import { Box, Flex, SpaceBetween, Stack } from '@nelson-ui/react';
import React, { Suspense, useMemo } from 'react';
import { useSwapKeys } from '../../common/store/swaps';
import { useSetTitle } from '../head';
import { Text } from '../text';
import { SwapItem, LoadingRow, EmptyRow } from './swap-item';

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
    <Flex>
      <Box width="800px">
        <Flex flexDirection="row" px="28px" py="15px" width="100%">
          <Box width="225px">
            <Text variant="Caption02">Swap</Text>
          </Box>
          <Box width="125px">
            <Text variant="Caption02">Start Date</Text>
          </Box>
          <Box width="250px">
            <Text variant="Caption02">Swap ID</Text>
          </Box>
          <Box width="150px">
            <Text variant="Caption02">Status</Text>
          </Box>
        </Flex>
        <Flex width="100%" flexDirection="column">
          {rows}
        </Flex>
      </Box>
    </Flex>
  );
};
