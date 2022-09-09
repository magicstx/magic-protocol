import React, { useEffect } from 'react';
import { Stack } from '@nelson-ui/react';
import { Text } from '../text';
import { SwapFieldInput, SwapFieldTo } from './swap-input';
import { SwapSummary } from './swap-summary';
import { CenterBox } from '../center-box';
import {
  amountSatsBNState,
  pendingRegisterSwapperState,
  showOverrideSupplierState,
  swapFormErrorState,
  outboundTxidState,
} from '../../common/store/swap-form';
import { PendingInit } from '../outbound/pending';
import { useCallback } from 'react';
import { useAtomValue, useAtomCallback } from 'jotai/utils';
import { SelectSupplier } from '../select-supplier';
import { RegisterSwap } from '../inbound/register';
import { PendingSwapContainer } from '../pending-swap';
import { pendingInitOutboundState } from '../../common/hooks/tx/use-initiate-outbound';
import { SwapBottom } from './swap-button';
import { SwapFlip } from './swap-flip';
import { BtcInput } from './btc-input';
import { useGenerateOutboundSwap } from '../../common/hooks/use-generate-outbound-swap';
import { useRouter } from 'next/router';

export const SwapContainer: React.FC = () => {
  const { generate: generateOutbound } = useGenerateOutboundSwap();
  const router = useRouter();
  const routeToOutbound = useAtomCallback(
    useCallback(
      async (get, set, txId: string) => {
        const amount = get(amountSatsBNState);
        await generateOutbound({ txId, amount: amount.toString() });
        await router.push({
          pathname: '/outbound/[txId]',
          query: { txId },
        });
      },
      [generateOutbound, router]
    )
  );
  const outboundTxid = useAtomValue(outboundTxidState);
  const errorMessage = useAtomValue(swapFormErrorState);
  const pendingInitOutbound = useAtomValue(pendingInitOutboundState);
  const showOverrideSupplier = useAtomValue(showOverrideSupplierState);
  const pendingRegisterSwapper = useAtomValue(pendingRegisterSwapperState);

  useEffect(() => {
    if (outboundTxid) {
      console.debug(`New outbound swap with Stacks txid: ${outboundTxid}`);
      void routeToOutbound(outboundTxid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outboundTxid]);
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
      <CenterBox noPadding boxProps={{ pt: '23px' }}>
        <Stack spacing="$6" px="$row-x">
          <SwapFieldInput />
        </Stack>
        <SwapFlip />
        <Stack spacing="13px" px="$row-x" position="relative" top="-7px">
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
