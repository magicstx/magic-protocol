import { useAtom } from 'jotai';
import { deserializeCV, ResponseOkCV, UIntCV } from 'micro-stacks/clarity';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { footerSwapIdState } from '../../components/footer';
import { useOutboundSwap as useOutboundSwapState, useFinalizedOutboundSwap } from '../store';
import { useStxTx, useListUnspent } from '../store/api';
import { getOutboundAddress } from '../utils';
import { useRevokeOutbound } from './tx/use-revoke-outbound';

export function useOutboundSwap(_txId?: string) {
  let txId: string;
  const router = useRouter();
  if (_txId) {
    txId = _txId;
  } else {
    const routerTxId = router.query.txId;
    if (typeof routerTxId !== 'string') throw new Error('Invalid txId');
    txId = routerTxId;
  }
  const [initTx] = useStxTx(txId);
  // const [swap, setSwap] = useAtom(swapState);
  const initStatus = initTx?.status || 'pending';

  const swapId = useMemo(() => {
    if (!initTx || initTx.status !== 'success') return null;
    if (initTx.tx_type !== 'contract_call') return null;
    const cvHex = initTx.tx_result.hex;
    const cv: ResponseOkCV<UIntCV> = deserializeCV(cvHex);
    return cv.value.value;
  }, [initTx]);

  const [swap] = useOutboundSwapState(swapId);

  const [footerSwapId, setSwapId] = useAtom(footerSwapIdState);

  useEffect(() => {
    if (footerSwapId !== txId) {
      setSwapId(txId);
    }
  }, [txId, setSwapId, footerSwapId]);

  const btcAddress = useMemo(() => {
    if (!swap) return '';
    return getOutboundAddress(swap.hash, swap.version);
  }, [swap]);
  const [unspentApiResponse] = useListUnspent(btcAddress);
  const unspent = useMemo(() => {
    if (!swap || unspentApiResponse.unspents === undefined) return undefined;
    const { burnHeight } = unspentApiResponse;
    return unspentApiResponse.unspents.find(unspent => {
      const heightOk = unspent.height === 0 || unspent.height > burnHeight - 300;
      const amountOk = BigInt(unspent.value) === swap.sats;
      return heightOk && amountOk;
    });
  }, [unspentApiResponse, swap]);

  const [finalizeTxid] = useFinalizedOutboundSwap(swapId);

  const isCanceled = finalizeTxid === '00';

  const { revokeTxid, submitRevoke } = useRevokeOutbound(swapId, swap?.xbtc);

  return {
    initTx,
    initStatus,
    swapId,
    swap,
    btcAddress,
    finalizeTxid,
    txId,
    unspent,
    btcTxId: finalizeTxid || unspent?.tx_hash,
    submitRevoke,
    revokeTxid,
    isCanceled,
  };
}
