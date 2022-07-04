import { Box, Flex, SpaceBetween, Stack } from '@nelson-ui/react';
import { styled } from '@stitches/react';
import React, { useMemo } from 'react';
import type { FormattedBridgeEvent } from '../../common/events';
import { formattedBridgeEventsState, useStxTx } from '../../common/store/api';
import { ExternalTx } from '../icons/external-tx';
import { Text } from '../text';
import formatDistance from 'date-fns/formatDistance';
import { SafeSuspense } from '../safe-suspense';
import { useAtomValue } from 'jotai/utils';
import { useDeepMemo } from '../../common/hooks/use-deep-effect';

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

export const EventRow: React.FC<{ event: FormattedBridgeEvent }> = ({ event }) => {
  const { txid, print, title, description } = event;
  return (
    <EventRowComp>
      <SpaceBetween alignItems="center">
        <Stack spacing="12px">
          <Text variant="Label02">{title}</Text>
          <Text variant="Caption02">{description}</Text>
        </Stack>
        <Stack spacing="12px" justifyContent={'end'}>
          <Text variant="Caption02" color="$text-dim">
            <SafeSuspense fallback={<></>}>
              <TxDate txid={txid}></TxDate>{' '}
            </SafeSuspense>
          </Text>
          <Flex justifyContent="end">
            <ExternalTx txId={txid} />
          </Flex>
        </Stack>
      </SpaceBetween>
    </EventRowComp>
  );
};

export const Activity: React.FC = () => {
  const events = useAtomValue(formattedBridgeEventsState);

  const rows = useDeepMemo(() => {
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
