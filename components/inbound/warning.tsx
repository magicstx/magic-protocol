import React, { useCallback } from 'react';
import { Text } from '../text';
import { ErrorIcon } from '../icons/error';
import { Flex, Stack } from '@nelson-ui/react';
import { Alert } from '../alert';
import { Button } from '../button';
import { useInboundSwap } from '../../common/hooks/use-inbound-swap';

export const SwapWarning: React.FC = () => {
  const { swap, updateSwap } = useInboundSwap();
  const submit = useCallback(() => {
    void updateSwap({
      ...swap,
      warned: true,
    });
  }, [updateSwap, swap]);
  return (
    <Stack spacing="$row-y">
      <Alert>
        <Stack spacing="$2">
          <Flex alignItems="center">
            <ErrorIcon />
            <Text
              variant="Label02"
              display="inline-block"
              ml="$2"
              color="$color-alert-red"
              fontWeight="500 !important"
            >
              Powerful magic ahead
            </Text>
          </Flex>
          <Text color="$color-alert-red" variant="Body02">
            ✨ The Zelda bridge is experimental, unaudited software. Bugs can result in complete
            loss of funds.
          </Text>
          <Text color="$color-alert-red" variant="Body02">
            ✨ The website you’re on is providing the bridge and maybe the liquidity for your swap;
            please ask them for support. The wizards that designed the bridge are not hosting a
            front end.
          </Text>
          <Text color="$color-alert-red" variant="Body02">
            ✨ You’re swapping with a specific liquidity supplier. If the supplier fails you may
            need to manually recover your funds. This is possible but tedious and slow.
          </Text>
          <Text color="$color-alert-red" variant="Body02">
            ✨ Swaps take several transactions. Plan for your swap to take ~20min. If Stacks or
            Bitcoin are congested it could take longer.
          </Text>
        </Stack>
      </Alert>
      <Button size="big" onClick={submit}>
        Continue
      </Button>
    </Stack>
  );
};
