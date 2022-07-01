import type { NextApiRequest, NextApiResponse } from 'next';
import { address as bAddress } from 'bitcoinjs-lib';
import { btcNetwork } from '../../common/constants';
import { getScriptHash } from '../../common/htlc';
import { withElectrumClient } from '../../common/api/electrum';
import { bytesToHex } from 'micro-stacks/common';

export interface BtcBalanceOkResponse {
  balance: string;
}

export interface BtcBalanceErrResponse {
  error: string;
}

export type BtcBalanceResponse = BtcBalanceErrResponse | BtcBalanceOkResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BtcBalanceResponse>
) {
  const address = req.query.address;
  if (typeof address !== 'string') {
    return res.status(500).send({ error: `Invalid address query` });
  }
  try {
    return await withElectrumClient(async client => {
      const output = bAddress.toOutputScript(address, btcNetwork);
      const scriptHash = getScriptHash(output);
      const balances = await client.blockchain_scripthash_getBalance(bytesToHex(scriptHash));
      const balance = BigInt(balances.unconfirmed) + BigInt(balances.confirmed);
      res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=30');
      return res.status(200).send({
        balance: balance.toString(),
      });
    });
  } catch (error) {
    res.status(500).send({ error: `Unable to fetch balance for ${address}` });
  }
}
