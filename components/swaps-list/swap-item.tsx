import React, { useCallback, useMemo } from 'react';
import { Box, Flex, Stack } from '@nelson-ui/react';
import { Text } from '../text';
import { styled } from '@stitches/react';
import type { SwapListItem } from '../../common/store/swaps';
import { outboundSwapStorageState, useInboundSwapStorage } from '../../common/store/swaps';
import { satsToBtc, truncateMiddle } from '../../common/utils';
import format from 'date-fns/format';
import type { ButtonStatus } from '../button';
import { StatusButton } from '../button';
import { useRouter } from 'next/router';
import { useQueryAtom } from 'jotai-query-toolkit';
import { Spinner } from '../spinner';
import { useStxTxResult } from '../../common/store/api';
import { useFinalizedOutboundSwap } from '../../common/store';
import { TooltipTippy } from '../tooltip';
import { formatDistance } from 'date-fns';
import { CopyTooltip } from '../copy-tooltip';

const SwapRowComp = styled(Box, {
  borderBottom: '1px solid $border-subdued',
  // padding: '20px 0',
  height: '88px',
  width: '100%',
  '&:first-child': {
    borderTop: '1px solid $border-subdued',
  },
  '&:hover': {
    backgroundColor: '$surface-surface--hovered',
  },
});

export const ROW_WIDTHS = [349, 233, 142 + 263, 123];

interface RowProps {
  id: string;
  dir: SwapListItem['dir'];
  amount: string;
  status: ButtonStatus;
  buttonText?: string;
  route: () => void | Promise<void>;
  swapId: string;
}

export const SwapRow: React.FC<RowProps> = ({
  id,
  dir,
  amount,
  status,
  route,
  buttonText: _buttonText,
  swapId,
}) => {
  const maxBtc = useMemo(() => {
    return satsToBtc(amount);
  }, [amount]);
  const date = useMemo(() => {
    const unix = Number(id);
    const d = new Date(unix);
    return format(d, 'yyyy-MM-dd');
  }, [id]);
  const buttonText = useMemo(() => {
    if (status === 'canceled') return 'Canceled';
    if (status === 'error' || status === 'pending') return 'Pending';
    if (status === 'success') return 'Successful';
  }, [status]);
  const tokens = useMemo(() => {
    if (dir === 'inbound') return ['BTC', 'xBTC'];
    return ['xBTC', 'BTC'];
  }, [dir]);
  return (
    <SwapRowComp cursor="pointer" onClick={route}>
      <Flex flexDirection="row" alignItems="center" height="100%">
        <Box width={`${ROW_WIDTHS[0]}px`}>
          <Stack isInline spacing="4px">
            <Text variant="Label02">
              {maxBtc} {tokens[0]}
            </Text>
            <Text variant="Label02" color="$icon-subdued">
              {'\u279E'}
            </Text>
            <Text variant="Label02">{tokens[1]}</Text>
          </Stack>
        </Box>
        <Box width={`${ROW_WIDTHS[1]}px`}>
          <SwapDate time={id} />
        </Box>
        <Box width={`${ROW_WIDTHS[2]}px`}>
          <SwapId swapId={swapId} />
        </Box>
        <Box width={`${ROW_WIDTHS[3]}px`}>
          <StatusButton status={status}>{_buttonText || buttonText}</StatusButton>
        </Box>
      </Flex>
    </SwapRowComp>
  );
};

export const SwapDate: React.FC<{ time: string }> = ({ time }) => {
  const date = useMemo(() => {
    const unix = Number(time);
    const d = new Date(unix);
    return format(d, 'yyyy-MM-dd');
  }, [time]);
  const [year, month, day] = useMemo(() => {
    return date.split('-');
  }, [date]);
  const relative = useMemo(() => {
    const d = new Date(Number(time));
    return formatDistance(d, new Date(), { addSuffix: true });
  }, [time]);
  return (
    <TooltipTippy
      tippyProps={{
        trigger: 'mouseenter focus click',
        followCursor: true,
        placement: 'bottom',
      }}
      render={
        <Text variant="Caption01" color="$text">
          {relative}
        </Text>
      }
    >
      <Stack isInline spacing="1px">
        <Text variant="Label02">{year}</Text>
        <Text variant="Label02" color="$icon-subdued">
          {'-'}
        </Text>
        <Text variant="Label02">{month}</Text>
        <Text variant="Label02" color="$icon-subdued">
          {'-'}
        </Text>
        <Text variant="Label02">{day}</Text>
      </Stack>
    </TooltipTippy>
  );
};

