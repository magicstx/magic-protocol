import { NextApiRequest, NextApiResponse } from 'next';
import { getTxData } from '../../common/api/electrum';

type Data = Awaited<ReturnType<typeof getTxData>>;

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const txid = req.query.txid;
  const address = req.query.address;
  if (typeof txid !== 'string' || typeof address !== 'string') {
    res.status(500).end();
    return;
  }
  const txData = await getTxData(txid, address);
  return res.status(200).send(txData);
}
