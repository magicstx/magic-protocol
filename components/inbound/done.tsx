import React, { memo } from 'react';
import { Box, Flex, Grid, SpaceBetween, Stack } from '@nelson-ui/react';
import { CenterBox, Divider, DoneRow, PendingRow } from '../center-box';
import { useInboundSwap } from '../../common/hooks/use-inbound-swap';
import { useStxTx } from '../../common/store/api';
import { ExternalTx } from '../icons/external-tx';
import { getSwapAmount, satsToBtc } from '../../common/utils';
import { XBtcIcon } from '../icons/xbtc';
import { BtcIcon } from '../icons/btc';
import { Text } from '../text';
import { MagicArrow } from '../icons/magic-arrow';
import BigNumber from 'bignumber.js';

export const FinalRow: React.FC<{ txId: string; status: string }> = ({ txId }) => {
  const [tx] = useStxTx(txId);
  const status = tx?.status || 'pending';
  if (status === 'pending') {
    return <PendingRow txId={txId}>Waiting for your Stacks transaction</PendingRow>;
  }
  if (status === 'abort_by_post_condition' || status === 'abort_by_response') {
    return (
      <SpaceBetween px="$row-x">
        <Text variant="Label01" color="$text-critical">
          There was an error when finalizing your transaction.
        </Text>
        <ExternalTx txId={txId} />
      </SpaceBetween>
    );
  }

  return <DoneRow txId={txId}>Swap complete</DoneRow>;
};

const FinalSummaryComp: React.FC<{ satsAmount: string; fee: number; baseFee: number }> = ({
  satsAmount,
  fee,
  baseFee,
}) => {
  const btcAmount = satsToBtc(satsAmount);
  const xbtcAmount = satsToBtc(getSwapAmount(satsAmount, fee, baseFee));
  const feeAmt = new BigNumber(xbtcAmount).minus(btcAmount).decimalPlaces(8).toString();
  return (
    <Flex flexDirection="row" px="$row-x" textAlign="center">
      <Stack justifyContent="center" spacing="10px" flexShrink="1" flexBasis="75px">
        <BtcIcon size={50} mx="auto" display="block" />
        <Stack spacing="$0">
          <Text variant="Label01" color="$color-slate-95">
            {btcAmount}
          </Text>
          <Text variant="Label02" color="$color-slate-85">
            xBTC
          </Text>
        </Stack>
      </Stack>
      <Stack flexGrow="1" spacing="10px" pt="5px">
        <MagicArrow mx="auto" display="block" width="100px" />
        <Stack spacing="$0">
          <Text variant="Label01" color="$color-slate-95">
            {feeAmt}
          </Text>
          <Text variant="Label02" color="$color-slate-85">
            BTC fees
          </Text>
        </Stack>
      </Stack>
      <Stack justifyContent="center" spacing="10px" flexShrink="1" flexBasis="75px">
        <XBtcIcon size={50} mx="auto" />
        <Stack spacing="$0">
          <Text variant="Label01" color="$color-slate-95">
            {xbtcAmount}
          </Text>
          <Text variant="Label02" color="$color-slate-85">
            xBTC
          </Text>
        </Stack>
      </Stack>
    </Flex>
  );
};

const FinalSummary = memo(FinalSummaryComp);

export const SwapDone: React.FC = () => {
  const { swap } = useInboundSwap();
  if (!('finalizeTxid' in swap)) throw new Error('Invalid swap state');
  const [finalizeTx] = useStxTx(swap.finalizeTxid);
  const status = finalizeTx?.status || 'pending';

  return (
    <Stack spacing="$row-y">
      <CenterBox noPadding>
        <DoneRow btcTxId={swap.btcTxid}>Sent {satsToBtc(swap.satsAmount)} BTC</DoneRow>
        <Divider />
        <DoneRow txId={swap.escrowTxid}>Escrow transaction confirmed</DoneRow>
        <Divider />
        <FinalRow txId={swap.finalizeTxid} status={status} />
        {status === 'success' ? (
          <>
            <Divider />
            <FinalSummary
              satsAmount={swap.satsAmount}
              fee={swap.operator.inboundFee}
              baseFee={swap.operator.inboundBaseFee}
            />
          </>
        ) : null}
      </CenterBox>
    </Stack>
  );
};
