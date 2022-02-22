import { ClarityTypes, ContractCalls } from '@clarigen/core';

// prettier-ignore
export interface TestUtilsContract {
  setMined: (txid: Uint8Array) => ContractCalls.Public<boolean, null>;
  wasMined: (txid: Uint8Array) => ContractCalls.ReadOnly<boolean | null>;
  minedTxs: (key: Uint8Array) => ContractCalls.Map<Uint8Array, boolean>;
}
