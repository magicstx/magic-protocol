import { pureProxy, Contract } from '@clarigen/core';
import type { ClarityBitcoinContract } from './types';
import { ClarityBitcoinInterface } from './abi';
export type { ClarityBitcoinContract } from './types';

export function clarityBitcoinContract(contractAddress: string, contractName: string) {
  return pureProxy<ClarityBitcoinContract>({
    abi: ClarityBitcoinInterface,
    contractAddress,
    contractName,
  });
}

export const clarityBitcoinInfo: Contract<ClarityBitcoinContract> = {
  contract: clarityBitcoinContract,
  address: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  contractFile: 'contracts/test/clarity-bitcoin.clar',
  name: 'clarity-bitcoin',
  abi: ClarityBitcoinInterface,
};
