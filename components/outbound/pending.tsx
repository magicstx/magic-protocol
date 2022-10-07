import React from 'react';
import { CenterBox, PendingRow } from '../center-box';

export const PendingInit: React.FC<{ txId?: string }> = ({ txId = '' }) => {
  return (
    <CenterBox>
      <PendingRow txId={txId} px="$0">
        Waiting for your Stacks transaction
      </PendingRow>
    </CenterBox>
  );
};
