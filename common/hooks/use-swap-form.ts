import { useCallback, useEffect } from 'react';
import { useInput } from './use-input';
import { useAtom } from 'jotai';
import { useAtomCallback, useAtomValue } from 'jotai/utils';
import { btcAddressState, suppliersState, swapperIdState, useSwapperId } from '../store';
import { useGenerateInboundSwap } from './use-generate-inbound-swap';
import { useRouter } from 'next/router';
import { pendingInitOutboundState, useInitiateOutbound } from './tx/use-initiate-outbound';
import nProgress from 'nprogress';
import { useGenerateOutboundSwap } from './use-generate-outbound-swap';
import {
  inputTokenState,
  outputTokenState,
  pendingRegisterSwapperState,
  amountState,
  currentSupplierState,
  feeRateState,
  feePercentState,
  outputAmountBtcState,
  txFeeBtcState,
  txFeePercentState,
  btcAddressValidState,
  hasCapacityState,
  swapFormErrorState,
  swapFormValidState,
  amountSatsBNState,
  isOutboundState,
} from '../store/swap-form';

export function useSwapForm() {
  const inputToken = useAtomValue(inputTokenState);
  const amount = useInput(useAtom(amountState));
  const outputToken = useAtomValue(outputTokenState);
  const router = useRouter();
  const btcAddress = useInput(useAtom(btcAddressState));
  const supplier = useAtomValue(currentSupplierState);
  const [pendingInitOutbound, setPendingOutbound] = useAtom(pendingInitOutboundState);
  const fee = useAtomValue(feeRateState);
  const supplierBaseFee = useAtomValue(feeRateState);
  const feePercent = useAtomValue(feePercentState);
  const outputAmount = useAtomValue(outputAmountBtcState);
  const txFeeBtc = useAtomValue(txFeeBtcState);
  const txFeePercent = useAtomValue(txFeePercentState);
  const supplierCapacity = supplier.capacity.toString();
  const validBtc = useAtomValue(btcAddressValidState);
  const hasCapacity = useAtomValue(hasCapacityState);
  const errorMessage = useAtomValue(swapFormErrorState);
  const isValid = useAtomValue(swapFormValidState);

  const { generate: generateOutbound } = useGenerateOutboundSwap();
  const { generate } = useGenerateInboundSwap();

  const submitInbound = useAtomCallback(
    useCallback(
      async (get, set) => {
        const { id: swapperId } = get(swapperIdState);
        const suppliers = get(suppliersState);
        const amountBN = get(amountSatsBNState);
        const supplier = get(currentSupplierState);
        const currentSupplier = suppliers.find(s => s.id === supplier.id);
        const isValid = get(swapFormValidState);
        if (typeof swapperId === 'number') {
          if (!isValid) return;
          if (typeof currentSupplier === 'undefined')
            throw new Error('Invalid state: no supplier.');
          const swap = await generate({
            supplier: currentSupplier,
            inputAmount: amountBN.toString(),
          });
          void router.push({
            pathname: '/inbound/[swapId]',
            query: { swapId: swap.id },
          });
        } else {
          set(pendingRegisterSwapperState, true);
        }
      },
      [generate, router]
    )
  );

  const outboundTx = useInitiateOutbound({
    address: btcAddress.value,
    supplierId: supplier.id,
    amount: amount.value,
  });

  const submit = useAtomCallback(
    useCallback(
      async (get, set) => {
        nProgress.start();
        const isOutbound = get(isOutboundState);
        const isValid = get(swapFormValidState);
        if (isOutbound) {
          if (!isValid) return;
          set(pendingInitOutboundState, true);
          void outboundTx.submit();
        } else {
          await submitInbound();
        }
        nProgress.done();
      },
      [submitInbound, outboundTx]
    )
  );

  const routeToOutbound = useAtomCallback(
    useCallback(
      async (get, set, txId: string) => {
        const amount = get(amountSatsBNState);
        await generateOutbound({ txId, amount: amount.toString() });
        await router.push({
          pathname: '/outbound/[txId]',
          query: { txId },
        });
      },
      [generateOutbound, router]
    )
  );

  useEffect(() => {
    if (outboundTx.txId) {
      void routeToOutbound(outboundTx.txId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outboundTx.txId]);

  return {
    inputToken,
    outputToken,
    outputAmount,
    amount,
    supplier,
    feePercent,
    submit,
    btcAddress,
    pendingInitOutbound,
    error: outboundTx.error,
    isValid,
    validBtc,
    txFeeBtc,
    txFeePercent,
    supplierCapacity,
    hasCapacity,
    errorMessage,
    supplierBaseFee,
    supplierFeeRate: fee,
  };
}
