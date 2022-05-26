import { useAtomValue } from 'jotai/utils';
import { hexToBytes, intToBigInt } from 'micro-stacks/common';
import { hashSha256 } from 'micro-stacks/crypto-sha';
import { fetchTxData } from '../../api';
import { numberToLE, CSV_DELAY_BUFF } from '../../htlc';
import { publicKeyState, useSwapperId } from '../../store';
import { InboundSwapSent } from '../../store/swaps';
import { useTx } from '../use-tx';

export const useEscrowSwap = (swap: InboundSwapSent) => {
  const { btcTxid, secret, supplier, address } = swap;
  const publicKey = useAtomValue(publicKeyState);
  const swapperId = useSwapperId();
  return useTx(async (contracts, submit) => {
    // if (!supplier) throw new Error('Invalid supplier');
    if (!publicKey) throw new Error('Not logged in');
    if (swapperId === null) throw new Error('Swapper not registered');
    const txData = await fetchTxData(btcTxid, address);
    const hash = hashSha256(hexToBytes(secret));
    const swapperHex = numberToLE(swapperId);
    const amount = txData.amount;
    const amountWithFeeRate = (amount * (10000n - intToBigInt(supplier.inboundFee))) / 10000n;
    const minToReceive = amountWithFeeRate - intToBigInt(supplier.inboundBaseFee);
    const escrowTx = contracts.bridge.contract.escrowSwap(
      txData.block,
      txData.prevBlocks,
      txData.txHex,
      txData.proof,
      txData.outputIndex,
      Buffer.from(publicKey, 'hex'),
      Buffer.from(supplier.publicKey, 'hex'),
      CSV_DELAY_BUFF,
      Buffer.from(hash),
      Buffer.from(swapperHex, 'hex'),
      supplier.id,
      minToReceive
    );
    return submit(escrowTx);
  });
};
