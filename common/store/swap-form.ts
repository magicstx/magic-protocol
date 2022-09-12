import BigNumber from 'bignumber.js';
import { atom } from 'jotai';
import { atomFamily, selectAtom } from 'jotai/utils';
import sortBy from 'lodash-es/sortBy';
import type { Supplier } from '.';
import { btcAddressState } from '.';
import type { Token } from '../../components/swap-container/swap-input';
import {
  btcToSatsBN,
  getSwapAmount,
  satsToBtc,
  bpsToPercent,
  intToBigInt,
  parseBtcAddress,
} from '../utils';
import { balancesState, SupplierWithCapacity } from './api';
import { suppliersWithCapacityState } from './api';

export const outboundTxidState = atom<string | undefined>(undefined);

export function oppositeToken(token: Token): Token {
  return token === 'btc' ? 'xbtc' : 'btc';
}

export const inputTokenState = atom<Token>('btc');

export const outputTokenState = atom(get => {
  return oppositeToken(get(inputTokenState));
});

export const amountState = atom('');

export const amountSatsBNState = selectAtom(
  amountState,
  amount => {
    return btcToSatsBN(amount);
  },
  (a, b) => a.isEqualTo(b)
);

export const amountInvalidState = selectAtom(
  amountSatsBNState,
  a => a.isNaN() || a.isLessThanOrEqualTo(0)
);

export const showOverrideSupplierState = atom(false);

export const pendingRegisterSwapperState = atom(false);

export const isOutboundState = selectAtom(inputTokenState, t => t === 'xbtc');

// Suppliers

export function feesForSwapDirection(supplier: Supplier, isOutbound: boolean) {
  const baseFee = isOutbound ? supplier.outboundBaseFee : supplier.inboundBaseFee;
  const feeRate = isOutbound ? supplier.outboundFee : supplier.inboundFee;
  return {
    baseFee,
    feeRate,
  };
}

export function makeSupplierForDirection(
  supplier: SupplierWithCapacity,
  isOutbound: boolean
): SupplierForDirection {
  const { baseFee, feeRate } = feesForSwapDirection(supplier, isOutbound);
  const capacity = isOutbound ? supplier.btc : supplier.funds;
  return {
    baseFee,
    feeRate,
    capacity: BigInt(capacity),
    id: supplier.id,
    controller: supplier.controller,
  };
}

export interface SupplierForDirection {
  capacity: bigint;
  baseFee: number;
  feeRate: number;
  controller: string;
  id: number;
}

export const selectedSupplierState = atom<SupplierWithCapacity | null>(null);

export const selectedSupplierForDirectionState = atom(get => {
  const selected = get(selectedSupplierState);
  const isOutbound = get(isOutboundState);
  return selected ? makeSupplierForDirection(selected, isOutbound) : null;
});

export const currentSupplierState = atom<SupplierForDirection>(get => {
  const selected = get(selectedSupplierForDirectionState);
  const bestSupplier = get(bestSupplierForAmount);
  return selected || bestSupplier;
});

export const suppliersForDirectionState = atom<SupplierForDirection[]>(get => {
  const suppliers = get(suppliersWithCapacityState);
  const isOutbound = get(isOutboundState);
  const mapped = suppliers.map(supplier => makeSupplierForDirection(supplier, isOutbound));
  const sorted = sortBy(mapped, supplier => {
    return -supplier.feeRate;
  });
  return sorted;
});

export const maxCapacityState = selectAtom(suppliersForDirectionState, suppliers => {
  const sorted = sortBy(suppliers, s => -s.capacity);
  return sorted[0].capacity;
});

