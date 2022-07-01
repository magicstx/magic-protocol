import { WalletConnectButton } from './wallet-connect-button';
import { Box, SpaceBetween, Stack } from '@nelson-ui/react';
import { Text } from './text';
import React, { useMemo } from 'react';
import { Link } from './link';
import { useBalances } from '../common/hooks/use-balances';
import { SafeSuspense } from './safe-suspense';
import BigNumber from 'bignumber.js';
import { useAuth } from '@micro-stacks/react';
import { getAppIcon, getAppName, NETWORK_CONFIG } from '../common/constants';
import { BurstIcon } from './icons/burst';
import { StarIcon } from './icons/star';
import Image from 'next/image';
import { useIsSSR } from '../common/hooks/use-is-ssr';

export const Balance: React.FC<{ label: string; amount: string; decimals: number }> = ({
  amount,
  label,
  decimals,
}) => {
  const formatted = useMemo(() => {
    return new BigNumber(amount).shiftedBy(-1 * decimals).toFormat();
  }, [amount, decimals]);
  return (
    <SpaceBetween spacing="$1">
      <Text variant="Label01" color="$onSurface-text">
        {formatted}
      </Text>
      <Text variant="Label01" color="$onSurface-text-subdued">
        {label}
      </Text>
    </SpaceBetween>
  );
};

export const Balances: React.FC = () => {
  const balances = useBalances();
  return (
    <Stack isInline spacing="40px">
      <Balance label="xBTC" amount={balances.xbtc} decimals={8} />
      <Balance label="STX" amount={balances.stx} decimals={6} />
    </Stack>
  );
};

export function Header() {
  const { isSignedIn, session } = useAuth();
  const isSSR = useIsSSR();
  const appName = useMemo(() => {
    return getAppName();
  }, []);
  const appIcon = useMemo(() => {
    return getAppIcon();
  }, []);

  return (
    <SpaceBetween pt="30px" maxWidth="1120px" mx="auto" width="100vw">
      <SpaceBetween spacing="40px">
        <SpaceBetween spacing="12px">
          {typeof appIcon === 'string' ? (
            <Image src={appIcon} alt={appName} width="25px" height="25px" />
          ) : (
            <StarIcon />
          )}
          <Link href="/" variant="Label01">
            {appName}
          </Link>
        </SpaceBetween>
        {isSignedIn && !isSSR ? (
          <>
            <Link href="/swaps" variant="Label01">
              Swap history
            </Link>
            {NETWORK_CONFIG === 'mocknet' ? (
              <Link href="/faucet" variant="Label01">
                Faucet
              </Link>
            ) : null}
          </>
        ) : null}
      </SpaceBetween>
      <Stack isInline spacing="40px">
        {isSSR ? null : (
          <>
            {session?.appPrivateKey ? (
              <SafeSuspense fallback={<></>}>
                <Balances />
              </SafeSuspense>
            ) : null}
            <WalletConnectButton />
          </>
        )}
      </Stack>
    </SpaceBetween>
  );
}
