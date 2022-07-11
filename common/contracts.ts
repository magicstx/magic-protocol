import { WebProvider } from '@clarigen/web';
import { network, NETWORK_CONFIG } from './constants';
import { devnetDeployment } from './clarigen/deployments/devnet';
import { testnetDeployment } from './clarigen/deployments/testnet';
import { contracts as contractDef } from './clarigen';
import type { ContractFactory, DeploymentPlan } from '@clarigen/core';
import { contractFactory } from '@clarigen/core';
import { deploymentFactory } from '@clarigen/core';
import { createAssetInfo } from 'micro-stacks/transactions';
import { splitContractId } from './utils';
import { mainnetDeployment } from './clarigen/deployments/mainnet';

export const webProvider = () => {
  return WebProvider({ network });
};

export const WRAPPED_BTC_MAINNET = 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.Wrapped-Bitcoin';

export function getDeployment(): DeploymentPlan {
  switch (NETWORK_CONFIG) {
    case 'mocknet':
      return devnetDeployment;
    case 'testnet':
      return testnetDeployment;
    case 'mainnet':
      return mainnetDeployment;
  }
  throw new Error(`No deployment found for network '${NETWORK_CONFIG}'`);
}

export function mainnetContracts() {
  const base = deploymentFactory(contractDef, mainnetDeployment);
  const wrappedBitcoin = contractFactory(contractDef.wrappedBitcoin, WRAPPED_BTC_MAINNET);
  return {
    ...base,
    wrappedBitcoin,
  };
}

export function getContracts() {
  if (NETWORK_CONFIG === 'mainnet') {
    return mainnetContracts();
  }
  return deploymentFactory(contractDef, getDeployment());
}

export function bridgeContract() {
  return getContracts().bridge;
}

export function bridgeAddress() {
  return splitContractId(bridgeContract().identifier)[0];
}

export type Contracts = ContractFactory<typeof contractDef>;
export type BridgeContract = Contracts['bridge'];

export function xbtcAssetInfo() {
  const contract = getContracts().wrappedBitcoin;
  const token = contract.fungible_tokens[0].name;
  const [address, name] = splitContractId(contract.identifier);
  return createAssetInfo(address, name, token);
}

export function xbtcAssetId() {
  const contract = getContracts().wrappedBitcoin;
  const token = contract.fungible_tokens[0].name;
  return `${contract.identifier}::${token}`;
}
