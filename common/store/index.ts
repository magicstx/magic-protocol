import { stacksSessionAtom } from '@micro-stacks/react';
import { atom } from 'jotai';
import { atomWithQuery, useQueryAtom, atomFamilyWithQuery } from 'jotai-query-toolkit';
import type { Query } from 'jotai-query-toolkit/nextjs';
import { atomWithStorage, waitForAll } from 'jotai/utils';
import { getPublicKey } from 'noble-secp256k1';
import { BridgeContract } from '../clarigen';
import type { SuppliersApi } from '../../pages/api/suppliers';
import { LOCAL_URL, webProvider, contracts, NETWORK_CONFIG } from '../constants';
import { generateGaiaHubConfig } from 'micro-stacks/storage';
import { bytesToHex, hexToBytes, IntegerType } from 'micro-stacks/common';
import { intToString } from '../utils';
import type { SupplierWithCapacity } from './api';

const bridge = contracts.bridge.contract;

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

export async function fetchSupplierWithContract(id: number, bridge: BridgeContract) {
  const [supplier, funds] = await Promise.all([
    webProvider.ro(bridge.getSupplier(id)),
    webProvider.ro(bridge.getFunds(id)),
  ]);
  if (supplier && funds !== null) {
    return {
      controller: supplier.controller,
      inboundFee: Number(supplier['inbound-fee']),
      outboundFee: Number(supplier['outbound-fee']),
      outboundBaseFee: Number(supplier['outbound-base-fee']),
      inboundBaseFee: Number(supplier['inbound-base-fee']),
      publicKey: bytesToHex(supplier['public-key']),
      funds: Number(funds),
      id,
    };
  }
  throw new Error(`Could not find supplier with id ${id}`);
}

export async function fetchSupplier(id: number) {
  try {
    // const bridge = webProvider().bridge.contract;
    const supplier = await fetchSupplierWithContract(id, bridge);
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
    const _id = await webProvider.ro(bridge.getSwapperId(address));
    const id = _id === null ? null : Number(_id);
    return { id };
  } catch (error) {
    console.error(error);
    return { id: null };
  }
}

export async function fetchInboundSwap(txid: string) {
  const swap = await webProvider.ro(bridge.getInboundSwap(hexToBytes(txid)));
  return swap;
}

export async function fetchOutboundSwap(swapId: bigint) {
  return await webProvider.ro(bridge.getOutboundSwap(swapId));
}

export async function fetchFinalizedOutboundSwapTxid(swapId: bigint) {
  return await webProvider.ro(bridge.getCompletedOutboundSwapTxid(swapId));
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
  if (NETWORK_CONFIG === 'mainnet') return session.addresses.mainnet;
  return session.addresses.testnet;
});

export const swapperIdState = atomWithQuery(QueryKeys.SWAPPERID, async get => {
  const address = get(currentStxAddressState);
  if (!address) return { id: null };
  const id = await fetchSwapperId(address);
  return id;
});

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

export const selectedSupplierState = atom<SupplierWithCapacity | null>(null);

export const publicKeyState = atom(get => {
  const session = get(stacksSessionAtom);
  if (!session) return null;
  const privateKey = session.appPrivateKey;
  const publicKey = getPublicKey(privateKey, true);
  return publicKey;
});

export const gaiaConfigState = atomWithQuery(QueryKeys.GAIA_CONFIG, async get => {
  const session = get(stacksSessionAtom);
  if (!session) return null;
  const config = await generateGaiaHubConfig({
    gaiaHubUrl: session.hubUrl,
    privateKey: session.appPrivateKey,
  });
  return config;
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
  const [val] = useQueryAtom(swapperIdState);
  if (val === null) return null;
  return val.id;
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
