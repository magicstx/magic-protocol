import React from 'react';
import { Stack } from '@nelson-ui/react';
import { MagicInput } from '../form';
import { Text } from '../text';
import type { CSSTypes } from '@nelson-ui/core';
import { useInput } from '../../common/hooks/use-input';
import { useAtom, useAtomValue } from 'jotai';
import { btcAddressState } from '../../common/store';
import { isOutboundState } from '../../common/store/swap-form';

export const BtcInput: React.FC = () => {
  const btcAddress = useInput(useAtom(btcAddressState));
  const isOutbound = useAtomValue(isOutboundState);

  if (!isOutbound) return null;

  return (
    <Stack
      spacing="$2"
      css={
        {
          '&:focus-within': {
            '.btc-label': {
              color: '$onSurface-text-subdued',
            },
          },
        } as CSSTypes
      }
    >
      <Text variant="Label02" color="$onSurface-text-dim" className="btc-label">
        Your BTC Address
      </Text>
      <MagicInput {...btcAddress} placeholder="Enter a non-Segwit Bitcoin address" />
    </Stack>
  );
};
