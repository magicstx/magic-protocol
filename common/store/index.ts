import { stacksSessionAtom, partialStacksSessionAtom } from '@micro-stacks/react';
import { atom } from 'jotai';
import { atomWithQuery, useQueryAtom, atomFamilyWithQuery } from 'jotai-query-toolkit';
import type { Query } from 'jotai-query-toolkit/nextjs';
import { atomWithStorage, waitForAll } from 'jotai/utils';
import { getPublicKey } from 'noble-secp256k1';
import type { SuppliersApi } from '../../pages/api/suppliers';
import { LOCAL_URL, webProvider, NETWORK_CONFIG, getAppName, isAppNameDefault } from '../constants';
import { generateGaiaHubConfig } from 'micro-stacks/storage';
import type { IntegerType } from 'micro-stacks/common';
import { bytesToHex, hexToBytes } from 'micro-stacks/common';
import { intToString } from '../utils';
import type { SupplierWithCapacity } from './api';
import { bridgeContract, getContracts } from '../contracts';
import { useQueryAtomValue } from '../hooks/use-query-value';

export enum QueryKeys {
  SUPPLIERID = 'supplierById',
  SWAPPERID = 'swapperId',
  SUPPLIERS = 'suppliers',
  INBOUND_SWAPS_TXID = 'inboundSwapsTxid',
  GAIA_CONFIG = 'gaiaConfig',
  INBOUND_SWAPS = 'inboundSwaps',
  WATCH_ADDRESS = 'watchAddress',
  STX_TX = 'stxTx',
  STX_TX_RESULT = 'stxTxResult',
  OUTBOUND_SWAPS = 'outboundSwaps',
  FINALIZED_OUTBOUND_SWAPS = 'finalizedOutboundSwaps',
  SWAPS_LIST = 'swapsList',
  OUTBOUND_SWAPS_STORAGE = 'outboundSwapsStorage',
  BALANCES = 'balances',
  BTC_BALANCES = 'btcBalances',
  BTC_TX = 'btcTxData',
  CORE_INFO = 'coreInfo',
}

export async function fetchSupplierWithContract(id: number) {
  const { bridge } = getContracts();
  const [supplier, funds] = await Promise.all([
    webProvider.ro(bridge.getSupplier(id)),
    webProvider.ro(bridge.getFunds(id)),
  ]);
  if (supplier && funds !== null) {
    return {
      controller: supplier.controller,
      inboundFee: Number(supplier.inboundFee),
      outboundFee: Number(supplier.outboundFee),
      outboundBaseFee: Number(supplier.outboundBaseFee),
      inboundBaseFee: Number(supplier.inboundBaseFee),
      publicKey: bytesToHex(supplier.publicKey),
      funds: Number(funds),
      id,
    };
  }
  throw new Error(`Could not find supplier with id ${id}`);
}

