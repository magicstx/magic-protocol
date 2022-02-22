import React, { memo } from 'react';
import { Flex, Grid, Stack, Box } from '@nelson-ui/react';
import { CenterBox, PendingRow, DoneRow, Divider } from '../center-box';
import { useOutboundSwap } from '../../common/hooks/use-outbound-swap';
import { satsToBtc } from '../../common/utils';
import { XBtcIcon } from '../icons/xbtc';
import { BtcIcon } from '../icons/btc';
import BigNumber from 'bignumber.js';
import { Text } from '../text';
import { MagicArrow } from '../icons/magic-arrow';

export const FinalRow: React.FC = () => {
  const { finalizeTxid } = useOutboundSwap();

  if (finalizeTxid) {
    return <DoneRow>Swap complete</DoneRow>;
  }

  return <PendingRow>Waiting for settlement on Stacks</PendingRow>;
};

const FinalSummaryComp: React.FC<{ xbtcAmountSats: bigint; satsAmount: bigint }> = ({
  xbtcAmountSats,
  satsAmount,
}) => {
  const xbtcAmount = satsToBtc(xbtcAmountSats);
  const btcAmount = satsToBtc(satsAmount);
  const fee = new BigNumber(btcAmount).minus(xbtcAmount).decimalPlaces(8).toString();
  return (
    <Flex flexDirection="row" px="$row-x" textAlign="center">
      <Stack justifyContent="center" spacing="10px" flexShrink="1" flexBasis="75px">
        <XBtcIcon size={50} mx="auto" display="block" />
        <Stack spacing="$0">
          <Text variant="Label01" color="$color-slate-95">
            {xbtcAmount}
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
            {fee}
          </Text>
          <Text variant="Label02" color="$color-slate-85">
            xBTC fees
          </Text>
        </Stack>
      </Stack>
      <Stack justifyContent="center" spacing="10px" flexShrink="1" flexBasis="75px">
        <BtcIcon size={50} mx="auto" />
        <Stack spacing="$0">
          <Text variant="Label01" color="$color-slate-95">
            {btcAmount}
          </Text>
          <Text variant="Label02" color="$color-slate-85">
            BTC
          </Text>
        </Stack>
      </Stack>
    </Flex>
  );
};

const FinalSummary = memo(FinalSummaryComp);

export const SwapConfirmed: React.FC = () => {
  const { initTx, swap, btcTxId } = useOutboundSwap();

  if (!swap) return null;

  return (
    <Stack spacing="$row-y">
      <CenterBox noPadding>
        <DoneRow txId={initTx?.tx_id}>xBTC escrowed</DoneRow>
        <Divider />
        <DoneRow btcTxId={btcTxId}>BTC sent to your address</DoneRow>
        <Divider />
        <FinalSummary xbtcAmountSats={swap.xbtc} satsAmount={swap.sats} />
      </CenterBox>
    </Stack>
  );
};
