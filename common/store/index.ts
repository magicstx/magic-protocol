import { stacksSessionAtom } from '@micro-stacks/react';
import { atom } from 'jotai';
import { atomWithQuery, useQueryAtom, atomFamilyWithQuery } from 'jotai-query-toolkit';
import type { Query } from 'jotai-query-toolkit/nextjs';
import { atomWithStorage } from 'jotai/utils';
import { getPublicKey } from 'noble-secp256k1';
import { BridgeContract } from '../clarigen';
import { OperatorsApi } from '../../pages/api/operators';
import { LOCAL_URL, webProvider, contracts, NETWORK_CONFIG } from '../constants';
import { generateGaiaHubConfig } from 'micro-stacks/storage';
import { bytesToHex, hexToBytes, IntegerType } from 'micro-stacks/common';
import { intToString } from '../utils';

const bridge = contracts.bridge.contract;

export enum QueryKeys {
  OPERATORID = 'operatorById',
  SWAPPERID = 'swapperId',
  OPERATORS = 'operators',
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
}

export async function fetchOperatorWithContract(id: number, bridge: BridgeContract) {
  const [operator, funds] = await Promise.all([
    webProvider.ro(bridge.getOperator(id)),
    webProvider.ro(bridge.getFunds(id)),
  ]);
  if (operator && funds !== null) {
    return {
      controller: operator.controller,
      inboundFee: Number(operator['inbound-fee']),
      outboundFee: Number(operator['outbound-fee']),
      outboundBaseFee: Number(operator['outbound-base-fee']),
      inboundBaseFee: Number(operator['inbound-base-fee']),
      publicKey: bytesToHex(operator['public-key']),
      funds: Number(funds),
      name: operator.name,
      id,
    };
  }
  throw new Error(`Could not find operator with id ${id}`);
}

export async function fetchOperator(id: number) {
  try {
    // const bridge = webProvider().bridge.contract;
    const operator = await fetchOperatorWithContract(id, bridge);
    if (operator === null) {
      throw new Error(`Could not find operator with id ${id}`);
    }
    return operator;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchAllOperatorsApi() {
  const url = `${LOCAL_URL}/api/operators`;
  const res = await fetch(url);
  const data = (await res.json()) as OperatorsApi;
  return data.operators;
}

export async function fetchSwapperId(address: string) {
  try {
    const _id = await webProvider.ro(bridge.getSwapperId(address));
    console.log('Swapper ID from contract:', _id);
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

export type Operator = Awaited<ReturnType<typeof fetchOperator>>;

// ---
// atoms
// ---
export const operatorState = atomFamilyWithQuery<number, Operator>(
  (get, param) => [QueryKeys.OPERATORID, param],
  async (get, param) => {
    try {
      const operator = await fetchOperator(param);
      return operator;
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

export const operatorsState = atomWithQuery(QueryKeys.OPERATORS, async get => {
  const operators = await fetchAllOperatorsApi();
  return operators;
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

export const selectedOperatorState = atom<Operator | null>(null);

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
// export const operatorQuery: Query<{ id: number }> = [
//   QueryKeys.OPERATORID,
//   (ctx, query) => {
//     if (!query?.id) throw new Error('Missing id param');
//     return fetchOperator(query.id);
//   },
// ];

export const operatorQuery = (id: number): Query => {
  return [
    [QueryKeys.OPERATORID, id],
    async () => {
      try {
        const operator = await fetchOperator(id);
        if (operator === null) throw new Error('Operator not found');
        return operator;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  ];
};

export const operatorsQuery: Query = [
  QueryKeys.OPERATORS,
  async () => {
    return await fetchAllOperatorsApi();
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
export const useOperator = (id: number) => useQueryAtom(operatorState(id));
export const useSwapperId = () => {
  const [val] = useQueryAtom(swapperIdState);
  if (val === null) return null;
  return val.id;
};
export const useOperators = () => useQueryAtom(operatorsState);

export const useInboundSwap = (txid: string) => useQueryAtom(inboundSwapByTxidState(txid));

export const useOutboundSwap = (swapId: IntegerType | null) => {
  const id = swapId === null ? '' : intToString(swapId);
  return useQueryAtom(outboundSwapState(id));
};

export const useFinalizedOutboundSwap = (swapId: IntegerType | null) => {
  const id = swapId === null ? '' : intToString(swapId);
  return useQueryAtom(finalizedOutboundSwapState(id));
};