export const SwapId: React.FC<{ swapId?: string }> = ({ swapId }) => {
  if (typeof swapId === 'undefined') return null;

  return (
    <CopyTooltip copyText={swapId}>
      <Text variant="Label02">{truncateMiddle(swapId.replace('0x', ''), 15)}</Text>
    </CopyTooltip>
  );
};

export const InboundSwapItem: React.FC<{ id: string }> = ({ id }) => {
  const [swap] = useInboundSwapStorage(id);
  const router = useRouter();

  const swapId = useMemo(() => {
    if ('btcTxid' in swap) return swap.btcTxid;
    return 'pendingBtcTxid' in swap ? swap.pendingBtcTxid : '';
  }, [swap]);
  const statusInfo: { status: ButtonStatus; buttonText?: string } = useMemo(() => {
    if ('finalizeTxStatus' in swap) {
      if (swap.finalizeTxStatus === 'success') return { status: 'success' };
      if (swap.finalizeTxStatus === 'pending') return { status: 'pending' };
      return { status: 'error', buttonText: 'Error' };
    }
    if ('recoveryTxid' in swap) {
      return {
        status: 'canceled',
        buttonText: 'Recovered',
      };
    }
    if ('pendingBtcTxid' in swap) {
      return { status: 'pending' };
    }
    return { status: 'success', buttonText: 'Started' };
  }, [swap]);
  const goToSwap = useCallback(() => {
    void router.push({
      pathname: '/inbound/[swapId]',
      query: { swapId: swap.id },
    });
  }, [router, swap]);
  return (
    <SwapRow
      id={id}
      amount={swap.inputAmount}
      dir="inbound"
      route={goToSwap}
      swapId={swapId}
      {...statusInfo}
    />
  );
};

export const OutboundSwapItem: React.FC<{ id: string }> = ({ id }) => {
  const router = useRouter();
  const [storage] = useQueryAtom(outboundSwapStorageState(id));
  const { txId } = storage;
  const amount = useMemo(() => {
    return storage.amount || '0';
  }, [storage]);
  const swapId = useStxTxResult<bigint | null>(txId);
  const [finalizeTxid] = useFinalizedOutboundSwap(swapId);
  const status = useMemo(() => {
    if (finalizeTxid) {
      if (finalizeTxid === '00') return 'canceled';
      return 'success';
    }
    return 'pending';
  }, [finalizeTxid]);
  const goToSwap = useCallback(() => {
    void router.push({
      pathname: '/outbound/[txId]',
      query: { txId },
    });
  }, [router, txId]);
  return (
    <SwapRow
      id={id}
      amount={amount}
      dir="outbound"
      route={goToSwap}
      status={status}
      swapId={txId}
    />
  );
};

export const SwapItem: React.FC<{ item: SwapListItem }> = ({ item }) => {
  if (item.dir === 'inbound') {
    return <InboundSwapItem id={item.id} />;
  }
  return <OutboundSwapItem id={item.id} />;
};

export const LoadingRow: React.FC<{ item: SwapListItem }> = ({ item }) => {
  const tokens = useMemo(() => {
    if (item.dir === 'inbound') return ['BTC', 'xBTC'];
    return ['xBTC', 'BTC'];
  }, [item.dir]);
  const date = useMemo(() => {
    const unix = Number(item.id);
    const d = new Date(unix);
    return format(d, 'yyyy-MM-dd');
  }, [item.id]);
  return (
    <SwapRowComp>
      <Flex flexDirection="row" alignItems="center" height="100%">
        <Box width={`${ROW_WIDTHS[0]}px`}>
          <Stack isInline spacing="16px" alignItems="center">
            <Spinner />
            <Text variant="Label02">{tokens.join(' -> ')}</Text>
          </Stack>
        </Box>
        <Box width={`${ROW_WIDTHS[1]}px`}>
          <Text variant="Label02">{date}</Text>
        </Box>
      </Flex>
    </SwapRowComp>
  );
};

export const EmptyRow: React.FC = () => {
  return (
    <SwapRowComp>
      <Flex alignItems="center" height="100%">
        <Text variant="Label02">No swaps found.</Text>
      </Flex>
    </SwapRowComp>
  );
};
