import React from 'react';
import { Stack } from '@nelson-ui/react';
import { CenterBox, Divider, PendingRow } from '../center-box';
import { useInboundSwap } from '../../common/hooks/use-inbound-swap';
import { useWatchAddress } from '../../common/store/api';
import { useDeepEffect } from '../../common/hooks/use-deep-effect';
import { Text } from '../text';
import { BtcAddress } from './btc-address';
import { useAtom } from 'jotai';
import { footerSwapIdState } from '../../components/footer';

export const SwapReady: React.FC = () => {
  const { swap, step, updateSwap } = useInboundSwap();
  if (!('address' in swap)) throw new Error('Invalid swap state for SwapReady component');
  const [footerSwapId, setSwapId] = useAtom(footerSwapIdState);

  const [txWatch] = useWatchAddress(swap.address);

  useDeepEffect(() => {
    console.log(txWatch);
    if ('txid' in txWatch && txWatch.txid !== footerSwapId) {
      setSwapId(txWatch.txid);
    }
    if (step === 'warned' && txWatch.status === 'confirmed') {
      console.log('updating', txWatch.txData);
      void updateSwap({
        ...swap,
        btcTxid: txWatch.txid,
        satsAmount: txWatch.amount,
        outputIndex: txWatch.outputIndex,
      });
    }
  }, [txWatch, step]);

  return (
    <Stack spacing="$row-y">
      <CenterBox noPadding>
        <BtcAddress />
        <Divider />
        <PendingRow btcTxId={footerSwapId}>
          {txWatch.status === 'unsent' ? 'Waiting for you to send Bitcoin' : null}
          {txWatch.status === 'unconfirmed' ? 'Waiting for your Bitcoin transaction' : null}
        </PendingRow>
      </CenterBox>
    </Stack>
  );
};
