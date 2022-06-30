import { useCallback, useEffect, useMemo } from 'react';
import { useInput } from './use-input';
import { Token } from '../../components/swap-input';
import { atom, useAtom } from 'jotai';
import { useAtomCallback, useAtomValue } from 'jotai/utils';
import { btcAddressState, swapperIdState, useSwapperId } from '../store';
import BigNumber from 'bignumber.js';
import { bpsToPercent, btcToSats, getSwapAmount, parseBtcAddress, satsToBtc } from '../utils';
import { useGenerateInboundSwap } from './use-generate-inbound-swap';
import { useRouter } from 'next/router';
import { pendingInitOutboundState, useInitiateOutbound } from './tx/use-initiate-outbound';
import nProgress from 'nprogress';
import { useGenerateOutboundSwap } from './use-generate-outbound-swap';
import { useAutoSelectSupplier } from './use-auto-select-supplier';

export function oppositeToken(token: Token): Token {
  return token === 'btc' ? 'xbtc' : 'btc';
}

const inputTokenState = atom<Token>('btc');

export const amountState = atom('');

export const showOverrideSupplierState = atom(false);

export const pendingRegisterSwapperState = atom(false);

export function useSwapForm() {
  const inputToken = useAtomValue(inputTokenState);
  const amount = useInput(useAtom(amountState));
  const outputToken = oppositeToken(inputToken);
  const router = useRouter();
  const btcAddress = useInput(useAtom(btcAddressState));
  const [pendingInitOutbound, setPendingOutbound] = useAtom(pendingInitOutboundState);
  const { generate: generateOutbound } = useGenerateOutboundSwap();
  const { generate } = useGenerateInboundSwap();
  const { supplier } = useAutoSelectSupplier(amount.value, outputToken);
  const fee = useMemo(() => {
    return inputToken === 'btc' ? supplier.inboundFee : supplier.outboundFee;
  }, [inputToken, supplier]);

  const supplierBaseFee = inputToken === 'btc' ? supplier.inboundBaseFee : supplier.outboundBaseFee;

  const feePercent = useMemo(() => {
    return bpsToPercent(fee);
  }, [fee]);

  const { outputAmount, txFeeBtc, txFeePercent } = useMemo(() => {
    const amountBN = new BigNumber(amount.value).shiftedBy(8).decimalPlaces(0);
    if (amountBN.isNaN()) {
      return {
        outputAmount: '0',
        txFeeBtc: '0',
        txFeePercent: '0',
      };
    }
    const output = getSwapAmount(amountBN.toString(), fee, supplierBaseFee);
    if (output <= 0n) {
      return {
        outputAmount: '0',
        txFeeBtc: '0',
        txFeePercent: '0',
      };
    }
    const txFeeSats = amountBN.minus(output.toString());
    const txFeeBtc = satsToBtc(txFeeSats.toString());
    const txFeePercent = txFeeSats.decimalPlaces(6).dividedBy(amountBN).multipliedBy(100);
    return {
      outputAmount: satsToBtc(output),
      txFeeBtc,
      txFeePercent: txFeePercent.decimalPlaces(3).toFormat(),
    };
  }, [amount.value, fee, supplierBaseFee]);

  const supplierCapacity = useMemo(() => {
    return BigInt(outputToken === 'btc' ? supplier.btc : supplier.funds).toString();
  }, [outputToken, supplier.btc, supplier.funds]);

  const switchDirection = useAtomCallback(
    useCallback(
      (get, set) => {
        // set(amountState, '');
        set(inputTokenState, outputToken);
      },
      [outputToken]
    )
  );

  const validBtc = useMemo(() => {
    try {
      parseBtcAddress(btcAddress.value);
      return true;
    } catch (error) {
      return false;
    }
  }, [btcAddress.value]);

  const hasCapacity = useMemo(() => {
    return new BigNumber(btcToSats(outputAmount)).lt(supplierCapacity);
  }, [supplierCapacity, outputAmount]);

  const errorMessage = useMemo(() => {
    if (outputToken === 'btc' && !validBtc && btcAddress.value) return 'Invalid BTC address.';
    if (!hasCapacity)
      return `Insufficient supplier funds. Max swap size is ${satsToBtc(supplierCapacity)}.`;
    if (new BigNumber(amount.value).gt(0) && new BigNumber(outputAmount).lte(0))
      return `Swap amount too low.`;
    return undefined;
  }, [
    outputToken,
    supplierCapacity,
    hasCapacity,
    validBtc,
    amount.value,
    outputAmount,
    btcAddress.value,
  ]);

  const isValid = useMemo(() => {
    if (typeof errorMessage !== 'undefined') return false;
    if (new BigNumber(amount.value).isNaN()) return false;
    return true;
  }, [amount.value, errorMessage]);

  const submitInbound = useAtomCallback(
    useCallback(
      async (get, set) => {
        const { id: swapperId } = get(swapperIdState);
        if (typeof swapperId === 'number') {
          if (!isValid) return;
          const swap = await generate({
            supplier: supplier,
            inputAmount: btcToSats(amount.value),
          });
          void router.push({
            pathname: '/inbound/[swapId]',
            query: { swapId: swap.id },
          });
        } else {
          set(pendingRegisterSwapperState, true);
        }
      },
      [generate, supplier, router, amount.value, isValid]
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
        if (outputToken === 'xbtc') {
          await submitInbound();
        } else {
          if (!isValid) return;
          setPendingOutbound(true);
          void outboundTx.submit();
        }
        nProgress.done();
      },
      [outputToken, submitInbound, outboundTx, setPendingOutbound, isValid]
    )
  );

  const routeToOutbound = useCallback(
    async (txId: string) => {
      await generateOutbound({ txId, amount: btcToSats(amount.value) });
      await router.push({
        pathname: '/outbound/[txId]',
        query: { txId },
      });
    },
    [generateOutbound, router, amount.value]
  );

  useEffect(() => {
    if (outboundTx.txId) {
      void routeToOutbound(outboundTx.txId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outboundTx.txId]);

  return {
    inputToken,
    switchDirection,
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
