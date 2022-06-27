import { useGaia } from '@micro-stacks/react';
import { useRouter } from 'next/router';
import { useCallback, useMemo, useEffect } from 'react';
import {
  getSwapStep,
  InboundSwap,
  inboundSwapKey,
  useInboundSwapStorage,
  useSwapId,
} from '../store/swaps';
import NProgress from 'nprogress';

type SwapStep = ReturnType<typeof getSwapStep>;

export function useInboundSwap() {
  const router = useRouter();
  const storageId = router.query.swapId;
  if (typeof storageId !== 'string') throw new Error('Invalid swapId');
  const [swap, { setQueryData }] = useInboundSwapStorage(storageId);
  const { putFile } = useGaia();
  const [footerSwapId, setSwapId] = useSwapId();

  const step = useMemo(() => {
    return getSwapStep(swap);
  }, [swap]);

  const updateSwap = useCallback(
    async (swapData: Partial<InboundSwap>) => {
      NProgress.start();
      const key = inboundSwapKey(swap.id);
      const newSwap: InboundSwap = {
        ...swap,
        ...swapData,
      };
      setQueryData({ data: newSwap });
      const url = await putFile(key, JSON.stringify(newSwap), { encrypt: true });
      NProgress.done();
      return url;
    },
    [putFile, setQueryData, swap]
  );

  const swapId = useMemo(() => {
    return 'btcTxid' in swap ? swap.btcTxid : '';
  }, [swap]);

  useEffect(() => {
    if (swapId && footerSwapId !== swapId) {
      setSwapId(swapId);
    }
  }, [swapId, setSwapId, footerSwapId]);

  return { updateSwap, swap, swapId, step: step };
}
