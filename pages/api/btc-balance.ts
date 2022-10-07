import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchBtcBalance } from '../../common/api/electrum';

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
    const balance = await fetchBtcBalance(address);
    res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=30');
    return res.status(200).send({
      balance: balance.toString(),
    });
  } catch (error) {
    res.status(500).send({ error: `Unable to fetch balance for ${address}` });
  }
}
