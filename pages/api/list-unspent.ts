import type { NextApiRequest, NextApiResponse } from 'next';
import { address as bAddress } from 'bitcoinjs-lib';
import { btcNetwork } from '../../common/constants';
import { getScriptHash } from '../../common/htlc';
import { listUnspent } from '../../common/api/electrum';
import { infoApi } from '../../common/api/stacks';
import type { Unspent } from 'electrum-client-sl';

export interface ListUnspentApiOk {
  burnHeight: number;
  unspents: Unspent[];
}

export type ListUnspentApi = ListUnspentApiOk | { error: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<ListUnspentApi>) {
  const address = req.query.address;
  if (typeof address !== 'string' || !address) {
    return res.status(500).send({ error: `Invalid address query` });
  }
  const output = bAddress.toOutputScript(address, btcNetwork);
  const scriptHash = getScriptHash(output);
  const [unspents, info] = await Promise.all([listUnspent(scriptHash), infoApi.getCoreApiInfo()]);
  const sorted = unspents.sort((a, b) => {
    if (a.height === 0) return -1;
    return a.height > b.height ? -1 : 1;
  });
  // console.log('unspents', unspents);
  const responseData = {
    burnHeight: info.burn_block_height,
    unspents: sorted,
  };
  return res.status(200).send(responseData);
}
