import React from 'react';
import { Stack } from '@nelson-ui/react';
import { CenterBox, Divider, DoneRow, PendingRow } from '../center-box';
import { useOutboundSwap } from '../../common/hooks/use-outbound-swap';
import { satsToBtc } from '../../common/utils';
import { SwapRevoke } from './revoke';

export const SwapInitialized: React.FC = () => {
  const { txId, swap, revokeTxid } = useOutboundSwap();

  return (
    <Stack spacing="$row-y" justifyContent="center" alignItems="center">
      <CenterBox noPadding>
        {swap ? (
          <DoneRow txId={txId}>{satsToBtc(swap.xbtc)} xBTC escrowed on Stacks</DoneRow>
        ) : (
          <PendingRow txId={txId}>Waiting for your Stacks transaction</PendingRow>
        )}
        {swap ? (
          <>
            <Divider />
            <PendingRow>Waiting on supplier transaction</PendingRow>
          </>
        ) : null}
        {revokeTxid ? (
          <>
            <Divider />
            <PendingRow txId={revokeTxid}>Canceling swap</PendingRow>
          </>
        ) : null}
      </CenterBox>
      <SwapRevoke />
    </Stack>
  );
};
