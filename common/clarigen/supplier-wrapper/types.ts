import { ClarityTypes, ContractCalls } from '@clarigen/core';

// prettier-ignore
export interface SupplierWrapperContract {
  withdrawFunds: (amount: number | bigint) => ContractCalls.Private<ClarityTypes.Response<bigint, bigint>>;
  addFunds: (amount: number | bigint) => ContractCalls.Public<bigint, bigint>;
  finalizeSwap: (txid: Uint8Array, preimage: Uint8Array) => ContractCalls.Public<{
  "csv": bigint;
  "expiration": bigint;
  "hash": Uint8Array;
  "output-index": bigint;
  "redeem-script": Uint8Array;
  "sats": bigint;
  "sender-public-key": Uint8Array;
  "supplier": bigint;
  "swapper": bigint;
  "swapper-principal": string;
  "xbtc": bigint
    }, bigint>;
  registerSupplier: (publicKey: Uint8Array, inboundFee: bigint | null, outboundFee: bigint | null, outboundBaseFee: number | bigint, inboundBaseFee: number | bigint, name: string, funds: number | bigint) => ContractCalls.Public<bigint, bigint>;
  removeFunds: (amount: number | bigint) => ContractCalls.Public<bigint, bigint>;
  transferOwner: (newOwner: string) => ContractCalls.Public<string, bigint>;
  updateSupplier: (publicKey: Uint8Array, inboundFee: bigint | null, outboundFee: bigint | null, outboundBaseFee: number | bigint, inboundBaseFee: number | bigint, name: string) => ContractCalls.Public<{
  "controller": string;
  "inbound-base-fee": bigint;
  "inbound-fee": bigint | null;
  "name": string;
  "outbound-base-fee": bigint;
  "outbound-fee": bigint | null;
  "public-key": Uint8Array
    }, bigint>;
  getOwner: () => ContractCalls.ReadOnly<string>;
  validateOwner: () => ContractCalls.ReadOnly<ClarityTypes.Response<boolean, bigint>>;
}
