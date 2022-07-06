import React from 'react';
import { Stack } from '@nelson-ui/react';
import { Text } from '../text';
import { SwapFieldInput, SwapFieldTo } from './swap-input';
import { SwapSummary } from './swap-summary';
import { CenterBox } from '../center-box';
import {
  pendingRegisterSwapperState,
  showOverrideSupplierState,
  swapFormErrorState,
} from '../../common/store/swap-form';
import { PendingInit } from '../outbound/pending';
import { useAtomValue } from 'jotai/utils';
import { SelectSupplier } from '../select-supplier';
import { RegisterSwap } from '../inbound/register';
import { PendingSwapContainer } from '../pending-swap';
import { pendingInitOutboundState } from '../../common/hooks/tx/use-initiate-outbound';
import { SwapBottom } from './swap-button';
import { SwapFlip } from './swap-flip';
import { BtcInput } from './btc-input';

export const SwapContainer: React.FC = () => {
  const errorMessage = useAtomValue(swapFormErrorState);
  const pendingInitOutbound = useAtomValue(pendingInitOutboundState);
  const showOverrideSupplier = useAtomValue(showOverrideSupplierState);
  const pendingRegisterSwapper = useAtomValue(pendingRegisterSwapperState);
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
          <SwapFieldInput />
        </Stack>
        <SwapFlip />
        <Stack spacing="$6" px="$row-x">
          <SwapFieldTo />
          <BtcInput />
          {typeof errorMessage === 'string' ? (
            <Text variant="Caption02" color="#ED5653">
              {errorMessage}
            </Text>
          ) : null}
          <SwapSummary />
        </Stack>
      </CenterBox>
      <SwapBottom />
    </Stack>
  );
};

// SwapContainer.whyDidYouRender = true;
