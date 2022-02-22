import React, { useMemo, useCallback } from 'react';
import { Box, Stack, Flex, SpaceBetween } from '@nelson-ui/react';
import { styled } from '@stitches/react';
import { BtcIcon } from './icons/btc';
import capitalize from 'lodash-es/capitalize';
import { XBtcIcon } from './icons/xbtc';
import { useSwapForm } from '../common/hooks/use-swap-form';
import { useBalances } from '../common/hooks/use-balances';
import BigNumber from 'bignumber.js';
import { useAuth } from '@micro-stacks/react';
import { Text } from './text';

export type Token = 'btc' | 'xbtc';

export const SwapInput = styled('input', {
  all: 'unset',
  width: '100%',
  display: 'inline-flex',
  alignItems: 'left',
  justifyContent: 'left',
  textAlign: 'right',
  borderRadius: 4,
  padding: '0 10px',
  height: 35,
  fontSize: 15,
  lineHeight: 1,
  color: '$color-base-white',
  boxSizing: 'border-box',
  // background: '$color-surface',
});

export const SwapLabel: React.FC<{ token: Token }> = ({ token }) => {
  return (
    <SpaceBetween
      // background="$background-subdued"
      py="$2"
      px="14px"
      borderRadius="7px"
      spacing="$2"
      minWidth="104px"
      border="1px solid $color-border-subdued"
      className="swap-label"
    >
      {token === 'btc' ? <BtcIcon /> : <XBtcIcon />}
      <Text variant="Label02" color={undefined}>
        {token === 'btc' ? 'BTC' : 'xBTC'}
      </Text>
    </SpaceBetween>
  );
};

const SwapBalance: React.FC = () => {
  const { amount } = useSwapForm();
  const balances = useBalances();

  const maxBalance = useMemo(() => {
    return new BigNumber(balances.xbtc).shiftedBy(-8);
  }, [balances.xbtc]);
  const setMaxAmount = useCallback(() => {
    amount.setter(maxBalance.toString());
  }, [maxBalance, amount]);

  return (
    <Flex>
      <Text variant="Caption02" color="$text-subdued">
        Balance: {maxBalance.toFormat()} xBTC
      </Text>
      <Text
        variant="Caption02"
        color="$action-primary"
        ml="$1"
        cursor="pointer"
        _hover={{ textDecoration: 'underline' }}
        onClick={setMaxAmount}
      >
        (Max)
      </Text>
    </Flex>
  );
};

const SwapFieldComp = styled(SpaceBetween, {
  background: '$color-surface',
  borderColor: '$color-border-subdued',
  borderRadius: '$medium',
  borderWidth: '1px',
  borderStyle: 'solid',
  width: '100%',
  padding: '8px',
  '.swap-label': {
    color: '$color-slate-85 !important',
  },
  '&:focus-within': {
    borderColor: '$color-primary',
    '.swap-label': {
      borderColor: '$color-primary',
      color: '$color-base-white !important',
    },
  },
});

export interface SwapFieldProps {
  dir: 'from' | 'to';
}

export const SwapField: React.FC<SwapFieldProps> = ({ dir }) => {
  const { inputToken, outputToken, amount, outputAmount } = useSwapForm();
  const { isSignedIn } = useAuth();
  const token = dir === 'from' ? inputToken : outputToken;
  const inputProps = useMemo(() => {
    if (dir === 'from') {
      return {
        onChange: amount.onChange,
        value: amount.value,
      };
    }
    return {
      disabled: true,
      value: outputAmount,
      style: {
        color: 'var(--colors-text-subdued)',
      },
    };
  }, [amount, dir, outputAmount]);

  return (
    <Stack spacing="$2">
      <Text variant="Label01">
        {capitalize(dir)} {token === 'btc' ? 'Bitcoin chain' : 'Stacks chain'}
      </Text>
      <SwapFieldComp
        background="$color-surface"
        borderRadius="$medium"
        borderWidth="1px"
        borderStyle="solid"
        width="100%"
      >
        <SwapLabel token={token} />
        <SwapInput placeholder="0.0" {...inputProps} />
      </SwapFieldComp>
      {dir === 'from' && inputToken === 'xbtc' && isSignedIn ? <SwapBalance /> : null}
    </Stack>
  );
};
