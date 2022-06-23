import { NextApiRequest, NextApiResponse } from 'next';
import { getTxData } from '../../common/api/electrum';

type Data = Awaited<ReturnType<typeof getTxData>>;

type Response = Data | { error: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
  const txid = req.query.txid;
  const address = req.query.address;
  if (typeof txid !== 'string' || typeof address !== 'string') {
    res.status(500).send({
      error: 'Must provide `txid` and `address` parameters',
    });
    return;
  }
  const txData = await getTxData(txid, address);
  return res.status(200).send(txData);
}
