import React, { useMemo, useCallback } from 'react';
import { Box, Stack } from '@nelson-ui/react';
import { Text } from './text';
import { SwapField, SwapInput } from './swap-input';
import { FlipIcon } from './icons/flip';
import { SwapSummary } from './swap-summary';
import { Button } from './button';
import { CenterBox } from './center-box';
import {
  pendingRegisterSwapperState,
  showOverrideSupplierState,
  useSwapForm,
} from '../common/hooks/use-swap-form';
import { PendingInit } from './outbound/pending';
import { useAuth } from '@micro-stacks/react';
import { Input } from './form';
import { useSwapperId } from '../common/store';
import { useAtomValue } from 'jotai/utils';
import { SelectSupplier } from './select-supplier';
import { RegisterSwap } from './inbound/register';

export const SwapContainer: React.FC = () => {
  const {
    switchDirection,
    outputToken,
    isValid,
    submit,
    btcAddress,
    pendingInitOutbound,
    validBtc,
  } = useSwapForm();
  const swapperId = useSwapperId();
  const isOutbound = outputToken === 'btc';
  const { isSignedIn, handleSignIn } = useAuth();
  const showOverrideSupplier = useAtomValue(showOverrideSupplierState);
  const pendingRegisterSwapper = useAtomValue(pendingRegisterSwapperState);
  const signIn = useCallback(() => handleSignIn(), [handleSignIn]);
  const swapButton = useMemo(() => {
    if (!isSignedIn) {
      return (
        <Button onClick={signIn} size="big">
          Connect Wallet
        </Button>
      );
    }
    if (swapperId === null && outputToken === 'xbtc') {
      return (
        <Button onClick={submit} size="big">
          Initialize
        </Button>
      );
    }
    if (!isValid) {
      return (
        <Button onClick={submit} size="big" disabled={true}>
          ✨ Swap ✨
        </Button>
      );
    }
    return (
      <Button onClick={submit} size="big" magic={true}>
        ✨ Swap ✨
      </Button>
    );
  }, [isSignedIn, swapperId, submit, isValid, outputToken, signIn]);
  if (pendingInitOutbound) {
    return <PendingInit />;
  }
  if (pendingRegisterSwapper) {
    return <RegisterSwap />;
  }
  if (showOverrideSupplier) {
    return <SelectSupplier />;
  }
  return (
    <Stack spacing="$row-y">
      <CenterBox noPadding>
        <Stack spacing="$6" px="$row-x">
          <SwapField dir="from" />
        </Stack>
        <Box position="relative" width="100%">
          <FlipIcon mx="auto" width="36px" onClick={switchDirection} cursor="pointer" zIndex="2" />
          <Box
            width="100%"
            position="absolute"
            top="18px"
            border="1px solid $color-border-subdued"
            borderWidth="1px 0 0 0"
            zIndex="-1"
          />
        </Box>
        <Stack spacing="$6" px="$row-x">
          <SwapField dir="to" />
          {isOutbound ? (
            <Stack spacing="$2">
              <Text variant="Label01">Your BTC Address</Text>
              <Input {...btcAddress} placeholder="Enter a non-Segwit Bitcoin address" />
              {btcAddress.value && !validBtc ? (
                <Text variant="Caption02" color="#ED5653">
                  Invalid address. Please use a non-Segwit address.
                </Text>
              ) : null}
            </Stack>
          ) : null}
          <SwapSummary />
        </Stack>
      </CenterBox>
      {isSignedIn && !isOutbound && swapperId === null ? (
        <Text variant="Caption01" textAlign="center" color="$color-base-white">
          Before you can swap, you need to initialize the bridge contract
        </Text>
      ) : null}
      {swapButton}
    </Stack>
  );
};
