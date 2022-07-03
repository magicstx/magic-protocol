import React, { useMemo, useCallback, useRef } from 'react';
import { Box, Stack } from '@nelson-ui/react';
import { Text } from './text';
import { SwapField, SwapInput } from './swap-input';
import { FlipIcon } from './icons/flip';
import { ReverseIcon } from './icons/reverse';
import { SwapSummary } from './swap-summary';
import { Button } from './button';
import { CenterBox } from './center-box';
import { useSwapForm } from '../common/hooks/use-swap-form';
import {
  inputTokenState,
  isOutboundState,
  outputTokenState,
  pendingRegisterSwapperState,
  showOverrideSupplierState,
  swapFormErrorState,
  swapFormValidState,
} from '../common/store/swap-form';
import { PendingInit } from './outbound/pending';
import { useAuth } from '@micro-stacks/react';
import { Input } from './form';
import { btcAddressState, useSwapperId } from '../common/store';
import { useAtomValue, useAtomCallback } from 'jotai/utils';
import { SelectSupplier } from './select-supplier';
import { RegisterSwap } from './inbound/register';
import type { CSSTypes } from '@nelson-ui/core';
import { PendingSwapContainer } from './pending-swap';
import { useHover } from 'usehooks-ts';
import { useAtom } from 'jotai';
import { pendingInitOutboundState } from '../common/hooks/tx/use-initiate-outbound';
import { useInput } from '../common/hooks/use-input';

export const SwapButton: React.FC = () => {
  const { submit } = useSwapForm();
  const { isSignedIn, handleSignIn } = useAuth();
  const signIn = useCallback(() => handleSignIn(), [handleSignIn]);
  const swapperId = useSwapperId();
  const isValid = useAtomValue(swapFormValidState);
  const isOutbound = useAtomValue(isOutboundState);
  if (!isSignedIn) {
    return (
      <Button onClick={signIn} size="big">
        Connect Wallet
      </Button>
    );
  }
  if (swapperId === null && !isOutbound) {
    return (
      <Button onClick={submit} size="big">
        Authorize
      </Button>
    );
  }
  if (!isValid) {
    return (
      <Button onClick={submit} size="big" disabled={true}>
        Swap
      </Button>
    );
  }
  return (
    <Button onClick={submit} size="big" magic={true}>
      Swap
    </Button>
  );
};

export const SwapContainer: React.FC = () => {
  const switchDirection = useAtomCallback(
    useCallback((get, set) => {
      const outputToken = get(outputTokenState);
      set(inputTokenState, outputToken);
    }, [])
  );
  const isOutbound = useAtomValue(isOutboundState);
  const errorMessage = useAtomValue(swapFormErrorState);
  const pendingInitOutbound = useAtomValue(pendingInitOutboundState);
  const isValid = useAtomValue(swapFormValidState);
  const btcAddress = useInput(useAtom(btcAddressState));
  const swapperId = useSwapperId();
  const { isSignedIn, handleSignIn } = useAuth();
  const showOverrideSupplier = useAtomValue(showOverrideSupplierState);
  const pendingRegisterSwapper = useAtomValue(pendingRegisterSwapperState);
  const signIn = useCallback(() => handleSignIn(), [handleSignIn]);
  const hoverRef = useRef(null);
  const isHoverFlip = useHover(hoverRef);
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
      <PendingSwapContainer />
      <CenterBox noPadding>
        <Stack spacing="$6" px="$row-x">
          <SwapField dir="from" />
        </Stack>
        <Box position="relative" width="100%">
          <Box ref={hoverRef} size={36} mx="auto">
            {isHoverFlip ? (
              <ReverseIcon onClick={switchDirection} mx="auto" cursor="pointer" zIndex="2" />
            ) : (
              <FlipIcon
                mx="auto"
                width="36px"
                height="36px"
                onClick={switchDirection}
                cursor="pointer"
                zIndex="2"
              />
            )}
          </Box>
          <Box
            width="100%"
            position="absolute"
            top="18px"
            border="1px solid $onSurface-border-subdued"
            borderWidth="1px 0 0 0"
            zIndex="-1"
          />
        </Box>
        <Stack spacing="$6" px="$row-x">
          <SwapField dir="to" />
          {isOutbound ? (
            <Stack
              spacing="$2"
              css={
                {
                  '&:focus-within': {
                    '.btc-label': {
                      color: '$onSurface-text-subdued',
                    },
                  },
                } as CSSTypes
              }
            >
              <Text variant="Label02" color="$onSurface-text-dim" className="btc-label">
                Your BTC Address
              </Text>
              <Input {...btcAddress} placeholder="Enter a non-Segwit Bitcoin address" />
            </Stack>
          ) : null}
          {typeof errorMessage === 'string' ? (
            <Text variant="Caption02" color="#ED5653">
              {errorMessage}
            </Text>
          ) : null}
          <SwapSummary />
        </Stack>
      </CenterBox>
      {isSignedIn && !isOutbound && swapperId === null ? (
        <Text variant="Caption01" textAlign="center" color="$text-subdued">
          Before you can swap, you need to authorize the bridge contract
        </Text>
      ) : null}
      <SwapButton />
    </Stack>
  );
};
