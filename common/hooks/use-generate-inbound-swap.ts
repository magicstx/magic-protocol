import { useGaia } from '@micro-stacks/react';
import { useAtomCallback } from 'jotai/utils';
import { useCallback } from 'react';
import { Supplier, publicKeyState, swapperIdState, useSwapperId } from '../store';
import { createInboundSwap, inboundSwapKey } from '../store/swaps';

interface Generate {
  supplier: Supplier;
  inputAmount: string;
}

export function useGenerateInboundSwap() {
  const { putFile } = useGaia();
  const swapperId = useSwapperId();

  const generate = useAtomCallback(
    useCallback(
      async (get, set, { supplier, inputAmount }: Generate) => {
        const publicKey = get(publicKeyState);
        if (!publicKey) throw new Error('Invalid user state');
        const swap = createInboundSwap({
          supplier,
          publicKey,
          inputAmount,
          swapperId: swapperId === null ? undefined : swapperId,
        });
        const key = inboundSwapKey(swap.id);
        await putFile(key, JSON.stringify(swap), { encrypt: true });
        return swap;
      },
      [putFile, swapperId]
    )
  );

  return { generate };
}
