import { Box, SpaceBetween, Stack } from '@nelson-ui/react';
import { useAtomValue } from 'jotai/utils';
import { useRouter } from 'next/router';
import React, { useCallback, useMemo, useState } from 'react';
import { allSwapsState } from '../common/store/swaps';
import { CloseIcon } from './icons/close';
import { PendingIcon } from './icons/pending';
import { SafeSuspense } from './safe-suspense';
import { Text } from './text';

export const PendingSwap: React.FC = () => {
  const allSwaps = useAtomValue(allSwapsState);
  const router = useRouter();
  const [hidden, setHidden] = useState(false);

  const pendingSwap = useMemo(() => {
    return allSwaps.find(swap => {
      if ('secret' in swap) {
        // outbound
        if (!('btcTxid' in swap)) return false;
        if (!('recoveryTxid' in swap) && !('finalizeTxid' in swap)) {
          return true;
        }
      } else {
        if (typeof swap.finalizeTxid === 'undefined') return true;
      }
    });
  }, [allSwaps]);

  const goToSwap = useCallback(() => {
    if (typeof pendingSwap === 'undefined') return;
    if ('secret' in pendingSwap) {
      void router.push({
        pathname: '/inbound/[swapId]',
        query: { swapId: pendingSwap.id },
      });
    } else {
      void router.push({
        pathname: '/outbound/[txId]',
        query: { txId: pendingSwap.txId },
      });
    }
  }, [pendingSwap, router]);

  const hide = useCallback(() => {
    setHidden(true);
  }, [setHidden]);

  if (typeof pendingSwap === 'undefined') return null;
  if (hidden) return null;

  return (
    <Box
      backgroundColor="$dark-surface-warning"
      border="1px solid $dark-border-warning-subdued"
      p="30px"
      borderRadius="16px"
    >
      <SpaceBetween>
        <Stack isInline alignItems="center">
          <PendingIcon color="var(--colors-dark-warning-action-warning)" />
          <Text variant="Label02" color="$dark-warning-action-warning">
            You may have a{' '}
            <Text
              variant="Label02"
              textDecoration="underline"
              color="inherit"
              display="inline-block"
              cursor="pointer"
              onClick={goToSwap}
              style={{
                textDecoration: 'underline',
              }}
            >
              swap in progress
            </Text>
            {'.'}
          </Text>
        </Stack>
        <CloseIcon onClick={hide} cursor="pointer" />
      </SpaceBetween>
    </Box>
  );
};

export const PendingSwapContainer: React.FC = () => {
  return (
    <SafeSuspense fallback={<></>}>
      <PendingSwap />
    </SafeSuspense>
  );
};
