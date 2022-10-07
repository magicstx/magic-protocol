import type { IntegerType } from 'micro-stacks/common';
import { hexToBytes } from 'micro-stacks/common';
import {
  FungibleConditionCode,
  makeContractFungiblePostCondition,
} from 'micro-stacks/transactions';
import { bridgeAddress, xbtcAssetInfo } from '../../contracts';
import { useTx } from '../use-tx';

interface FinalizeSwap {
  txid: string;
  preimage: string;
  // swap: InboundSwap;
  xbtc: IntegerType;
}

export const useFinalizeInbound = ({ txid, preimage, xbtc }: FinalizeSwap) => {
  return useTx((contracts, submit) => {
    // if (!swap) throw new Error('Missing swap');
    const txBuff = Buffer.from(txid, 'hex');
    const preimageBuff = Buffer.from(hexToBytes(preimage));
    const tx = contracts.bridge.finalizeSwap(txBuff, preimageBuff);

    const postCondition = makeContractFungiblePostCondition(
      bridgeAddress(),
      'bridge',
      FungibleConditionCode.LessEqual,
      xbtc,
      xbtcAssetInfo()
    );
    return submit(tx, {
      postConditions: [postCondition],
    });
  });
};
