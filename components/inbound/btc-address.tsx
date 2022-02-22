import React, { useMemo } from 'react';
import { Box, SpaceBetween, Stack } from '@nelson-ui/react';
import { Text } from '../text';
import { useInboundSwap } from '../../common/hooks/use-inbound-swap';
import { DuplicateIcon } from '../icons/duplicate';
import { satsToBtc } from '../../common/utils';

export const BtcAddress: React.FC = () => {
  const { swap } = useInboundSwap();
  if (!('address' in swap)) throw new Error('Invalid swap state for SwapReady component');
  const maxBtc = useMemo(() => {
    return satsToBtc(swap.inputAmount);
  }, [swap.inputAmount]);
  return (
    <Stack spacing="$3" px="$row-x">
      <Text variant="Label01">Send Bitcoin to:</Text>
      <Box
        p="$5"
        backgroundColor="$color-surface"
        borderRadius="$medium"
        border="1px solid $color-border-subdued"
      >
        <SpaceBetween>
          <Text variant="Caption01" color="$color-primary-text">
            {swap.address}
          </Text>
          <DuplicateIcon clipboardText={swap.address} />
        </SpaceBetween>
      </Box>
      <Text variant="Caption02" color="$color-slate-85">
        Send one transaction. Do not send more than {maxBtc} BTC
      </Text>
    </Stack>
  );
};
