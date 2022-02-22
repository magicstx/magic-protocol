import { Box, BoxProps, Flex, SpaceBetween } from '@nelson-ui/react';
import React from 'react';
import { CheckIcon } from '../icons/check';
import { ExternalTx } from '../icons/external-tx';
import { PendingIcon } from '../icons/pending';
import { Spinner } from '../spinner';
import { Text } from '../text';

interface BaseRowProps extends BoxProps {
  txId?: string;
  btcTxId?: string;
}

export const DoneRow: React.FC<BaseRowProps> = ({ txId, btcTxId, children, ...props }) => {
  return (
    <SpaceBetween px="$row-x" {...props}>
      <Flex alignItems="center">
        <CheckIcon mr="$5" />
        <Text variant="Label01" color="$color-slate-95">
          {children}
        </Text>
      </Flex>
      <ExternalTx txId={txId} btcTxId={btcTxId} />
    </SpaceBetween>
  );
};

export const PendingRow: React.FC<BaseRowProps> = ({ txId, btcTxId, children, ...props }) => {
  return (
    <SpaceBetween px="$row-x" {...props}>
      <Flex alignItems="center">
        <Spinner mr="$5" />
        <Text variant="Label01" color="$color-slate-85">
          {children}
        </Text>
      </Flex>
      <ExternalTx txId={txId} btcTxId={btcTxId} />
    </SpaceBetween>
  );
};

export const Divider: React.FC = () => {
  return (
    <Box
      maxWidth="100%"
      width="100%"
      border="1px solid $color-border-subdued"
      borderWidth="1px 0 0 0"
    />
  );
};
