import React, { useCallback, useMemo } from 'react';
import { useInboundSwap } from '../../common/hooks/use-inbound-swap';
import { Stack, Flex } from '@nelson-ui/react';
import { useBtcTx, useStxTx, useCoreApiInfo } from '../../common/store/api';
import { Alert } from '../alert';
import { Text } from '../text';
import { ErrorIcon } from '../icons/error';
import { Button } from '../button';
import { useInput } from '../../common/hooks/use-input';
import { useAtom } from 'jotai';
import { btcAddressState } from '../../common/store';
import { useRecoverSwap } from '../../common/hooks/use-recover-swap';
import { Input } from '../form';

export const SwapRedeem: React.FC = () => {
  const { swap, updateSwap } = useInboundSwap();
  if (!('escrowTxid' in swap)) throw new Error('Invalid swap state');
  const [escrowTx] = useStxTx(swap.escrowTxid);
  const [btcTx] = useBtcTx(swap.btcTxid, swap.address);
  const [coreInfo] = useCoreApiInfo();
  const btcAddress = useInput(useAtom(btcAddressState));
  const { submit, txid } = useRecoverSwap();

  const submitRedeem = useCallback(async () => {
    await submit();
  }, [submit]);

  const confirmBlock = btcTx.burnHeight;
  const currentBlock = coreInfo.burn_block_height;
  const waitBlocks = confirmBlock - currentBlock + swap.expiration;
  const isExpired = waitBlocks <= 0;

  const waitTime = useMemo(() => {
    if (waitBlocks > 144) {
      return `${(waitBlocks / 144).toFixed(1)} days`;
    } else if (waitBlocks > 6) {
      return `${(waitBlocks / 6).toFixed(1)} hours`;
    }
    return `${waitBlocks * 10} minutes`;
  }, [waitBlocks]);

  if (escrowTx?.status !== 'abort_by_response') return null;
  if ('recoveryTxid' in swap) return null;

  return (
    <Alert>
      <Stack spacing="$2">
        <Flex alignItems="center">
          <ErrorIcon />
          <Text
            variant="Label02"
            display="inline-block"
            ml="$2"
            color="$color-alert-red"
            fontWeight="500 !important"
          >
            Supplier no longer has enough xBTC
          </Text>
        </Flex>
        {isExpired ? (
          <>
            <Text color="$color-alert-red" variant="Body02">
              You can now safely withdraw your BTC from escrow.
            </Text>
            <Text color="$color-alert-red" variant="Body02">
              Enter the BTC address you&apos;d like to return funds to:
            </Text>
            {txid ? (
              <Text variant="Body02">{txid}</Text>
            ) : (
              <Stack spacing="$4" mt="$4">
                <Input {...btcAddress} placeholder="Enter a non-segwit address" />
                <Button onClick={submitRedeem}>Continue</Button>
              </Stack>
            )}
          </>
        ) : (
          <>
            <Text color="$color-alert-red" variant="Body02">
              Something is wrong with the supplier. They may add funds momentarily or you may need
              to cancel and recover.{' '}
            </Text>
            <Text color="$color-alert-red" variant="Body02">
              Your funds are safely escrowed, but for security you can only remove them {waitBlocks}{' '}
              blocks from now ({waitTime}).
            </Text>
            <Text color="$color-alert-red" variant="Body02">
              You can return to this swap anytime from your history page to check the countdown.
            </Text>
          </>
        )}
      </Stack>
    </Alert>
  );
};
