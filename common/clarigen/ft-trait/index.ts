import { pureProxy, Contract } from '@clarigen/core';
import type { FtTraitContract } from './types';
import { FtTraitInterface } from './abi';
export type { FtTraitContract } from './types';

export function ftTraitContract(contractAddress: string, contractName: string) {
  return pureProxy<FtTraitContract>({
    abi: FtTraitInterface,
    contractAddress,
    contractName,
  });
}

export const ftTraitInfo: Contract<FtTraitContract> = {
  contract: ftTraitContract,
  address: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  contractFile: 'contracts/ft-trait.clar',
  name: 'ft-trait',
  abi: FtTraitInterface,
};
