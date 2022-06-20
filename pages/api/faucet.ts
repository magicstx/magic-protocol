/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AnchorMode, broadcastTransaction, makeSTXTokenTransfer } from 'micro-stacks/transactions';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ECPair, networks, Psbt, address as bAddress, payments } from 'bitcoinjs-lib';
import ElectrumClient from 'electrum-client-sl';
import { getScriptHash, reverseBuffer } from '../../common/htlc';
import { network } from '../../common/constants';
import { withElectrumClient } from '../../common/api/electrum';
import { bytesToHex } from 'micro-stacks/common';

type Data = {
  btcTxid: string;
  stxTxid: string;
};

async function sendStx(address: string) {
  const pk = process.env.STX_PRIVATE;
  if (!pk) throw new Error('Missing STX private key');
  const tx = await makeSTXTokenTransfer({
    senderKey: pk,
    recipient: address,
    amount: 1_000_000n * 50n,
    anchorMode: AnchorMode.Any,
    network,
  });

  const result = await broadcastTransaction(tx, network);
  if ('error' in result) {
    throw new Error(`Error broadcasting STX: ${result.error} - ${result.reason}`);
  }
  return result.txid;
}

async function sendBtc(address: string) {
  const pk = process.env.BTC_PRIVATE;
  if (!pk) throw new Error('Missing BTC private key');
  // const signer = ECPair.fromPrivateKey(Buffer.from(pk, 'hex'));
  const signer = ECPair.fromWIF(pk, networks.regtest);
  return withElectrumClient(async electrumClient => {
    const sender = payments.p2pkh({
      pubkey: signer.publicKey,
      network: networks.regtest,
    });
    const senderAddress = sender.address!;

    // const scriptHash = getScriptHash(sender.h);
    const scriptHash = getScriptHash(sender.output!);
    const unspents = await electrumClient.blockchain_scripthash_listunspent(bytesToHex(scriptHash));
    const unspent = unspents.sort((a, b) => (a.value < b.value ? 1 : -1))[0];
    const tx = await electrumClient.blockchain_transaction_get(unspent.tx_hash, true);
    const txHex = Buffer.from(tx.hex, 'hex');

    const psbt = new Psbt({ network: networks.regtest });
    const faucetAmount = 1000000;
    const fee = 500;
    psbt.addInput({
      hash: unspent.tx_hash,
      index: unspent.tx_pos,
      nonWitnessUtxo: txHex,
    });
    psbt.addOutput({
      address: senderAddress,
      value: unspent.value - faucetAmount - fee,
    });
    psbt.addOutput({
      address,
      value: faucetAmount,
    });
    psbt.signAllInputs(signer);
    psbt.finalizeAllInputs();
    const finalTx = psbt.extractTransaction(true);
    const txid = await electrumClient.blockchain_transaction_broadcast(finalTx.toHex());
    return txid;
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const btcAddress = req.query.btcAddress;
  const stxAddress = req.query.stxAddress;

  const [btcTxid, stxTxid] = await Promise.all([
    sendBtc(btcAddress as string),
    sendStx(stxAddress as string),
  ]);
  res.status(200).json({ btcTxid, stxTxid });
}
