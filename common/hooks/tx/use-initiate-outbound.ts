import { atom, useAtom } from 'jotai';
import { numberToHex } from 'micro-stacks/common';
import {
  FungibleConditionCode,
  makeStandardFungiblePostCondition,
} from 'micro-stacks/transactions';
import { useCallback } from 'react';
import { xbtcAssetInfo } from '../../contracts';
import { btcToSats, parseBtcAddress } from '../../utils';
import { useStxAddress } from '../use-stx-address';
import { useTx } from '../use-tx';

interface OutboundTx {
  supplierId?: number;
  amount: string;
  address: string;
}

export const pendingInitOutboundState = atom(false);

const outboundErrorState = atom('');

export const useInitiateOutbound = ({ supplierId, address, amount }: OutboundTx) => {
  const sender = useStxAddress();
  const [pendingInitOutbound, setPendingOutbound] = useAtom(pendingInitOutboundState);
  const [error, setError] = useAtom(outboundErrorState);
  const { submit, ...tx } = useTx((contracts, submit) => {
    if (!address || supplierId === undefined || !amount || !sender) {
      throw new Error('Invalid tx payload');
    }
    setPendingOutbound(true);
    const b58 = parseBtcAddress(address);
    const version = Buffer.from(numberToHex(b58.version), 'hex');
    const amountBN = btcToSats(amount);
    const tx = contracts.bridge.initiateOutboundSwap(
      BigInt(amountBN),
      version,
      b58.hash,
      supplierId
    );
    const postCondition = makeStandardFungiblePostCondition(
      sender,
      FungibleConditionCode.Equal,
      amountBN,
      xbtcAssetInfo()
    );
    try {
      return submit(tx, { postConditions: [postCondition] });
    } catch (error) {
      setPendingOutbound(false);
      throw error;
    }
  });
  const _submit = useCallback(() => {
    try {
      parseBtcAddress(address);
      return submit();
    } catch (error) {
      setError('Please use a valid BTC address');
      setPendingOutbound(false);
    }
  }, [address, submit, setPendingOutbound, setError]);
  return {
    submit: _submit,
    ...tx,
    error: error || tx.error,
  };
};
