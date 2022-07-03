import { Box, Flex, SpaceBetween, Stack } from '@nelson-ui/react';
import { styled } from '@stitches/react';
import { useQueryAtom } from 'jotai-query-toolkit';
import React, { useMemo } from 'react';
import type { BridgeEvent } from '../../common/events';
import { isFinalizeOutboundPrint } from '../../common/events';
import { isInitiateOutboundPrint, Print } from '../../common/events';
import { bridgeEventsState, useStxTx } from '../../common/store/api';
import { getOutboundAddress, satsToBtc } from '../../common/utils';
import { ExternalTx } from '../icons/external-tx';
import { Text } from '../text';
import formatDistance from 'date-fns/formatDistance';
import { SafeSuspense } from '../safe-suspense';

const EventRowComp = styled(Box, {
  borderBottom: '1px solid $border-subdued',
  padding: '20px 0',
  width: '100%',
  '&:first-child': {
    borderTop: '1px solid $border-subdued',
  },
  '&:hover': {
    backgroundColor: '$surface-surface--hovered',
  },
});

export const TxDate: React.FC<{ txid: string }> = ({ txid }) => {
  const [tx] = useStxTx(txid);
  const distance = useMemo(() => {
    if (!tx) return '';
    return formatDistance(new Date(tx.burn_block_time * 1000), new Date(), { addSuffix: true });
  }, [tx]);
  return <>{distance}</>;
};

export const EventRow: React.FC<{ event: BridgeEvent }> = ({ event }) => {
  const { txid, print } = event;

  const title = useMemo(() => {
    if (isInitiateOutboundPrint(print)) return 'Outbound swap started';
    if (isFinalizeOutboundPrint(print)) return 'Outbound swap finalized';
    return print.topic;
  }, [print]);

  const desc = useMemo(() => {
    if (isInitiateOutboundPrint(print)) {
      return `${satsToBtc(print.xbtc)} xBTC ${'\u279E'} ${satsToBtc(print.sats)} BTC`;
    }
    if (isFinalizeOutboundPrint(print)) {
      return `${satsToBtc(print.sats)} BTC to ${getOutboundAddress(print.hash, print.version)}`;
    }
  }, [print]);
  return (
    <EventRowComp>
      <SpaceBetween alignItems="center">
        <Stack spacing="12px">
          <Text variant="Label02">{title}</Text>
          <Text variant="Caption02">{desc}</Text>
        </Stack>
        <Stack spacing="12px" justifyContent={'end'}>
          <Text variant="Label01" color="$text-dim">
            <SafeSuspense fallback={<></>}>
              <TxDate txid={txid}></TxDate>{' '}
            </SafeSuspense>
          </Text>
          <ExternalTx txId={txid} />
        </Stack>
      </SpaceBetween>
    </EventRowComp>
  );
};

export const Activity: React.FC = () => {
  const [events] = useQueryAtom(bridgeEventsState);

  const rows = useMemo(() => {
    return events.map(event => <EventRow event={event} key={event.txid} />);
  }, [events]);
  return (
    <Stack flexWrap="wrap" spacing="$4" width="800px" mt="$6" minHeight="400px">
      <Box>
        <Text variant="Heading02" color="$white">
          Swap history
        </Text>
      </Box>
      <Flex width="100%" flexDirection="column">
        {rows}
      </Flex>
    </Stack>
  );
};
