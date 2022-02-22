import { ClarityTypes, ContractCalls } from '@clarigen/core';

// prettier-ignore
export interface XbtcContract {
  getTokenUri: () => ContractCalls.Public<string | null, null>;
  transfer: (amount: number | bigint, sender: string, recipient: string, memo: Uint8Array | null) => ContractCalls.Public<boolean, bigint>;
  getBalance: (owner: string) => ContractCalls.ReadOnly<ClarityTypes.Response<bigint, null>>;
  getDecimals: () => ContractCalls.ReadOnly<ClarityTypes.Response<bigint, null>>;
  getName: () => ContractCalls.ReadOnly<ClarityTypes.Response<string, null>>;
  getSymbol: () => ContractCalls.ReadOnly<ClarityTypes.Response<string, null>>;
  getTotalSupply: () => ContractCalls.ReadOnly<ClarityTypes.Response<bigint, null>>;
}
