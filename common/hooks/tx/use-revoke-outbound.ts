import { atom, useAtom } from 'jotai';
import {
  createAssetInfo,
  FungibleConditionCode,
  makeContractFungiblePostCondition,
} from 'micro-stacks/transactions';
import { useEffect } from 'react';
import { CONTRACT_ADDRESS } from '../../constants';
import { useTx } from '../use-tx';

const revokeTxidState = atom<string | undefined>(undefined);

export function useRevokeOutbound(swapId: bigint | null, xbtc?: bigint) {
  const [revokeTxid, setRevokeTxid] = useAtom(revokeTxidState);

  const { txId, submit } = useTx((contracts, submit) => {
    if (typeof swapId !== 'bigint' || typeof xbtc !== 'bigint') {
      throw new Error('Cannot revoke outbound - no swap.');
    }
    const tx = contracts.bridge.contract.revokeExpiredOutbound(swapId);
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
  useEffect(() => {
    if (typeof txId !== 'undefined') {
      setRevokeTxid(txId);
    }
  }, [txId, setRevokeTxid]);

  return {
    revokeTxid,
    submitRevoke: submit,
  };
}
