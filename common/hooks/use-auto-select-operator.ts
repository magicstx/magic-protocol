import { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { Operator, selectedOperatorState, useOperators } from '../store';
import sortBy from 'lodash-es/sortBy';
import { useAtomValue } from 'jotai/utils';

export function useAutoSelectOperator(amount: string) {
  const [operators] = useOperators();
  const [error, setError] = useState('');
  const selectedOperator = useAtomValue(selectedOperatorState);
  const [bestOperator, setBestOperator] = useState<Operator | undefined>();
  useEffect(() => {
    const btc = new BigNumber(amount).shiftedBy(8);
    if (btc.isNaN()) {
      setError('Invalid amount');
      return;
    }
    const withCapacity = operators.filter(op => {
      return btc.lte(op.funds || '0');
    });
    if (withCapacity.length === 0) {
      const highestCap = sortBy(operators, op => op.funds)[operators.length - 1];
      const cap = new BigNumber(highestCap.funds).shiftedBy(-8);
      setError(`No operator with enough capacity. Max capacity is ${cap.toFormat()} BTC.`);
      return;
    }
    const sortedFee = sortBy(withCapacity, op => op.inboundFee);
    setBestOperator(sortedFee[0]);
  }, [operators, amount]);

  return {
    error,
    operator: selectedOperator || bestOperator || operators[0],
  };
}
