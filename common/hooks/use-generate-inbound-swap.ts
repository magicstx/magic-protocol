import { useGaia } from '@micro-stacks/react';
import { useAtomCallback } from 'jotai/utils';
import { useCallback } from 'react';
import { Operator, publicKeyState, swapperIdState, useSwapperId } from '../store';
import { createInboundSwap, inboundSwapKey } from '../store/swaps';

interface Generate {
  operator: Operator;
  inputAmount: string;
}

export function useGenerateInboundSwap() {
  const { putFile } = useGaia();
  const swapperId = useSwapperId();

  const generate = useAtomCallback(
    useCallback(
      async (get, set, { operator, inputAmount }: Generate) => {
        const publicKey = get(publicKeyState);
        if (!publicKey) throw new Error('Invalid user state');
        const swap = createInboundSwap({
          operator,
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
