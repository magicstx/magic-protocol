import React, { useCallback } from 'react';
import { Stack, SpaceBetween, Flex } from '@nelson-ui/react';
import { GearIcon } from './icons/gear';
import { showOverrideSupplierState, useSwapForm } from '../common/hooks/use-swap-form';
import { Text } from './text';
import { useAtomCallback } from 'jotai/utils';

export const SwapSummary: React.FC = () => {
  const { feePercent, outputAmount, outputToken } = useSwapForm();
  const receiveToken = outputToken === 'btc' ? 'BTC' : 'xBTC';
  const showOverride = useAtomCallback(
    useCallback((get, set) => {
      set(showOverrideSupplierState, true);
    }, [])
  );

  if (outputAmount === '0') {
    return null;
  }
  return (
    <SpaceBetween
      backgroundColor="$color-surface"
      spacing="$3"
      padding="8px 24px 8px 13px"
      borderRadius="$medium"
    >
      <Stack spacing="0px">
        <Text variant="Label03" color="$color-primary-text">
          Supplier fee: {feePercent}%
        </Text>
        <Text variant="Label02">
          You will receive {outputAmount} {receiveToken}
        </Text>
      </Stack>
      <GearIcon onClick={showOverride} cursor="pointer" />
    </SpaceBetween>
  );
};
