import {
  AddressHashMode,
  broadcastTransaction,
  deserializeTransaction,
  sponsorTransaction,
  StacksTransaction,
} from 'micro-stacks/transactions';
import { NextApiRequest, NextApiResponse } from 'next';
import { fetchAccountNonce } from '../../common/api/stacks';
import { sponsorAddress } from '../../common/api-constants';
import { network, TYPED_CLARITY_ADDRESS } from '../../common/constants';
// import { sponsorTransaction } from '@stacks/transactions';

function validateTransaction(tx: StacksTransaction) {
  if (tx.payload.payloadType !== 2) return false;
  if (tx.payload.contractAddress.hash160 !== TYPED_CLARITY_ADDRESS.hash160) return false;
  return true;
}

interface SponsorResultErr {
  error: string;
}

interface SponsorResultOk {
  txId: string;
}

export type SponsorResult = SponsorResultOk | SponsorResultErr;

interface SponsorRequest {
  tx: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<SponsorResult>) {
  const txHex = (req.body as SponsorRequest).tx;
  if (typeof txHex !== 'string') {
    return res.status(500).send({ error: 'Missing tx parameter' });
  }
  const tx = deserializeTransaction(txHex);
  if (!validateTransaction(tx)) {
    return res.status(400).send({ error: 'Invalid transaction' });
  }
  const sponsorPrivateKey = process.env.STX_PRIVATE;
  if (!sponsorPrivateKey) {
    return res.status(500).send({ error: 'Unable to sponsor' });
  }
  const principal = sponsorAddress(sponsorPrivateKey);
  const nonce = await fetchAccountNonce(principal);
  const sponsored = await sponsorTransaction({
    transaction: tx,
    fee: 10000n, // 0.01 stx
    sponsorPrivateKey: sponsorPrivateKey,
    sponsorNonce: nonce,
    network,
  });

  const result = await broadcastTransaction(sponsored, network);
  if ('error' in result) {
    res.status(500).send({ error: `${result.error} - ${result.reason}` });
  } else {
    res.status(200).send({ txId: result.txid });
  }
}
