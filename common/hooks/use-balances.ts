import { useAtomValue } from 'jotai/utils';
import { xbtcAssetId } from '../contracts';
import { balancesState } from '../store/api';

export const useBalances = () => {
  const balances = useAtomValue(balancesState);
  return balances;
};
