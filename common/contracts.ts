import { WebProvider } from '@clarigen/web';
import { network, NETWORK_CONFIG } from './constants';
import { devnetDeployment } from './clarigen/deployments/devnet';
import { testnetDeployment } from './clarigen/deployments/testnet';
import type { contracts as contractDef } from './clarigen';
import type { ContractFactory, DeploymentPlan, DeploymentNetwork } from '@clarigen/core';
import { projectFactory } from '@clarigen/core';
import { createAssetInfo } from 'micro-stacks/transactions';
import { splitContractId } from './utils';
import { mainnetDeployment } from './clarigen/deployments/mainnet';
import type { contracts } from './clarigen/next';
import { project } from './clarigen/next';

export const webProvider = () => {
  return WebProvider({ network });
};

export function getContracts() {
  return projectFactory(project, NETWORK_CONFIG as DeploymentNetwork);
}

export function bridgeContract() {
  return getContracts().bridge;
}

export function bridgeAddress() {
  return splitContractId(bridgeContract().identifier)[0];
}

export type Contracts = ReturnType<typeof getContracts>;
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
