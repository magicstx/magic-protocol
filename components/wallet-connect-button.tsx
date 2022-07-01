import React, { useCallback, useMemo, useState } from 'react';
import { useAuth } from '@micro-stacks/react';
import { useRouter } from 'next/router';
import { Button } from './button';
import { useAtomValue } from 'jotai/utils';
import { currentStxAddressState } from '../common/store';
import { truncateMiddle } from '../common/utils';

export const WalletConnectButton: React.FC = () => {
  const [isHover, setIsHover] = useState(false);
  const { isSignedIn, handleSignIn, handleSignOut, isLoading } = useAuth();
  const address = useAtomValue(currentStxAddressState);
  const router = useRouter();

  const buttonText = useMemo(() => {
    if (isLoading) return 'Loading...';
    if (address) {
      return isHover ? 'Sign Out' : truncateMiddle(address, 4);
    }
    return 'Connect Stacks Wallet';
  }, [isLoading, isHover, address]);

  const signIn = useCallback(() => handleSignIn(), [handleSignIn]);
  const signOut = useCallback(async () => {
    await handleSignOut();
    if (router.pathname !== '/') {
      await router.push('/');
    }
  }, [handleSignOut, router]);

  const onMouseOver = useCallback(() => {
    setIsHover(true);
  }, [setIsHover]);
  const onMouseLeave = useCallback(() => {
    setIsHover(false);
  }, [setIsHover]);

  return (
    <Button
      onClick={isSignedIn ? signOut : signIn}
      connected={!!isSignedIn}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
      minWidth="160px"
    >
      {buttonText}
    </Button>
  );
};
