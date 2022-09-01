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
    <Flex flexDirection="row" px="$row-x" textAlign="center" alignItems="center">
      <Stack justifyContent="center" spacing="10px" flexShrink="1" flexBasis="75px">
        <XBtcIcon size={50} mx="auto" display="block" />
        <Stack spacing="$0">
          <Text variant="Label01" color="$text">
            {xbtcAmount}
          </Text>
          <Text variant="Label02" color="$text-subdued">
            xBTC
          </Text>
        </Stack>
      </Stack>
      <Stack flexGrow="1" spacing="10px" pt="13px">
        <MagicArrow mx="auto" display="block" width="100px" position="relative" top="-3px" />
        <Stack spacing="$0" mt="3px">
          <Text variant="Label01" color="$text">
            {fee}
          </Text>
          <Text variant="Label02" color="$text-subdued">
            xBTC fees
          </Text>
        </Stack>
      </Stack>
      <Stack justifyContent="center" spacing="10px" flexShrink="1" flexBasis="75px">
        <BtcIcon size={50} mx="auto" />
        <Stack spacing="$0">
          <Text variant="Label01" color="$text">
            {btcAmount}
          </Text>
          <Text variant="Label02" color="$text-subdued">
            BTC
          </Text>
        </Stack>
      </Stack>
    </Flex>
  );
};

const FinalSummary = memo(FinalSummaryComp);

const SwapBtcPending: React.FC<{ txid?: string }> = ({ txid }) => {
  return <PendingRow btcTxId={txid}>BTC sent, waiting for confirmation</PendingRow>;
};

export const SwapConfirmed: React.FC = () => {
  const { initTx, swap, btcTxId, unspent } = useOutboundSwap();

  if (!swap) return null;

  return (
    <Stack spacing="$row-y">
      <CenterBox noPadding>
        <DoneRow txId={initTx?.tx_id}>xBTC escrowed</DoneRow>
        <Divider />
        {unspent?.height === 0 ? (
          <SwapBtcPending txid={btcTxId} />
        ) : (
          <>
            <DoneRow btcTxId={btcTxId}>BTC sent to your address</DoneRow>
            <Divider />
            <FinalSummary xbtcAmountSats={swap.xbtc} satsAmount={swap.sats} />
          </>
        )}
      </CenterBox>
    </Stack>
  );
};
