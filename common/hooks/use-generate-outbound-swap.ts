import { useGaia } from '@micro-stacks/react';
import { useAtomCallback } from 'jotai/utils';
import { useCallback } from 'react';
import { createId, outboundSwapKey, OutboundSwapStarted } from '../store/swaps';

interface Generate {
  txId: string;
  amount: string;
}

export function useGenerateOutboundSwap() {
  const { putFile } = useGaia();

  const generate = useCallback(
    async ({ txId, amount }: Generate) => {
      const swap: OutboundSwapStarted = {
        txId,
        createdAt: new Date().getTime(),
        id: createId(),
        amount,
      };
      const key = outboundSwapKey(swap.id);
      await putFile(key, JSON.stringify(swap), { encrypt: true });
      return swap;
    },
    [putFile]
  );

  return { generate };
}
