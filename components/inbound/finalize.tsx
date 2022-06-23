import React, { useCallback, useEffect, useMemo } from 'react';
import { SpaceBetween, Stack } from '@nelson-ui/react';
import { CenterBox, Divider, DoneRow, PendingRow } from '../center-box';
import { useInboundSwap } from '../../common/hooks/use-inbound-swap';
import { useStxTx } from '../../common/store/api';
import { getSwapAmount, satsToBtc } from '../../common/utils';
import { useFinalizeInbound } from '../../common/hooks/tx/use-finalize-inbound';
import { ExternalTx } from '../icons/external-tx';
import { Text } from '../text';
import type { TransactionStatus } from '../../common/api/stacks';
import { SwapRedeem } from './recover';

export const FinalizeRow: React.FC<{ txId?: string; status?: TransactionStatus }> = ({
  txId = '',
  status = 'pending',
}) => {
  if (status === 'pending') {
    return <PendingRow txId={txId}>Waiting for your Stacks transaction</PendingRow>;
  }
  if (status === 'success') {
    return <DoneRow txId={txId}>xBTC escrowed</DoneRow>;
  }

  return (
    <SpaceBetween px="$row-x">
      <Text variant="Label01" color="$text-alert-red">
        Escrow transaction failed
      </Text>
      <ExternalTx txId={txId} />
    </SpaceBetween>
  );
};

export const SwapFinalize: React.FC = () => {
  const { swap, updateSwap } = useInboundSwap();
  if (!('escrowTxid' in swap)) throw new Error('Invalid swap state');
  const [escrowTx] = useStxTx(swap.escrowTxid);
  const xbtc = useMemo(() => {
    return getSwapAmount(swap.satsAmount, swap.supplier.inboundFee, swap.supplier.inboundBaseFee);
  }, [swap.satsAmount, swap.supplier.inboundFee, swap.supplier.inboundBaseFee]);

  const finalizeTx = useFinalizeInbound({
    txid: swap.btcTxid,
    preimage: swap.secret,
    xbtc,
  });

  useEffect(() => {
    if (escrowTx?.tx_status === 'success') {
      void finalizeTx.submit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [escrowTx?.tx_status]);

  const setTxid = useCallback(async () => {
    if ('finalizeTxid' in swap || !finalizeTx.txId) return;
    await updateSwap({
      finalizeTxid: finalizeTx.txId,
    });
  }, [swap, finalizeTx.txId, updateSwap]);

  useEffect(() => {
    void setTxid();
  }, [setTxid]);

  return (
    <Stack spacing="$row-y" justifyContent="center" alignItems="center">
      <CenterBox noPadding>
        <DoneRow btcTxId={swap.btcTxid}>Sent {satsToBtc(swap.satsAmount)} BTC</DoneRow>
        <Divider />
        <FinalizeRow txId={swap.escrowTxid} status={escrowTx?.status} />
        {'recoveryTxid' in swap ? (
          <>
            <Divider />
            <DoneRow btcTxId={swap.recoveryTxid}>BTC recovered</DoneRow>
          </>
        ) : null}
      </CenterBox>
      <SwapRedeem />
    </Stack>
  );
};
