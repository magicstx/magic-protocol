import React, { useCallback, useEffect } from 'react';
import { Stack } from '@nelson-ui/react';
import { useRegisterSwapper } from '../../common/hooks/tx/use-register-swapper';
import { CenterBox, PendingRow } from '../center-box';
import { swapperIdState, useSwapperId } from '../../common/store';
import { logger } from '../../common/logger';
import { useQueryAtom } from 'jotai-query-toolkit';
import { useAtom } from 'jotai';
import { pendingRegisterSwapperState } from '../../common/hooks/use-swap-form';
import { useAtomCallback } from 'jotai/utils';

export const RegisterSwap: React.FC = () => {
  const [swapperIdVal, { setQueryData }] = useQueryAtom(swapperIdState);
  const swapperId = swapperIdVal.id;
  const { submit, txId, txResult } = useRegisterSwapper();
  const [_, setPendingRegister] = useAtom(pendingRegisterSwapperState);

  const setId = useAtomCallback(
    useCallback(
      (get, set) => {
        if (txResult === null) return;
        logger.debug('Registration TX result:', txResult);
        logger.debug('Setting swapper ID from tx result');
        const id = Number(txResult);
        setQueryData({ data: { id } });
        set(pendingRegisterSwapperState, false);
      },
      [txResult, setQueryData]
    )
  );

  useEffect(() => {
    void setId();
  }, [setId, txResult]);

  useEffect(() => {
    if (swapperId === null) {
      void submit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (swapperId !== null) {
      logger.debug('Setting swapper ID from contract data', swapperId);
      setPendingRegister(false);
    }
  }, [swapperId, setPendingRegister]);

  return (
    <Stack spacing="$row-y">
      <CenterBox>
        <PendingRow px="$0" txId={txId}>
          Waiting on your Stacks transaction
        </PendingRow>
      </CenterBox>
    </Stack>
  );
};
