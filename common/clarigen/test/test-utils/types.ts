import { ClarityTypes, ContractCalls } from '@clarigen/core';

// prettier-ignore
export interface TestUtilsContract {
  setBurnHeader: (height: number | bigint, header: Uint8Array) => ContractCalls.Public<boolean, null>;
  setMined: (txid: Uint8Array) => ContractCalls.Public<boolean, null>;
  burnBlockHeader: (height: number | bigint) => ContractCalls.ReadOnly<Uint8Array | null>;
  wasMined: (txid: Uint8Array) => ContractCalls.ReadOnly<boolean | null>;
  burnBlockHeaders: (key: number | bigint) => ContractCalls.Map<number | bigint, Uint8Array>;
  minedTxs: (key: Uint8Array) => ContractCalls.Map<Uint8Array, boolean>;
}
