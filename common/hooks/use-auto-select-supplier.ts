import { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { Supplier, selectedSupplierState, useSuppliers } from '../store';
import sortBy from 'lodash-es/sortBy';
import { useAtomValue } from 'jotai/utils';
import { suppliersWithCapacityState, SupplierWithCapacity } from '../store/api';
import { getSupplierSwapAmount, getSwapAmount, satsToBtc } from '../utils';
import { intToBigInt } from 'micro-stacks/common';

export function useAutoSelectSupplier(amount: string, outputToken: string) {
  const suppliers = useAtomValue(suppliersWithCapacityState);
  const [error, setError] = useState('');
  const selectedSupplier = useAtomValue(selectedSupplierState);
  const [bestSupplier, setBestSupplier] = useState<SupplierWithCapacity | undefined>();
  useEffect(() => {
    const isOutbound = outputToken === 'btc';
    const btc = new BigNumber(amount).shiftedBy(8);
    if (btc.isNaN()) {
      setError('Invalid amount');
      return;
    }
    const withCapacity = suppliers.filter(op => {
      if (isOutbound) {
        return btc.lte(op.btc);
      }
      return btc.lte(op.funds || '0');
    });
    if (withCapacity.length === 0) {
      const funds = suppliers.map(s => intToBigInt(isOutbound ? s.btc : s.funds));
      const highestCap = sortBy(funds, f => -f);
      const cap = satsToBtc(highestCap[0]);
      setError(`No supplier with enough capacity. Max capacity is ${cap} BTC.`);
      return;
    }
    const sortedFee = sortBy(withCapacity, op => {
      const output = getSupplierSwapAmount(amount, op, isOutbound);
      return -output;
    });
    setBestSupplier(sortedFee[0]);
  }, [suppliers, amount, outputToken]);

  return {
    error,
    supplier: selectedSupplier || bestSupplier || suppliers[0],
  };
}