export async function fetchSupplier(id: number) {
  try {
    const supplier = await fetchSupplierWithContract(id);
    if (supplier === null) {
      throw new Error(`Could not find supplier with id ${id}`);
    }
    return supplier;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchAllSuppliersApi() {
  const url = `${LOCAL_URL}/api/suppliers`;
  const res = await fetch(url);
  const data = (await res.json()) as SuppliersApi;
  return data.suppliers;
}

export async function fetchSwapperId(address: string) {
  try {
    const _id = await webProvider.ro(bridgeContract().getSwapperId(address));
    return _id === null ? null : Number(_id);
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function fetchInboundSwap(txid: string) {
  const swap = await webProvider.ro(bridgeContract().getInboundSwap(hexToBytes(txid)));
  return swap;
}

export async function fetchOutboundSwap(swapId: bigint) {
  return await webProvider.ro(bridgeContract().getOutboundSwap(swapId));
}

export async function fetchFinalizedOutboundSwapTxid(swapId: bigint) {
  return await webProvider.ro(bridgeContract().getCompletedOutboundSwapTxid(swapId));
}

export type OutboundSwap = Awaited<ReturnType<typeof fetchOutboundSwap>>;

export type InboundSwap = Awaited<ReturnType<typeof fetchInboundSwap>>;

export type Supplier = Awaited<ReturnType<typeof fetchSupplier>>;

// ---
// atoms
// ---
export const supplierState = atomFamilyWithQuery<number, Supplier>(
  (get, param) => [QueryKeys.SUPPLIERID, param],
  async (get, param) => {
    try {
      const supplier = await fetchSupplier(param);
      return supplier;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const currentStxAddressState = atom(get => {
  const session = get(stacksSessionAtom);
  if (!session) return null;
  if (NETWORK_CONFIG === 'mainnet') return session.addresses?.mainnet || null;
  return session.addresses?.testnet || null;
});

export const swapperIdState = atomWithQuery<number | null>(QueryKeys.SWAPPERID, async get => {
  const address = get(currentStxAddressState);
  if (!address) return null;
  const id = await fetchSwapperId(address);
  return id;
});
swapperIdState.debugLabel = 'swapperId';

export const suppliersState = atomWithQuery(QueryKeys.SUPPLIERS, async get => {
  const suppliers = await fetchAllSuppliersApi();
  return suppliers;
});

export const inboundSwapByTxidState = atomFamilyWithQuery<string, InboundSwap>(
  (get, param) => [QueryKeys.INBOUND_SWAPS_TXID, param],
  async (get, param) => {
    return await fetchInboundSwap(param);
  }
);

export const outboundSwapState = atomFamilyWithQuery<string, OutboundSwap>(
  (get, swapId) => [QueryKeys.OUTBOUND_SWAPS, swapId],
  async (get, swapId) => {
    if (swapId === '') return null;
    return await fetchOutboundSwap(BigInt(swapId));
  }
);

export const finalizedOutboundSwapState = atomFamilyWithQuery<string, string | null>(
  (get, swapId) => [QueryKeys.FINALIZED_OUTBOUND_SWAPS, swapId],
  async (get, swapId) => {
    if (swapId === '') return null;
    const txid = await fetchFinalizedOutboundSwapTxid(BigInt(swapId));
    if (!txid) return null;
    return bytesToHex(txid);
  }
);

export const btcAddressState = atomWithStorage('btcAddress', '');
export const secretState = atomWithStorage('secret', '');

export const privateKeyState = atom(get => {
  const session = get(stacksSessionAtom);
  if (!session) return null;
  return session.appPrivateKey || null;
});

export const publicKeyState = atom(get => {
  const session = get(stacksSessionAtom);
  if (!session) return null;
  const privateKey = get(privateKeyState);
  if (!privateKey) return null;
  const publicKey = getPublicKey(privateKey, true);
  return publicKey;
});

export const gaiaConfigState = atomWithQuery(QueryKeys.GAIA_CONFIG, async get => {
  const session = get(stacksSessionAtom);
  const privateKey = get(privateKeyState);
  if (!session || !privateKey) return null;
  const config = await generateGaiaHubConfig({
    gaiaHubUrl: session.hubUrl,
    privateKey,
  });
  return config;
});

export const docTitleState = atom('');

export const pageTitleState = atom(get => {
  const title = get(docTitleState);
  const appName = getAppName();
  if (isAppNameDefault()) {
    const suffix = title ? `- ${title}` : 'Bridge';
    return `Magic ${suffix}`;
  }
  const suffix = title ? ` - ${title}` : '';
  return `${appName}${suffix}`;
});

// ---
// queries
// ---

export const supplierQuery = (id: number): Query => {
  return [
    [QueryKeys.SUPPLIERID, id],
    async () => {
      try {
        const supplier = await fetchSupplier(id);
        if (supplier === null) throw new Error('Supplier not found');
        return supplier;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  ];
};

export const suppliersQuery: Query = [
  QueryKeys.SUPPLIERS,
  async () => {
    return await fetchAllSuppliersApi();
  },
];

export const swapperIdQuery = (address: string): Query => {
  return [
    QueryKeys.SWAPPERID,
    async () => {
      return await fetchSwapperId(address);
    },
  ];
};

// ---
// hooks
// ---
export const useSupplier = (id: number) => useQueryAtom(supplierState(id));
export const useSwapperId = () => {
  return useQueryAtomValue(swapperIdState);
  // const [val] = useQueryAtom(swapperIdState);
  // return val;
};
export const useSuppliers = () => useQueryAtom(suppliersState);

export const useInboundSwap = (txid: string) => useQueryAtom(inboundSwapByTxidState(txid));

export const useOutboundSwap = (swapId: IntegerType | null) => {
  const id = swapId === null ? '' : intToString(swapId);
  return useQueryAtom(outboundSwapState(id));
};

export const useFinalizedOutboundSwap = (swapId: IntegerType | null) => {
  const id = swapId === null ? '' : intToString(swapId);
  return useQueryAtom(finalizedOutboundSwapState(id));
};
