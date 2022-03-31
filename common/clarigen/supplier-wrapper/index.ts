import { pureProxy, Contract } from '@clarigen/core';
import type { SupplierWrapperContract } from './types';
import { SupplierWrapperInterface } from './abi';
export type { SupplierWrapperContract } from './types';

export function supplierWrapperContract(contractAddress: string, contractName: string) {
  return pureProxy<SupplierWrapperContract>({
    abi: SupplierWrapperInterface,
    contractAddress,
    contractName,
  });
}

export const supplierWrapperInfo: Contract<SupplierWrapperContract> = {
  contract: supplierWrapperContract,
  address: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  contractFile: 'contracts/supplier-wrapper.clar',
  name: 'supplier-wrapper',
  abi: SupplierWrapperInterface,
};
