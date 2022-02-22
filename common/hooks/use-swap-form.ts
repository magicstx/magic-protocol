import { useCallback, useEffect, useMemo } from 'react';
import { useInput } from './use-input';
import { Token } from '../../components/swap-input';
import { atom, useAtom } from 'jotai';
import { useAtomCallback, useAtomValue } from 'jotai/utils';
import { btcAddressState, useSwapperId } from '../store';
import BigNumber from 'bignumber.js';
import { bpsToPercent, btcToSats, getSwapAmount, parseBtcAddress, satsToBtc } from '../utils';
import { useGenerateInboundSwap } from './use-generate-inbound-swap';
import { useRouter } from 'next/router';
import { pendingInitOutboundState, useInitiateOutbound } from './tx/use-initiate-outbound';
import nProgress from 'nprogress';
import { useGenerateOutboundSwap } from './use-generate-outbound-swap';
import { useAutoSelectOperator } from './use-auto-select-operator';

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
  const swapperId = useSwapperId();
  const btcAddress = useInput(useAtom(btcAddressState));
  const [pendingInitOutbound, setPendingOutbound] = useAtom(pendingInitOutboundState);
  const { generate: generateOutbound } = useGenerateOutboundSwap();
  const { generate } = useGenerateInboundSwap();
  const { operator } = useAutoSelectOperator(amount.value);
  const fee = useMemo(() => {
    return inputToken === 'btc' ? operator.inboundFee : operator.outboundFee;
  }, [inputToken, operator]);

  const feePercent = useMemo(() => {
    return bpsToPercent(fee);
  }, [fee]);

  const outputAmount = useMemo(() => {
    const amountBN = new BigNumber(amount.value).shiftedBy(8).decimalPlaces(0);
    if (amountBN.isNaN()) return '0';
    const output = getSwapAmount(amountBN.toString(), fee);
    return satsToBtc(output);
  }, [amount.value, fee]);

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

  const isValid = useMemo(() => {
    if (outputToken === 'btc' && !validBtc) return false;
    if (new BigNumber(amount.value).isNaN()) return false;
    return true;
  }, [amount.value, validBtc, outputToken]);

  const submitInbound = useAtomCallback(
    useCallback(
      async (get, set) => {
        if (typeof swapperId === 'number') {
          if (!isValid) return;
          const swap = await generate({
            operator,
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
      [generate, operator, router, amount.value, swapperId, isValid]
    )
  );

  const outboundTx = useInitiateOutbound({
    address: btcAddress.value,
    operatorId: operator.id,
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
    operator,
    feePercent,
    submit,
    btcAddress,
    pendingInitOutbound,
    error: outboundTx.error,
    isValid,
    validBtc,
  };
}
