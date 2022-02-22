import { ContractCalls } from '@clarigen/core';
import { stacksSessionAtom } from '@micro-stacks/react';
import { ContractCallTxOptions } from 'micro-stacks/connect';
import { useCallback } from 'react';
import { network, contracts } from '../constants';
import { useAtomValue } from 'jotai/utils';
import { tx as submitTx } from '@clarigen/web';
// import { Concat } from 'type-fest';

type ContractFn<P, Ok, Err> = (...args: P[]) => ContractCalls.Public<Ok, Err>;

type TxOptions = Omit<
  ContractCallTxOptions,
  'contractName' | 'contractAddress' | 'functionName' | 'functionArgs' | 'privateKey'
>;

type Ok<Fn> = Fn extends ContractFn<any, infer O, any> ? O : never;

export function useTx<T extends ContractFn<any, any, any>>(contractFn: T) {
  const session = useAtomValue(stacksSessionAtom);
  const value: Ok<T> | null = 1 as Ok<T>;
  const submit = useCallback(
    (...params: Parameters<T>) => {
      const contractCall = contractFn(...params);
      if (!session) throw new Error('Cannot make tx if not signed in.');
      return async function (opts: TxOptions) {
        const txOpts = {
          ...opts,
          privateKey: session.appPrivateKey,
        };
        return submitTx(contractCall, txOpts, { network });
      };
    },
    [contractFn, session]
  );
  return {
    submit,
    value,
  };
}

// eslint-disable-next-line react-hooks/rules-of-hooks
const { submit, value } = useTx(contracts.bridge.contract.finalizeSwap);
const final = submit(Uint8Array.from([1]), Uint8Array.from([1]));
const result = await final({});
