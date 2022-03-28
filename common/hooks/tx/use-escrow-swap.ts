import { useAtomValue } from 'jotai/utils';
import { hexToBytes } from 'micro-stacks/common';
import { hashSha256 } from 'micro-stacks/crypto-sha';
import { fetchTxData } from '../../api';
import { numberToLE, CSV_DELAY_BUFF } from '../../htlc';
import { publicKeyState, useSwapperId } from '../../store';
import { InboundSwapSent } from '../../store/swaps';
import { useTx } from '../use-tx';

export const useEscrowSwap = (swap: InboundSwapSent) => {
  const { btcTxid, secret, operator, address } = swap;
  const publicKey = useAtomValue(publicKeyState);
  const swapperId = useSwapperId();
  return useTx(async (contracts, submit) => {
    // if (!operator) throw new Error('Invalid operator');
    if (!publicKey) throw new Error('Not logged in');
    if (swapperId === null) throw new Error('Swapper not registered');
    const txData = await fetchTxData(btcTxid, address);
    const hash = hashSha256(hexToBytes(secret));
    const swapperHex = numberToLE(swapperId);
    const escrowTx = contracts.bridge.contract.escrowSwap(
      txData.block,
      txData.prevBlocks,
      txData.txHex,
      txData.proof,
      txData.outputIndex,
      Buffer.from(publicKey, 'hex'),
      Buffer.from(operator.publicKey, 'hex'),
      CSV_DELAY_BUFF,
      Buffer.from(hash),
      Buffer.from(swapperHex, 'hex'),
      operator.id
    );
    return submit(escrowTx);
  });
};
