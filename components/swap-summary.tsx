import React, { useCallback, useMemo } from 'react';
import { Stack, SpaceBetween, Flex } from '@nelson-ui/react';
import { GearIcon } from './icons/gear';
import { showOverrideSupplierState, useSwapForm } from '../common/hooks/use-swap-form';
import { Text } from './text';
import { useAtomCallback } from 'jotai/utils';
import { TooltipTippy } from './tooltip';
import { getSwapAmount, satsToBtc } from '../common/utils';
import BigNumber from 'bignumber.js';

export const SwapSummary: React.FC = () => {
  const {
    feePercent,
    outputAmount,
    amount,
    outputToken,
    txFeePercent,
    txFeeBtc,
    supplierBaseFee,
    supplierFeeRate,
  } = useSwapForm();
  const receiveToken = outputToken === 'btc' ? 'BTC' : 'xBTC';
  const feeFromRate = useMemo(() => {
    const amountBN = new BigNumber(amount.value).shiftedBy(8).decimalPlaces(0);
    const sats = getSwapAmount(amountBN.toString(), supplierFeeRate);
    const diff = amountBN.minus(sats.toString());
    return satsToBtc(diff.toString());
  }, [amount.value, supplierFeeRate]);
  const showOverride = useAtomCallback(
    useCallback((get, set) => {
      set(showOverrideSupplierState, true);
    }, [])
  );

  const tooltipContent = useMemo(() => {
    return (
      <Stack spacing="6px" width="365px">
        <SpaceBetween>
          <Text variant="Caption01" color="$text">
            Supplier fee
            <Text variant="Caption01" color="$text-subdued" display="inline" ml="$1">
              ({feePercent}%)
            </Text>
          </Text>
          <Text variant="Caption01" color="$text">
            {feeFromRate}
            <Text variant="Caption01" color="$text-subdued" display="inline" ml="$1">
              BTC
            </Text>
          </Text>
        </SpaceBetween>
        <SpaceBetween>
          <Text variant="Caption01" color="$text">
            Supplier base fee
          </Text>
          <Text variant="Caption01" color="$text">
            {satsToBtc(supplierBaseFee)}
            <Text variant="Caption01" color="$text-subdued" display="inline" ml="$1">
              BTC
            </Text>
          </Text>
        </SpaceBetween>
      </Stack>
    );
  }, [feePercent, feeFromRate, supplierBaseFee]);

  if (outputAmount === '0') {
    return null;
  }

  return (
    <TooltipTippy
      render={tooltipContent}
      tippyProps={{ followCursor: true, placement: 'bottom', offset: [0, 30] }}
      containerProps={{
        padding: '17px 19px 19px 19px',
      }}
    >
      <SpaceBetween
        padding="22px 24px"
        backgroundColor="$dark-surface-very-subdued"
        onClick={showOverride}
        cursor="pointer"
      >
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
          <GearIcon />
        </SpaceBetween>
      </SpaceBetween>
    </TooltipTippy>
  );
};
