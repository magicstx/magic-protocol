import { pureProxy, Contract } from '@clarigen/core';
import type { TestUtilsContract } from './types';
import { TestUtilsInterface } from './abi';
export type { TestUtilsContract } from './types';

export function testUtilsContract(contractAddress: string, contractName: string) {
  return pureProxy<TestUtilsContract>({
    abi: TestUtilsInterface,
    contractAddress,
    contractName,
  });
}

export const testUtilsInfo: Contract<TestUtilsContract> = {
  contract: testUtilsContract,
  address: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  contractFile: 'contracts/test/test-utils.clar',
  name: 'test-utils',
  abi: TestUtilsInterface,
};
