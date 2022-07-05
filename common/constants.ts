import type { StacksNetwork } from 'micro-stacks/network';
import {
  HIRO_MAINNET_DEFAULT,
  HIRO_MOCKNET_DEFAULT,
  HIRO_TESTNET_DEFAULT,
  StacksMainnet,
  StacksMocknet,
  StacksTestnet,
} from 'micro-stacks/network';
import { networks } from 'bitcoinjs-lib';
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

function getLocalUrl() {
  if (typeof document !== 'undefined') {
    return document.location.origin;
  }
  const hostedUrl = process.env.NEXT_PUBLIC_VERCEL_URL;
  return (
    process.env.NEXT_PUBLIC_LOCAL_URL ||
    (hostedUrl ? `https://${hostedUrl}` : 'http://localhost:4444')
  );
}

export const LOCAL_URL = getLocalUrl();

export const webProvider = WebProvider({ network });

export const DEFAULT_APP_NAME = 'Magic Bridge' as const;

export function getAppName() {
  const envTitle = process.env.NEXT_PUBLIC_APP_NAME;
  if (typeof envTitle === 'string') {
    return envTitle;
  }
  return DEFAULT_APP_NAME;
}

export function isAppNameDefault() {
  return getAppName() === DEFAULT_APP_NAME;
}

export function getAppIcon() {
  const envIcon = process.env.NEXT_PUBLIC_APP_ICON;
  if (typeof envIcon === 'string') {
    return envIcon;
  }
}

export const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || 'V?';
