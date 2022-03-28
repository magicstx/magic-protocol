import { Configuration, BlocksApi, TransactionsApi, InfoApi } from '@stacks/blockchain-api-client';
import type {
  AddressBalanceResponse,
  AddressNonces,
  Transaction as ApiTx,
} from '@stacks/stacks-blockchain-api-types';
import { deserializeCV } from 'micro-stacks/clarity';
import { cvToValue } from '@clarigen/core';
import { network, coreUrl } from '../constants';
import { getTxId } from '../utils';
import {
  fetchBlockByBurnBlockHash,
  fetchBlockByBurnBlockHeight,
  fetchCoreApiInfo,
} from 'micro-stacks/api';
import { electrumClient } from './electrum';

export const apiConfig = new Configuration({
  fetchApi: fetch,
  basePath: coreUrl,
});

export const blocksApi = new BlocksApi(apiConfig);
export const txApi = new TransactionsApi(apiConfig);
export const infoApi = new InfoApi(apiConfig);

export async function getStacksBlock(
  hash: string
): Promise<{ stacksHeight: number; burnHeight: number }> {
  try {
    const block = await fetchBlockByBurnBlockHash({
      url: network.getCoreApiUrl(),
      burn_block_hash: hash,
    });
    return {
      stacksHeight: block.height,
      burnHeight: block.burn_block_height,
    };
  } catch (error) {
    console.error(error);
    console.error(`Unable to find stacks block for burn hash ${hash}`);
    throw new Error(`Unable to find stacks block for burn hash ${hash}`);
  }
}

export async function getStacksHeight(burnHeight: number) {
  try {
    const url = network.getCoreApiUrl();
    const block = await fetchBlockByBurnBlockHeight({
      url,
      burn_block_height: burnHeight,
    });
    return block.height;
  } catch (error) {
    return undefined;
  }
}

interface StacksBlockByHeight {
  header: string;
  prevBlocks: string[];
  stacksHeight: number;
}
export async function findStacksBlockAtHeight(
  height: number,
  prevBlocks: string[]
): Promise<StacksBlockByHeight> {
  const [header, stacksHeight] = await Promise.all([
    electrumClient.blockchain_block_header(height),
    getStacksHeight(height),
  ]);
  if (typeof stacksHeight !== 'undefined') {
    return {
      header,
      prevBlocks,
      stacksHeight,
    };
  }
  prevBlocks.unshift(header);
  return findStacksBlockAtHeight(height + 1, prevBlocks);
}

export async function confirmationsToHeight(confirmations: number) {
  const url = network.getCoreApiUrl();
  const nodeInfo = await fetchCoreApiInfo({ url });
  const curHeight = nodeInfo.burn_block_height;
  const height = curHeight - confirmations + 1;
  return height;
}

export async function fetchAccountNonce(address: string) {
  const url = `${network.getCoreApiUrl()}/extended/v1/address/${address}/nonces`;
  const res = await fetch(url);
  const data = (await res.json()) as AddressNonces;
  return data.possible_next_nonce;
}

type TransactionStatus = 'success' | 'abort_by_response' | 'abort_by_post_condition' | 'pending';
export type Transaction = Awaited<ReturnType<typeof getTx>>;

export async function getTx(txId: string) {
  const id = getTxId(txId);
  try {
    const tx = (await txApi.getTransactionById({
      txId: id,
      unanchored: true,
    })) as ApiTx;
    return {
      ...tx,
      status: tx.tx_status as TransactionStatus,
    };
  } catch (error) {
    return null;
  }
}

export function getTxResult<T>(tx: Transaction | null): T | null {
  if (!tx || tx.tx_status !== 'success') return null;
  const cvHex = tx.tx_result.hex;
  const cv = deserializeCV(cvHex);
  const jsVal = cvToValue<T>(cv);
  return jsVal;
}

export async function getBalances(address: string): Promise<AddressBalanceResponse> {
  const url = `${network.getCoreApiUrl()}/extended/v1/address/${address}/balances?unanchored=true`;
  const res = await fetch(url);
  const data = (await res.json()) as AddressBalanceResponse;
  return data;
}
