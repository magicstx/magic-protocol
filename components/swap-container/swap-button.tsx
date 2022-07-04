import React, { useCallback } from 'react';
import { Button } from '../button';
import { useSwapForm } from '../../common/hooks/use-swap-form';
import { isOutboundState, swapFormValidState } from '../../common/store/swap-form';
import { useAuth } from '@micro-stacks/react';
import { useSwapperId } from '../../common/store';
import { useAtomValue } from 'jotai/utils';
import { Text } from '../text';

export const SwapBottom: React.FC = () => {
  const isOutbound = useAtomValue(isOutboundState);
  const swapperId = useSwapperId();
  const { isSignedIn } = useAuth();
  return (
    <>
      {isSignedIn && !isOutbound && swapperId === null ? (
        <Text variant="Caption01" textAlign="center" color="$text-subdued">
          Before you can swap, you need to authorize the bridge contract
        </Text>
      ) : null}
      <SwapButton />
    </>
  );
};

export const SwapButton: React.FC = () => {
  const { submit } = useSwapForm();
  const { isSignedIn, handleSignIn } = useAuth();
  const signIn = useCallback(() => handleSignIn(), [handleSignIn]);
  const swapperId = useSwapperId();
  const isValid = useAtomValue(swapFormValidState);
  const isOutbound = useAtomValue(isOutboundState);
  if (!isSignedIn) {
    return (
      <Button onClick={signIn} size="big">
        Connect Wallet
      </Button>
    );
  }
  if (swapperId === null && !isOutbound) {
    return (
      <Button onClick={submit} size="big">
        Authorize
      </Button>
    );
  }
  if (!isValid) {
    return (
      <Button onClick={submit} size="big" disabled={true}>
        Swap
      </Button>
    );
  }
  return (
    <Button onClick={submit} size="big" magic={true}>
      Swap
    </Button>
  );
};

// SwapButton.whyDidYouRender = true;
