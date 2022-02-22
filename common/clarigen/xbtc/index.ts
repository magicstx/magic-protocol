import { pureProxy, Contract } from '@clarigen/core';
import type { XbtcContract } from './types';
import { XbtcInterface } from './abi';
export type { XbtcContract } from './types';

export function xbtcContract(contractAddress: string, contractName: string) {
  return pureProxy<XbtcContract>({
    abi: XbtcInterface,
    contractAddress,
    contractName,
  });
}

export const xbtcInfo: Contract<XbtcContract> = {
  contract: xbtcContract,
  address: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  contractFile: 'contracts/xbtc.clar',
  name: 'xbtc',
  abi: XbtcInterface,
};
