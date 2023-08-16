import React, { useCallback } from 'react';
import { useInboundSwap } from '../../common/hooks/use-inbound-swap';
import { Stack, Box } from '@nelson-ui/react';
import { useBtcTx, useStxTx, useCoreApiInfo, btcFeesState } from '../../common/store/api';
import { Alert, AlertHeader, AlertText } from '../alert';
import { Text } from '../text';
import { StatusButton } from '../button';
import { useInput } from '../../common/hooks/use-input';
import { useAtom, useAtomValue } from 'jotai';
import { btcAddressState } from '../../common/store';
import { useRecoverSwap } from '../../common/hooks/use-recover-swap';
import { MagicInput } from '../form';
import { useWaitTime } from '../../common/hooks/use-wait-time';
import { useDeepMemo } from '../../common/hooks/use-deep-effect';
import { loadable } from 'jotai/utils';

export const SwapRedeem: React.FC = () => {
  const { swap } = useInboundSwap();
  if (!('btcTxid' in swap)) throw new Error('Invalid swap state - missing btc txid (SwapRedeem)');
  const [escrowTx] = useStxTx('escrowTxid' in swap ? swap.escrowTxid : undefined);
  const [btcTx] = useBtcTx(swap.btcTxid, swap.address);
  const [coreInfo] = useCoreApiInfo();
  const btcAddress = useInput(useAtom(btcAddressState));
  const { submit, txid } = useRecoverSwap();
  // preload
  useAtomValue(loadable(btcFeesState));

  const submitRedeem = useCallback(async () => {
    await submit();
  }, [submit]);

  const confirmBlock = btcTx.burnHeight;
  const currentBlock = coreInfo.burn_block_height;
  const waitBlocks = confirmBlock - currentBlock + swap.expiration;
  const isExpired = waitBlocks <= 0;

  const waitTime = useWaitTime(waitBlocks);

  const isFailed = useDeepMemo(() => {
    if (escrowTx === null) return false;
    const { status } = escrowTx;
    if (status === 'success' || status === 'pending') return false;
    return true;
  }, [escrowTx]);

  if (!isFailed && !isExpired) return null;
  if ('recoveryTxid' in swap) return null;

  return (
    <Alert>
      <Stack spacing="20px">
        <AlertHeader>Recover your BTC</AlertHeader>
        {isExpired ? (
          <>
            <Stack spacing="8px">
              <AlertText>You can now safely withdraw your BTC from escrow.</AlertText>
              <AlertText>Enter the BTC address you&apos;d like to return funds to:</AlertText>
            </Stack>
            {txid ? (
              <Text variant="Body02">{txid}</Text>
            ) : (
              <Stack spacing="20px">
                <MagicInput {...btcAddress} placeholder="Enter a non-segwit address" />
                <Box>
                  <StatusButton onClick={submitRedeem} status="error" showIcon={false}>
                    Continue
                  </StatusButton>
                </Box>
              </Stack>
            )}
          </>
        ) : (
          <>
            <Stack spacing="8px">
              <AlertText>
                Something is wrong with your swap. You may need to cancel and recover.{' '}
              </AlertText>
              <AlertText>
                Your funds are safely escrowed, but for security you can only remove them{' '}
                {waitBlocks} blocks from now ({waitTime}).
              </AlertText>
              <AlertText>
                You can return to this swap anytime from your history page to check the countdown.
              </AlertText>
            </Stack>
            <Box>
              <StatusButton status="error" showIcon={false} disabled>
                Wait {waitBlocks} blocks
              </StatusButton>
            </Box>
          </>
        )}
      </Stack>
    </Alert>
  );
};
