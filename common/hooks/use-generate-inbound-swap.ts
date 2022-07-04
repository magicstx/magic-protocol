import { useGaia } from '@micro-stacks/react';
import { useAtomCallback } from 'jotai/utils';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import type { Supplier } from '../store';
import { publicKeyState, swapperIdState } from '../store';
import { createInboundSwap, inboundSwapKey } from '../store/swaps';

interface Generate {
  supplier: Supplier;
  inputAmount: string;
}

export function useGenerateInboundSwap() {
  const { putFile } = useGaia();
  const router = useRouter();
  const testQuery = router.query.test;

  const generate = useAtomCallback(
    useCallback(
      async (get, set, { supplier, inputAmount }: Generate) => {
        const swapperId = get(swapperIdState);
        const publicKey = get(publicKeyState);
        if (!publicKey) throw new Error('Invalid user state');
        const expiration = testQuery === 'error' ? 10 : undefined;
        if (typeof expiration === 'number') {
          console.debug('Setting invalid expiration of', expiration);
        }
        const swap = createInboundSwap({
          supplier,
          publicKey,
          inputAmount,
          swapperId: swapperId === null ? undefined : swapperId,
          expiration,
        });
        console.debug('Generated swap:', swap);
        const key = inboundSwapKey(swap.id);
        await putFile(key, JSON.stringify(swap), { encrypt: true });
        return swap;
      },
      [putFile, testQuery]
    )
  );

  return { generate };
}
