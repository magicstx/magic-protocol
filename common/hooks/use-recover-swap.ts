import { useCallback, useState } from 'react';
import { ECPair, payments, Psbt, script as bScript } from 'bitcoinjs-lib';
import { hexToBytes } from 'micro-stacks/common';
import { hashSha256 } from 'micro-stacks/crypto-sha';
import { generateHTLCAddress } from '../htlc';
import { broadcastBtc } from '../api';
import { useAtomCallback } from 'jotai/utils';
import { stacksSessionAtom } from '@micro-stacks/react';
import { btcNetwork } from '../constants';
import { btcAddressState, publicKeyState } from '../store';
import { useInboundSwap } from './use-inbound-swap';
import { btcFeesState, useBtcTx } from '../store/api';

export function useRecoverSwap() {
  const { swap, updateSwap } = useInboundSwap();
  if (!('btcTxid' in swap))
    throw new Error('Invalid swap state (useRecoverSwap) - missing btcTxid');
  const [btcTx] = useBtcTx(swap.btcTxid, swap.address);
  const [txid, setTxid] = useState('');

  const submit = useAtomCallback(
    useCallback(
      async (get, _set) => {
        const feeRate = get(btcFeesState);
        const btcAddress = get(btcAddressState);
        const session = get(stacksSessionAtom);
        const publicKey = get(publicKeyState);
        const privateKey = session?.appPrivateKey;
        if (!privateKey || !publicKey) {
          throw new Error('Fatal: not signed in.');
        }
        const signer = ECPair.fromPrivateKey(Buffer.from(privateKey, 'hex'), {
          network: btcNetwork,
        });
        const hash = hashSha256(hexToBytes(swap.secret));
        const htlc = generateHTLCAddress({
          expiration: swap.expiration,
          senderPublicKey: hexToBytes(publicKey),
          recipientPublicKey: hexToBytes(swap.supplier.publicKey),
          hash,
          swapper: swap.swapperId,
        });

        const psbt = new Psbt({ network: btcNetwork });
        const weight = 312;
        const fee = weight * feeRate;

        const htlcAmount = Number(btcTx.amount);

        psbt.addInput({
          hash: swap.btcTxid,
          index: btcTx.outputIndex,
          nonWitnessUtxo: Buffer.from(btcTx.txHex),
          redeemScript: htlc.redeem!.output,
          sequence: swap.expiration,
        });

        psbt.addOutput({
          address: btcAddress,
          value: htlcAmount - fee,
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
        const broadcastId = await broadcastBtc(finalTx.toHex());
        setTxid(broadcastId);
        void updateSwap({
          ...swap,
          recoveryTxid: broadcastId,
        });
      },
      [updateSwap, setTxid, btcTx.outputIndex, btcTx.txHex, btcTx.amount, swap]
    )
  );

  return {
    submit,
    txid,
  };
}
