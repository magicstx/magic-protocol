import React, { useMemo } from 'react';
import { Stack, Box } from '@nelson-ui/react';
import { useOutboundSwap } from '../../common/hooks/use-outbound-swap';
import { useCoreApiInfo } from '../../common/store/api';
import { Alert, AlertHeader, AlertText } from '../alert';
import { useWaitTime } from '../../common/hooks/use-wait-time';
import { StatusButton } from '../button';

// How many blocks before we show "supplier is unresponsive"
const UNRESPONSIVE_MIN_DELAY = 4;
const OUTBOUND_EXPIRATION = 200;

export const SwapRevoke: React.FC = () => {
  const { swap, revokeTxid, submitRevoke } = useOutboundSwap();
  const [coreInfo] = useCoreApiInfo();
  const blocksSinceStart = useMemo(() => {
    if (swap === null) return 0;
    return coreInfo.burn_block_height - Number(swap['created-at']);
  }, [swap, coreInfo.burn_block_height]);
  const waitBlocks = OUTBOUND_EXPIRATION - blocksSinceStart;
  const waitTime = useWaitTime(waitBlocks);
  const isExpired = waitBlocks <= 0;

  if (swap === null) {
    return null;
  }

  if (blocksSinceStart < UNRESPONSIVE_MIN_DELAY) {
    return null;
  }

  return (
    <Alert>
      <Stack spacing="$2">
        <AlertHeader>Supplier not responsive</AlertHeader>
        {isExpired ? (
          <>
            <AlertText>You can now safely cancel your swap and get your xBTC back.</AlertText>
            <Box mt="$3">
              <StatusButton status="error" onClick={submitRevoke}>
                Cancel
              </StatusButton>
            </Box>
          </>
        ) : (
          <>
            <AlertText>
              Something is wrong with the supplier. They may add funds momentarily or you may need
              to cancel and recover.{' '}
            </AlertText>
            <AlertText>
              Your funds are safely escrowed, but for security you can only remove them {waitBlocks}{' '}
              blocks from now ({waitTime}).
            </AlertText>
            <AlertText>
              You can return to this swap anytime from your history page to check the countdown.
            </AlertText>
          </>
        )}
      </Stack>
    </Alert>
  );
};
