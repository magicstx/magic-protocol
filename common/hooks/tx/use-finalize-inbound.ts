import { hexToBytes, IntegerType } from 'micro-stacks/common';
import {
  createAssetInfo,
  FungibleConditionCode,
  makeContractFungiblePostCondition,
  PostConditionMode,
} from 'micro-stacks/transactions';
import { CONTRACT_ADDRESS } from '../../constants';
import { InboundSwap } from '../../store';
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
    const tx = contracts.bridge.contract.finalizeSwap(txBuff, preimageBuff);

    const postCondition = makeContractFungiblePostCondition(
      CONTRACT_ADDRESS,
      'bridge',
      FungibleConditionCode.LessEqual,
      xbtc,
      createAssetInfo(CONTRACT_ADDRESS, 'xbtc', 'xbtc')
    );
    return submit(tx, {
      postConditions: [postCondition],
    });
  });
};
