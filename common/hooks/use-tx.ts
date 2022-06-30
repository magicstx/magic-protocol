import { useCallback, useState, useMemo } from 'react';
import { ContractCalls } from '@clarigen/core';
import { tx as submitTx } from '@clarigen/web';
import { sponsorTransaction } from '../api';
import { getTxId } from '../utils';
import { useStxTx, useStxTxResult } from '../store/api';
import { bytesToHex } from 'micro-stacks/common';
import { ContractCallTxOptions } from 'micro-stacks/connect';
import { network } from '../constants';
import { stacksSessionAtom } from '@micro-stacks/react';
import { useAtomValue } from 'jotai/utils';
import { getContracts, Contracts } from '../contracts';

type Receipt<Ok, Err> = Awaited<ReturnType<typeof submitTx>>;

type TxOptions = Omit<
  ContractCallTxOptions,
  'contractName' | 'contractAddress' | 'functionName' | 'functionArgs' | 'privateKey'
>;

type Submitter<Ok, Err> = (
  contractCall: ContractCalls.Public<Ok, Err>,
  options?: TxOptions
) => Promise<Receipt<Ok, Err>>;

type TxBuilder<Ok, Err> = (
  contracts: Contracts,
  submit: Submitter<Ok, Err>
) => Promise<Receipt<Ok, Err>>;

interface UseTxOptions {
  sponsored?: boolean;
}

export const useTx = <Ok, Err>(builder: TxBuilder<Ok, Err>, opts: UseTxOptions = {}) => {
  const [txId, setTxId] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [apiTransaction] = useStxTx(txId);
  const txResult = useStxTxResult<Ok | Err | null>(txId);
  const session = useAtomValue(stacksSessionAtom);
  const submitter: Submitter<Ok, Err> = useCallback(
    (_tx: ContractCalls.Public<Ok, Err>, opts: TxOptions = {}) => {
      if (!session) throw new Error('Cannot make tx if not signed in.');
      return submitTx(
        _tx,
        {
          ...opts,
          privateKey: session.appPrivateKey,
        },
        {
          network,
        }
      );
    },
    [session]
  );

  const submit = useCallback(async () => {
    setError(undefined);
    const contracts = getContracts();
    try {
      const receipt = await builder(contracts, submitter);
      if (opts.sponsored) {
        const hex = bytesToHex(receipt.stacksTransaction.serialize());
        const txId = await sponsorTransaction(hex);
        setTxId(getTxId(txId));
      } else {
        console.log('receipt', receipt);
        let txId: string;
        if (typeof receipt.txId === 'string') {
          txId = receipt.txId;
        } else {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          txId = (receipt.txId as unknown as any).txid as string;
        }
        setTxId(getTxId(txId));
      }
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(`${error as string}`);
      }
    }
  }, [builder, opts.sponsored, submitter]);

  const txUrl = useMemo(() => {
    if (!txId) return '';
    return `http://localhost:3999/extended/v1/tx/0x${txId}?unanchored=true`;
  }, [txId]);

  return {
    submit,
    txId,
    txUrl,
    error,
    txResult,
    apiTransaction,
  };
};
