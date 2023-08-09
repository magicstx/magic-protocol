import React, { useCallback, useEffect } from 'react';
import { Stack } from '@nelson-ui/react';
import { CenterBox, Divider, DoneRow } from '../center-box';
import { useInboundSwap } from '../../common/hooks/use-inbound-swap';
import { Button } from '../button';
import { useEscrowSwap } from '../../common/hooks/tx/use-escrow-swap';
import { satsToBtc } from '../../common/utils';
import { BtcAddress } from './btc-address';
import { SwapRedeem } from './recover';

export const SwapEscrow: React.FC = () => {
  const { swap, updateSwap } = useInboundSwap();
  if (!('btcTxid' in swap)) throw new Error('Invalid swap state');

  const escrowSwap = useEscrowSwap(swap);

  const setTxid = useCallback(async () => {
    if ('escrowTxid' in swap || !escrowSwap.txId) return;
    await updateSwap({
      escrowTxid: escrowSwap.txId,
    });
  }, [swap, escrowSwap.txId, updateSwap]);

  useEffect(() => {
    void setTxid();
  }, [setTxid]);

  return (
    <Stack spacing="$row-y">
      <CenterBox noPadding>
        <BtcAddress />
        <Divider />
        <DoneRow btcTxId={swap.btcTxid}>{satsToBtc(swap.satsAmount)} BTC received</DoneRow>
      </CenterBox>
      <SwapRedeem />
      <Button width="260px" mx="auto" size="big" onClick={escrowSwap.submit}>
        Continue
      </Button>
    </Stack>
  );
};
