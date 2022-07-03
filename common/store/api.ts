// import { stacksSessionAtom } from '@micro-stacks/react';
import { stacksSessionAtom } from '@micro-stacks/react';
import type { AddressBalanceResponse } from '@stacks/stacks-blockchain-api-types';
import { atomFamilyWithQuery, atomWithQuery, useQueryAtom } from 'jotai-query-toolkit';
import { bytesToHex, hexToBytes } from 'micro-stacks/common';
import type { Supplier } from '.';
import { currentStxAddressState, QueryKeys, suppliersState } from '.';
import type { BtcBalanceResponse } from '../../pages/api/btc-balance';
import type { ListUnspentApiOk } from '../../pages/api/list-unspent';
import type { WatchAddressApi } from '../../pages/api/watch-address';
import type { TxData } from '../api';
import { fetchTxData } from '../api';
import type { Transaction } from '../api/stacks';
import { getBridgeEvents } from '../api/stacks';
import { getBalances, getTx, getTxResult } from '../api/stacks';
import { LOCAL_URL, network } from '../constants';
import { pubKeyToBtcAddress } from '../utils';
import { fetchCoreApiInfo } from 'micro-stacks/api';
import { atom } from 'jotai';
import { useAtomValue } from 'jotai/utils';
import { xbtcAssetId } from '../contracts';

export const stxTxState = atomFamilyWithQuery<string | undefined, Transaction | null>(
  (get, txId) => [QueryKeys.STX_TX, txId],
  async (get, txId) => {
    if (txId === undefined || !txId) return null;
    return await getTx(txId);
  }
);

export const stxTxResultState = atomFamilyWithQuery<string | undefined, any>(
  (get, txId) => [QueryKeys.STX_TX_RESULT, txId],
  (get, txId) => {
    const tx = get(stxTxState(txId));
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return getTxResult(tx);
  }
);

export const watchAddressState = atomFamilyWithQuery<string, WatchAddressApi>(
  (get, param) => [QueryKeys.WATCH_ADDRESS, param],
  async (get, param) => {
    const url = `${LOCAL_URL}/api/watch-address?address=${param}`;
    const res = await fetch(url);
    const data = (await res.json()) as WatchAddressApi;
    return data;
  }
);

export const listUnspentState = atomFamilyWithQuery<string, ListUnspentApiOk>(
  (get, address) => [QueryKeys.WATCH_ADDRESS, address],
  async (get, address) => {
    const url = `${LOCAL_URL}/api/list-unspent?address=${address}`;
    const res = await fetch(url);
    const data = (await res.json()) as ListUnspentApiOk;
    return data;
  }
);

export const balancesState = atom(get => {
  const defaultBalances = {
    stx: '0',
    xbtc: '0',
  };
  const address = get(currentStxAddressState);
  if (!address) return defaultBalances;
  const balances = get(addressBalanceState(address));
  if (balances === null) return defaultBalances;
  const xbtcId = xbtcAssetId();
  return {
    xbtc: balances.fungible_tokens[xbtcId]?.balance || '0',
    stx: balances.stx.balance,
  };
});

export const addressBalanceState = atomFamilyWithQuery<string, AddressBalanceResponse | null>(
  (get, address) => ['stxAddressBalances', address],
  async (get, address) => {
    if (!address) return null;
    return getBalances(address);
  }
);

export const btcBalanceState = atomFamilyWithQuery<string, string>(
  (get, pubKey) => [QueryKeys.BTC_BALANCES, pubKey],
  async (get, pubKey) => {
    const publicKey = hexToBytes(pubKey);
    const address = pubKeyToBtcAddress(publicKey);
    const url = `${LOCAL_URL}/api/btc-balance?address=${address}`;
    const res = await fetch(url);
    const data = (await res.json()) as BtcBalanceResponse;
    if ('error' in data) {
      throw new Error(`Error getting btc balance: ${data.error}`);
    }
    return data.balance;
  }
);

export const btcTxState = atomFamilyWithQuery<[string, string], TxData>(
  (get, [txid, addr]) => [QueryKeys.BTC_TX, txid, addr],
  async (get, [txid, addr]) => {
    const txData = await fetchTxData(txid, addr);
    return txData;
  }
);

export const coreApiInfoState = atomWithQuery(QueryKeys.CORE_INFO, async () => {
  const info = await fetchCoreApiInfo({ url: network.getCoreApiUrl() });
  return info;
});

export type SupplierWithCapacity = Supplier & { btc: string };

export const suppliersWithCapacityState = atom<SupplierWithCapacity[]>(get => {
  const suppliers = get(suppliersState);
  return suppliers;
});

export const bridgeEventsState = atomWithQuery('BRIDGE_EVENTS', async () => {
  const events = await getBridgeEvents();
  return events;
});

// hooks

export const useWatchAddress = (address: string) => useQueryAtom(watchAddressState(address));
export const useListUnspent = (address: string) => useQueryAtom(listUnspentState(address));

export const useStxTx = (txId: string | undefined) => useQueryAtom(stxTxState(txId));

export const useBtcTx = (txid: string, address: string) =>
  useQueryAtom(btcTxState([txid, address]));

export const useCoreApiInfo = () => useQueryAtom(coreApiInfoState);

export function useStxTxResult<T>(txId: string | undefined) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const [result] = useQueryAtom(stxTxResultState(txId));
  return result as T;
}

export function useBtcBalance(publicKey: string) {
  const [balance] = useQueryAtom(btcBalanceState(publicKey));
  return balance;
}

export function useSuppliersWithCapacity() {
  return useAtomValue(suppliersWithCapacityState);
}
