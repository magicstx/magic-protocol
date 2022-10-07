import 'cross-fetch/polyfill';
import { ECPair, networks, payments, Psbt, script as bScript } from 'bitcoinjs-lib';
import { hexToBytes } from 'micro-stacks/common';
import { hashSha256 } from 'micro-stacks/crypto-sha';
import { withElectrumClient } from '../common/api/electrum';
import { generateHTLCAddress } from '../common/htlc';
import BigNumber from 'bignumber.js';

async function run() {
  const pk = process.env.BTC_PRIVATE;
  if (!pk) throw new Error('Missing BTC private key');
  // const signer = ECPair.fromPrivateKey(Buffer.from(pk, 'hex'));
  const signer = ECPair.fromWIF(pk, networks.regtest);

  const preimage = hexToBytes('aaaa');
  const hash = hashSha256(preimage);

  const expiration = 1;

  const htlc = generateHTLCAddress({
    senderPublicKey: signer.publicKey,
    recipientPublicKey: signer.publicKey,
    expiration,
    hash,
    swapper: 1,
  });

  const sender = payments.p2pkh({
    pubkey: signer.publicKey,
    network: networks.regtest,
  });

  const [htlcTxid] = process.argv.slice(2);

  const recoverTxid = await withElectrumClient(async electrumClient => {
    const tx = await electrumClient.blockchain_transaction_get(htlcTxid, true);
    const txHex = Buffer.from(tx.hex, 'hex');

    const psbt = new Psbt({ network: networks.regtest });
    const weight = 312;
    const feeRate = 1;
    const fee = weight * feeRate;

    const htlcAmount = new BigNumber(tx.vout[1].value).shiftedBy(8).decimalPlaces(0);

    psbt.addInput({
      hash: htlcTxid,
      index: 1,
      nonWitnessUtxo: txHex,
      redeemScript: htlc.redeem!.output,
      sequence: expiration,
    });

    psbt.addOutput({
      address: sender.address!,
      value: htlcAmount.minus(fee).toNumber(),
    });
    await psbt.signInputAsync(0, signer);

    psbt.finalizeInput(0, (index, input, script) => {
      const partialSigs = input.partialSig;
      if (!partialSigs) throw new Error('Error when finalizing HTLC input');
      const inputScript = bScript.compile([
        partialSigs[0].signature,
        Buffer.from('00', 'hex'), // OP_FALSE
      ]);
      const payment = payments.p2sh({
        redeem: {
          output: script,
          input: inputScript,
        },
      });
      return {
        finalScriptSig: payment.input,
        finalScriptWitness: undefined,
      };
    });
    const finalTx = psbt.extractTransaction();
    const txid = await electrumClient.blockchain_transaction_broadcast(finalTx.toHex());
    return txid;
  });

  console.log('recoverTxid', recoverTxid);
}

run()
  .catch(console.error)
  .finally(() => {
    process.exit();
  });
