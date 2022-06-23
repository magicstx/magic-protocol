import { NextApiRequest, NextApiResponse } from 'next';
import { withElectrumClient } from '../../common/api/electrum';

export interface BroadcastResponseOk {
  ok: true;
  txid: string;
}

interface BroadcastResponseErr {
  error: string;
  ok: false;
}

export type BroadcastResponse = BroadcastResponseOk | BroadcastResponseErr;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BroadcastResponse>
) {
  const txhex = req.body as string;
  if (typeof txhex !== 'string') {
    return res.status(500).send({ error: `Invalid txhex query`, ok: false });
  }
  try {
    const txid = await withElectrumClient(async client => {
      const txid = await client.blockchain_transaction_broadcast(txhex);
      return txid;
    });
    return res.status(200).send({
      ok: true,
      txid,
    });
  } catch (error) {
    return res.status(500).send({
      error: error as string,
      ok: false,
    });
  }
}
