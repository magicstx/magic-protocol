import type { NodeOptions } from '@clarigen/node';
import { NodeProvider } from '@clarigen/node';
import { privateKeyToStxAddress, StacksNetworkVersion } from 'micro-stacks/crypto';
import { network } from './constants';

export const clarigenNodeConfig: NodeOptions = {
  network,
};

export function nodeContracts() {
  return NodeProvider(clarigenNodeConfig);
}

export function sponsorAddress(privateKey: string) {
  const addressVersion = network.isMainnet()
    ? StacksNetworkVersion.mainnetP2PKH
    : StacksNetworkVersion.testnetP2PKH;
  const principal = privateKeyToStxAddress(privateKey.slice(0, 64), addressVersion, true);
  return principal;
}
