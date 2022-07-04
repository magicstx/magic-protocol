import React, { useMemo, useCallback } from 'react';
import { Box, Stack, Flex, SpaceBetween } from '@nelson-ui/react';
import { styled } from '@stitches/react';
import { BtcIcon } from '../icons/btc';
import capitalize from 'lodash-es/capitalize';
import { XBtcIcon } from '../icons/xbtc';
import BigNumber from 'bignumber.js';
import { useAuth } from '@micro-stacks/react';
import { Text } from '../text';
import { useAtomCallback, useAtomValue } from 'jotai/utils';
import { useAtom } from 'jotai';
import {
  amountState,
  inputTokenState,
  outputAmountBtcState,
  outputTokenState,
} from '../../common/store/swap-form';
import { balancesState } from '../../common/store/api';
import { useInput } from '../../common/hooks/use-input';

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
  background: '$surface-very-subdued',
});

export const SwapLabel: React.FC<{ token: Token }> = ({ token }) => {
  return (
    <SpaceBetween
      py="$2"
      px="14px"
      borderRadius="7px"
      spacing="$2"
      minWidth="104px"
      border="1px solid $onSurface-border-subdued"
      className="swap-label"
    >
      {token === 'btc' ? <BtcIcon /> : <XBtcIcon />}
      <Text variant="Label02" color="$text">
        {token === 'btc' ? 'BTC' : 'xBTC'}
      </Text>
    </SpaceBetween>
  );
};

const SwapBalance: React.FC = () => {
  const setMaxAmount = useAtomCallback(
    useCallback((get, set) => {
      const balances = get(balancesState);
      const { xbtc } = balances;
      const maxBalance = new BigNumber(xbtc).shiftedBy(-8);
      set(amountState, maxBalance.toString());
    }, [])
  );

  return (
    <Text
      variant="Label02"
      color="$light-onSurface-text-dim"
      ml="15px"
      onClick={setMaxAmount}
      cursor="pointer"
    >
      Max
    </Text>
  );
};

const SwapFieldComp = styled(SpaceBetween, {
  background: '$dark-surface-very-subdued',
  borderColor: '$onSurface-border-subdued',
  borderRadius: '$medium',
  borderWidth: '0px',
  borderStyle: 'solid',
  width: '100%',
  padding: '8px',
  '.swap-label': {
    color: '$color-slate-85 !important',
  },
});

const SwapStack = styled(Stack, {
  '&:focus-within': {
    '.swap-title': {
      color: '$onSurface-text-subdued',
    },
  },
});

const SwapFieldBorder = styled(Box, {
  padding: '1px',
  background: '$onSurface-border-subdued',
  borderRadius: '$medium',
  '&:focus-within': {
    background: '$foil',
  },
});

export interface SwapFieldProps {
  dir: 'from' | 'to';
}

export const SwapField: React.FC<SwapFieldProps> = ({ dir }) => {
  const inputToken = useAtomValue(inputTokenState);
  const outputToken = useAtomValue(outputTokenState);
  const outputAmount = useAtomValue(outputAmountBtcState);
  const amount = useInput(useAtom(amountState));
  const { isSignedIn } = useAuth();
  const token = dir === 'from' ? inputToken : outputToken;
  const inputProps = useMemo(() => {
    if (dir === 'from') {
      return {
        onChange: amount.onChange,
        value: amount.value,
        autoFocus: true,
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
    <SwapStack spacing="$2">
      <Text variant="Label02" className="swap-title" color="$onSurface-text-dim">
        {capitalize(dir)} {token === 'btc' ? 'Bitcoin chain' : 'Stacks chain'}
      </Text>
      <SwapFieldBorder>
        <SwapFieldComp borderRadius="$medium" borderWidth="1px" borderStyle="solid" width="100%">
          <SwapLabel token={token} />
          {dir === 'from' && inputToken === 'xbtc' && isSignedIn ? <SwapBalance /> : null}
          <SwapInput placeholder="0.0" {...inputProps} />
        </SwapFieldComp>
      </SwapFieldBorder>
    </SwapStack>
  );
};
