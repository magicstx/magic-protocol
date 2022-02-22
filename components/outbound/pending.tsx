import React from 'react';
import { Flex, SpaceBetween, Text } from '@nelson-ui/react';
import { CenterBox, PendingRow } from '../center-box';
import { PendingIcon } from '../icons/pending';
import { ExternalTx } from '../icons/external-tx';

export const PendingInit: React.FC<{ txId?: string }> = ({ txId = '' }) => {
  return (
    <CenterBox>
      <PendingRow txId={txId} px="$0">
        Waiting for your Stacks transaction
      </PendingRow>
    </CenterBox>
  );
};
