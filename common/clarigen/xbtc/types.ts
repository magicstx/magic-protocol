import { Response, ContractCalls } from '@clarigen/core';

// prettier-ignore
export interface XbtcContract {
  getTokenUri: () => ContractCalls.Public<string | null, null>;
  transfer: (amount: number | bigint, sender: string, recipient: string, memo: Uint8Array | null) => ContractCalls.Public<boolean, bigint>;
  getBalance: (owner: string) => ContractCalls.ReadOnly<Response<bigint, null>>;
  getDecimals: () => ContractCalls.ReadOnly<Response<bigint, null>>;
  getName: () => ContractCalls.ReadOnly<Response<string, null>>;
  getSymbol: () => ContractCalls.ReadOnly<Response<string, null>>;
  getTotalSupply: () => ContractCalls.ReadOnly<Response<bigint, null>>;
}
