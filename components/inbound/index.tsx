import React, { useEffect } from 'react';
import { Stack } from '@nelson-ui/react';
import { useInboundSwap } from '../../common/hooks/use-inbound-swap';
import { CenterBox } from '../center-box';
import { getSwapStep, useSwapId } from '../../common/store/swaps';
import { RegisterSwap } from './register';
import { SwapReady } from './ready';
import { SwapEscrow } from './escrow';
import { SwapFinalize } from './finalize';
import { SwapDone } from './done';
import { SwapWarning } from './warning';
import { useSetTitle } from '../head';

export const InboundSwap: React.FC = () => {
  const { swap } = useInboundSwap();
  const step = getSwapStep(swap);
  useSetTitle('Swap BTC -> xBTC');
  const [_, setSwapId] = useSwapId();
  useEffect(() => {
    return () => {
      setSwapId(undefined);
    };
  }, [setSwapId]);

  if (step === 'start') {
    return <RegisterSwap />;
  }
  if (step === 'ready') {
    return <SwapWarning />;
  }
  if (step === 'warned') {
    return <SwapReady />;
  }
  if (step === 'sent') {
    return <SwapEscrow />;
  }
  if (step === 'escrowed') {
    return <SwapFinalize />;
  }
  if (step === 'finalize') {
    return <SwapDone />;
  }

  return (
    <Stack spacing="$row-y">
      <CenterBox>
        <pre>{JSON.stringify(swap, null, 2)}</pre>
      </CenterBox>
    </Stack>
  );
};
