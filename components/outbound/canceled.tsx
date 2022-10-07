import React from 'react';
import { useOutboundSwap } from '../../common/hooks/use-outbound-swap';
import { satsToBtc } from '../../common/utils';
import { CenterBox, Divider, DoneRow } from '../center-box';

export const SwapCanceled: React.FC = () => {
  const { txId, swap } = useOutboundSwap();

  if (!swap) return null;

  return (
    <CenterBox noPadding>
      <DoneRow txId={txId}>{satsToBtc(swap.xbtc)} xBTC escrowed on Stacks</DoneRow>
      <Divider />
      <DoneRow>Swap canceled - {satsToBtc(swap.xbtc)} xBTC refunded</DoneRow>
    </CenterBox>
  );
};
