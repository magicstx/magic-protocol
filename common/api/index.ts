import { hexToBytes } from 'micro-stacks/common';
import { BroadcastResponse } from '../../pages/api/btc-broadcast';
import type { SponsorResult } from '../../pages/api/sponsor';
import type { BridgeContract } from '../clarigen';
import { LOCAL_URL } from '../constants';
import type { TxData as TxDataApi } from './electrum';

type MintParams = Parameters<BridgeContract['escrowSwap']>;
type BlockParam = MintParams[0];
type PrevBlocksParam = MintParams[1];
type ProofParam = MintParams[3];

export interface TxData {
  block: BlockParam;
  prevBlocks: PrevBlocksParam;
  txHex: Uint8Array;
  proof: ProofParam;
  outputIndex: number;
  amount: bigint;
  burnHeight: number;
}

export async function fetchTxData(txid: string, address: string): Promise<TxData> {
  try {
    const url = `${LOCAL_URL || ''}/api/tx-data?txid=${txid}&address=${address}`;
    const res = await fetch(url);
    const apiTx = (await res.json()) as unknown as TxDataApi;
    const { block, proof, txHex, outputIndex, prevBlocks, amount, burnHeight } = apiTx;
    return {
      block: {
        height: BigInt(block.height),
        header: hexToBytes(block.header),
      },
      prevBlocks: prevBlocks.map(b => hexToBytes(b)),
      txHex: hexToBytes(txHex),
      proof: {
        hashes: proof.hashes.map(hexToBytes),
        'tree-depth': BigInt(proof['tree-depth']),
        'tx-index': BigInt(proof['tx-index']),
      },
      outputIndex,
      amount: BigInt(amount),
      burnHeight,
    };
  } catch (error) {
    console.error(error);
    throw new Error(`Unable to fetch BTC transaction data for txid: ${txid}`);
  }
}

export async function sponsorTransaction(txHex: string): Promise<string> {
  const url = `/api/sponsor`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tx: txHex }),
    method: 'POST',
  });
  const data = (await res.json()) as SponsorResult;
  if ('error' in data) {
    throw new Error(data.error);
  }
  return data.txId;
}

export async function broadcastBtc(txHex: string) {
  const url = `${LOCAL_URL}/api/btc-broadcast`;
  const res = await fetch(url, {
    method: 'POST',
    body: txHex,
  });
  const data = (await res.json()) as BroadcastResponse;
  if ('error' in data) {
    throw new Error(data.error);
  }
  return data.txid;
}
