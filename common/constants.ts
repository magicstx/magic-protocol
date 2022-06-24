import { createAddress } from 'micro-stacks/clarity';
import {
  HIRO_MAINNET_DEFAULT,
  HIRO_MOCKNET_DEFAULT,
  HIRO_TESTNET_DEFAULT,
  NetworkConfig,
  StacksMainnet,
  StacksMocknet,
  StacksNetwork,
  StacksTestnet,
} from 'micro-stacks/network';
import { accounts, contracts as allContracts } from './clarigen';
import { networks } from 'bitcoinjs-lib';
import { makeContracts } from '@clarigen/core';
import { WebProvider } from '@clarigen/web';

export let network: StacksNetwork;
export let btcNetwork: networks.Network;

export const NETWORK_CONFIG = process.env.NEXT_PUBLIC_NETWORK || 'mocknet';
if (NETWORK_CONFIG === 'mainnet') {
  network = new StacksMainnet({
    url: process.env.NEXT_PUBLIC_CORE_URL || HIRO_MAINNET_DEFAULT,
  });
  btcNetwork = networks.bitcoin;
} else if (NETWORK_CONFIG === 'testnet') {
  network = new StacksTestnet({
    url: process.env.NEXT_PUBLIC_CORE_URL || HIRO_TESTNET_DEFAULT,
  });
  btcNetwork = networks.testnet;
} else {
  network = new StacksMocknet({
    url: process.env.NEXT_PUBLIC_CORE_URL || HIRO_MOCKNET_DEFAULT,
  });
  btcNetwork = networks.regtest;
}

export const coreUrl = network.getCoreApiUrl();

export const CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || accounts.deployer.address;

export const TYPED_CLARITY_ADDRESS = createAddress(CONTRACT_ADDRESS);

function getLocalUrl() {
  if (typeof document !== 'undefined') {
    return document.location.origin;
  }
  const hostedUrl = process.env.NEXT_PUBLIC_VERCEL_URL;
  return (
    process.env.NEXT_PUBLIC_LOCAL_URL ||
    (hostedUrl ? `https://${hostedUrl}` : 'http://localhost:3000')
  );
}

export const LOCAL_URL = getLocalUrl();

export const contracts = makeContracts(allContracts, {
  deployerAddress: CONTRACT_ADDRESS,
});

export const webProvider = WebProvider({ network });

export function getAppName() {
  const envTitle = process.env.NEXT_PUBLIC_APP_NAME;
  if (typeof envTitle === 'string') {
    return envTitle;
  }
  return 'Magic Bridge';
}

export function getAppIcon() {
  const envIcon = process.env.NEXT_PUBLIC_APP_ICON;
  if (typeof envIcon === 'string') {
    return envIcon;
  }
}
