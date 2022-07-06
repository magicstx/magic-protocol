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
            ✦ The Magic bridge is experimental software and bugs can result in complete loss of
            funds.
          </Text>
          <Text color="$color-alert-red" variant="Body02">
            ✦ Blockchains are slow and swaps take several transactions. Please be patient.
          </Text>
          <Text color="$color-alert-red" variant="Body02">
            ✦ The app you’re using now is providing the bridge; please ask the app for support. The
            wizards that created Magic are not hosting a front end app.
          </Text>
          <Text color="$color-alert-red" variant="Body02">
            ✦ If anything goes wrong with your swap you can recover your escrowed funds but this can
            be tedious and slow.
          </Text>
        </Stack>
      </Alert>
      <Button size="big" onClick={submit}>
        Continue
      </Button>
    </Stack>
  );
};
