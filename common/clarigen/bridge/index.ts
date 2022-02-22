import { pureProxy, Contract } from '@clarigen/core';
import type { BridgeContract } from './types';
import { BridgeInterface } from './abi';
export type { BridgeContract } from './types';

export function bridgeContract(contractAddress: string, contractName: string) {
  return pureProxy<BridgeContract>({
    abi: BridgeInterface,
    contractAddress,
    contractName,
  });
}

export const bridgeInfo: Contract<BridgeContract> = {
  contract: bridgeContract,
  address: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  contractFile: 'contracts/bridge.clar',
  name: 'bridge',
  abi: BridgeInterface,
};
