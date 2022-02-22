import type { SponsorResult } from '../../pages/api/sponsor';
import type { BridgeContract } from '../clarigen';
import { LOCAL_URL } from '../constants';
import type { TxData as TxDataApi } from './electrum';

type MintParams = Parameters<BridgeContract['escrowSwap']>;
type BlockParam = MintParams[0];
type ProofParam = MintParams[2];

interface TxData {
  block: BlockParam;
  txHex: Buffer;
  proof: ProofParam;
  outputIndex: number;
}

export async function fetchTxData(txid: string, address: string): Promise<TxData> {
  try {
    const url = `${LOCAL_URL || ''}/api/tx-data?txid=${txid}&address=${address}`;
    const res = await fetch(url);
    const { block, proof, txHex, outputIndex } = (await res.json()) as unknown as TxDataApi;
    return {
      block: {
        height: BigInt(block.height),
        header: Buffer.from(block.header, 'hex'),
      },
      txHex: Buffer.from(txHex, 'hex'),
      proof: {
        hashes: proof.hashes.map(h => Buffer.from(h, 'hex')),
        'tree-depth': BigInt(proof['tree-depth']),
        'tx-index': BigInt(proof['tx-index']),
      },
      outputIndex,
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
