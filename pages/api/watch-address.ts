import type { NextApiRequest, NextApiResponse } from 'next';
import { address as bAddress } from 'bitcoinjs-lib';
import { btcNetwork } from '../../common/constants';
import { getScriptHash } from '../../common/htlc';
import type { TxData } from '../../common/api/electrum';
import { getTxData, listUnspent } from '../../common/api/electrum';
import { bytesToHex } from 'micro-stacks/common';

// export interface WatchAddressApi = {
//   status: 'unsent' | 'unconfirmed' | 'confirmed';
//   txid?:
// }

interface Unsent {
  status: 'unsent';
}

interface Unconfirmed {
  status: 'unconfirmed';
  txid: string;
  amount: string;
  outputIndex: number;
}

interface Confirmed {
  status: 'confirmed';
  txid: string;
  txData: TxData;
  amount: string;
  outputIndex: number;
}

export type WatchAddressApi = Unsent | Unconfirmed | Confirmed;

type Response = WatchAddressApi | { error: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
  const address = req.query.address;
  if (typeof address !== 'string') {
    return res.status(500).send({ error: `Invalid address query` });
  }
  if (!address) {
    return res.status(200).send({ status: 'unsent' });
  }
  const output = bAddress.toOutputScript(address, btcNetwork);
  const scriptHash = getScriptHash(output);
  const [unspent] = await listUnspent(scriptHash);
  if (unspent === undefined) {
    return res.status(200).send({ status: 'unsent' });
  }
  const txid = unspent.tx_hash;
  const amount = BigInt(unspent.value).toString();
  const index = unspent.tx_pos;
  if (unspent.height === 0) {
    return res.status(200).send({ status: 'unconfirmed', txid, amount, outputIndex: index });
  }
  const txData = await getTxData(txid, address);
  return res.status(200).send({ status: 'confirmed', txid, txData, amount, outputIndex: index });
}
