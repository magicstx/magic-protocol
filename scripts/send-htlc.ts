import 'cross-fetch/polyfill';
import { ECPair, networks, payments, Psbt } from 'bitcoinjs-lib';
import { bytesToHex, hexToBytes } from 'micro-stacks/common';
import { hashSha256 } from 'micro-stacks/crypto-sha';
import { withElectrumClient } from '../common/api/electrum';
import { generateHTLCAddress, getScriptHash } from '../common/htlc';

async function run() {
  const pk = process.env.BTC_PRIVATE;
  if (!pk) throw new Error('Missing BTC private key');
  // const signer = ECPair.fromPrivateKey(Buffer.from(pk, 'hex'));
  const signer = ECPair.fromWIF(pk, networks.regtest);

  const preimage = hexToBytes('aaaa');
  const hash = hashSha256(preimage);

  const htlc = generateHTLCAddress({
    senderPublicKey: signer.publicKey,
    recipientPublicKey: signer.publicKey,
    expiration: 1,
    hash,
    swapper: 1,
  });

  const sender = payments.p2pkh({
    pubkey: signer.publicKey,
    network: networks.regtest,
  });

  const scriptHash = getScriptHash(sender.output!);
  const htlcAmount = 1000000;
  const htlcTxid = await withElectrumClient(async electrumClient => {
    const unspents = await electrumClient.blockchain_scripthash_listunspent(bytesToHex(scriptHash));
    const unspent = unspents.sort((a, b) => (a.value < b.value ? 1 : -1))[0];
    const tx = await electrumClient.blockchain_transaction_get(unspent.tx_hash, true);
    const txHex = Buffer.from(tx.hex, 'hex');

    const psbt = new Psbt({ network: networks.regtest });
    const fee = 500;

    console.log('change', unspent.value - htlcAmount - fee);
    console.log('unspent.value', unspent.value);
    console.log(unspent.value - fee);
    psbt.addInput({
      hash: unspent.tx_hash,
      index: unspent.tx_pos,
      nonWitnessUtxo: txHex,
    });
    psbt.addOutput({
      address: sender.address!,
      value: unspent.value - htlcAmount - fee,
    });
    psbt.addOutput({
      address: htlc.address!,
      value: htlcAmount,
    });
    psbt.signAllInputs(signer);
    psbt.finalizeAllInputs();
    const finalTx = psbt.extractTransaction(true);
    const txid = await electrumClient.blockchain_transaction_broadcast(finalTx.toHex());
    return txid;
  });

  console.log('htlcTxid', htlcTxid);
  // return;
}

run()
  .catch(console.error)
  .finally(() => {
    process.exit();
  });
