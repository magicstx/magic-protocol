import { authenticate } from 'micro-stacks/connect';
import { useCallback } from 'react';
// import { useIsSignedIn, useResetSessionCallback, useSession } from './use-session';
// import { useLoading } from './use-loading';
// import { LOADING_KEYS } from '../common/constants';
import { useAtomCallback } from 'jotai/utils';
import {
  useSession,
  useIsSignedIn,
  useLoading,
  LOADING_KEYS,
  useResetSessionCallback,
  authOptionsAtom,
  stacksSessionAtom,
  isSignedInAtom,
} from '@micro-stacks/react';
// import { authOptionsAtom, isSignedInAtom, stacksSessionAtom } from '../store/auth';

export function useAuth() {
  const [sessionState] = useSession();
  const isSignedIn = useIsSignedIn();
  const [isLoading, setIsLoading] = useLoading(LOADING_KEYS.AUTHENTICATION);
  const resetSession = useResetSessionCallback();
  const handleSignIn = useAtomCallback<void, { onFinish?: (payload: any) => void } | undefined>(
    useCallback(
      async (get, set, params) => {
        const authOptions = get(authOptionsAtom);
        if (!authOptions) throw Error('[handleSignIn] No authOptions provided.');
        setIsLoading(true);
        return authenticate({
          ...authOptions,
          onFinish: payload => {
            if (params?.onFinish) params?.onFinish(payload);
            authOptions?.onFinish?.(payload);
            set(stacksSessionAtom, payload);
            setIsLoading(false);
          },
          onCancel: error => {
            console.error(error);
            setIsLoading(false);
          },
        });
      },
      [setIsLoading]
    )
  );

  const handleSignOut = useAtomCallback(
    useCallback(
      get => {
        const authOptions = get(authOptionsAtom);
        if (!authOptions) throw Error('[handleSignOut] No authOptions provided.');
        if (typeof localStorage !== 'undefined') localStorage.clear();
        resetSession();
        authOptions?.onSignOut?.();
      },
      [resetSession]
    )
  );

  return {
    isLoading,
    isSignedIn,
    handleSignIn,
    handleSignOut,
    session: sessionState,
  };
}
