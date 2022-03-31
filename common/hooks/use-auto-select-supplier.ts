import { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { Supplier, selectedSupplierState, useSuppliers } from '../store';
import sortBy from 'lodash-es/sortBy';
import { useAtomValue } from 'jotai/utils';

export function useAutoSelectSupplier(amount: string) {
  const [suppliers] = useSuppliers();
  const [error, setError] = useState('');
  const selectedSupplier = useAtomValue(selectedSupplierState);
  const [bestSupplier, setBestSupplier] = useState<Supplier | undefined>();
  useEffect(() => {
    const btc = new BigNumber(amount).shiftedBy(8);
    if (btc.isNaN()) {
      setError('Invalid amount');
      return;
    }
    const withCapacity = suppliers.filter(op => {
      return btc.lte(op.funds || '0');
    });
    if (withCapacity.length === 0) {
      const highestCap = sortBy(suppliers, op => op.funds)[suppliers.length - 1];
      const cap = new BigNumber(highestCap.funds).shiftedBy(-8);
      setError(`No supplier with enough capacity. Max capacity is ${cap.toFormat()} BTC.`);
      return;
    }
    const sortedFee = sortBy(withCapacity, op => op.inboundFee);
    setBestSupplier(sortedFee[0]);
  }, [suppliers, amount]);

  return {
    error,
    supplier: selectedSupplier || bestSupplier || suppliers[0],
  };
}