export const bestSupplierForAmount = atom<SupplierForDirection>(get => {
  const suppliers = get(suppliersForDirectionState);
  const [defaultSupplier] = suppliers;
  const amount = btcToSatsBN(get(amountState));

  if (amount.isNaN()) {
    return defaultSupplier;
  }
  const withCapacity = suppliers.filter(op => {
    return amount.lte(op.capacity.toString());
  });
  if (withCapacity.length === 0) {
    return defaultSupplier;
  }
  const sortedFee = sortBy(withCapacity, op => {
    const output = getSwapAmount(amount.toString(), op.feeRate, op.baseFee);
    return -output;
  });
  return sortedFee[0];
});

// Fees

export const feeRateState = selectAtom(currentSupplierState, s => s.feeRate);
export const feePercentState = selectAtom(feeRateState, f => bpsToPercent(f));
export const baseFeeState = selectAtom(currentSupplierState, s => s.baseFee);

export const txFeeSatsState = atom(get => {
  const output = get(outputAmountSatsState);
  const amount = get(amountSatsBNState);
  return intToBigInt(amount.minus(output.toString()));
});
export const txFeeBtcState = selectAtom(txFeeSatsState, s => satsToBtc(s));
export const txFeePercentState = atom(get => {
  const feeSats = get(txFeeSatsState);
  const amount = get(amountSatsBNState);
  const percent = new BigNumber(feeSats.toString()).dividedBy(amount).multipliedBy(100);
  return percent.decimalPlaces(3).toString();
});

// Swap fee, only including fee rate
export const feeFromRateState = atom(get => {
  const amountBN = get(amountSatsBNState);
  const feeRate = get(feeRateState);
  const sats = getSwapAmount(amountBN.toString(), feeRate, null);
  const diff = amountBN.minus(sats.toString());
  return satsToBtc(diff);
});

// Output amount

export const outputAmountSatsState = atom(get => {
  const supplier = get(currentSupplierState);
  const amountBN = get(amountSatsBNState);
  return getSwapAmount(amountBN.toString(), supplier.feeRate, supplier.baseFee);
});

export const outputAmountBtcState = selectAtom(outputAmountSatsState, a => {
  return a <= 0n ? '' : satsToBtc(a);
});

// Validation

export const capacityErrorState = atom<string | undefined>(get => {
  const supplier = get(currentSupplierState);
  const outputAmount = get(outputAmountSatsState);
  const outputToken = get(outputTokenState);
  const maxCapacity = get(maxCapacityState);
  const selected = get(selectedSupplierForDirectionState);
  if (outputAmount > supplier.capacity) {
    const cap = satsToBtc(selected ? selected.capacity : maxCapacity);
    return `Supplier has insufficient capacity. Max capacity is ${cap} ${outputToken}.`;
  }
  return undefined;
});

export const hasCapacityState = selectAtom(capacityErrorState, e => typeof e === 'undefined');

export const btcAddressValidState = selectAtom(btcAddressState, address => {
  try {
    parseBtcAddress(address);
    return true;
  } catch (error) {
    return false;
  }
});

export const swapFormErrorState = atom(get => {
  const isOutbound = get(isOutboundState);
  const btcAddress = get(btcAddressState);
  const btcValid = get(btcAddressValidState);
  const capacityError = get(capacityErrorState);
  const amountBN = get(amountSatsBNState);
  const outputAmount = get(outputAmountSatsState);

  if (isOutbound && btcAddress && !btcValid) return 'Invalid BTC Address';
  if (typeof capacityError === 'string') return capacityError;
  if (amountBN.gt(0) && outputAmount <= 0) return 'Swap amount too low.';
  if (isOutbound) {
    const balance = get(balancesState);
    if (amountBN.gt(balance.xbtc)) return 'Insufficient xBTC balance';
  }
  return undefined;
});

export const swapFormValidState = atom(get => {
  const error = get(swapFormErrorState);
  const isOutbound = get(isOutboundState);
  const btcValid = get(btcAddressValidState);
  const amountInvalid = get(amountInvalidState);

  if (typeof error === 'string') return false;
  if (amountInvalid) return false;
  if (isOutbound && !btcValid) return false;
  return true;
});
