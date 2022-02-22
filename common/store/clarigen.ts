import { atomWithQuery, useQueryAtom, atomFamilyWithQuery } from 'jotai-query-toolkit';
import { ContractCall, ContractCalls } from '@clarigen/core';
import { contracts, webProvider } from '../constants';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */

function callToQueryKey(contractCall: ContractCall<any>) {
  return [contractCall.contractAddress, contractCall.function.name, ...contractCall.nativeArgs];
}

export const readOnlyState = atomFamilyWithQuery<ContractCall<any>, any>(
  (get, param) => callToQueryKey(param),
  async (get, param) => {
    return webProvider.ro(param);
  }
);

/* eslint-enable @typescript-eslint/no-unsafe-assignment */
/* eslint-enable @typescript-eslint/no-unsafe-return */

export function useReadOnly<R>(contractCall: ContractCall<R>) {
  return useQueryAtom<R>(readOnlyState(contractCall));
}
