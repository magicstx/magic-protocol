import React, { useCallback } from 'react';
import { Stack, SpaceBetween, Flex } from '@nelson-ui/react';
import { GearIcon } from './icons/gear';
import { showOverrideSupplierState, useSwapForm } from '../common/hooks/use-swap-form';
import { Text } from './text';
import { useAtomCallback } from 'jotai/utils';

export const SwapSummary: React.FC = () => {
  const { feePercent, outputAmount, outputToken, txFeePercent, txFeeBtc } = useSwapForm();
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
    <SpaceBetween padding="8px 24px" backgroundColor="$dark-surface-very-subdued">
      <Text variant="Label02" color="$onSurface-text">
        Fees
      </Text>
      <SpaceBetween spacing="$2">
        <SpaceBetween spacing="$1">
          <Text variant="Label02">
            {txFeeBtc} {receiveToken}
          </Text>
          <Text variant="Label02" color="$text-subdued">
            (-{txFeePercent}%)
          </Text>
        </SpaceBetween>
        <GearIcon onClick={showOverride} cursor="pointer" />
      </SpaceBetween>
    </SpaceBetween>
  );
};
