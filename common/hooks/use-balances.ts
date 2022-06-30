import { useQueryAtom } from 'jotai-query-toolkit';
import { xbtcAssetId } from '../contracts';
import { balancesState } from '../store/api';

export const useBalances = () => {
  const [balances] = useQueryAtom(balancesState);
  if (!balances) throw new Error('Cannot get balances if logged out.');
  const xbtcId = xbtcAssetId();
  return {
    xbtc: balances.fungible_tokens[xbtcId]?.balance || '0',
    stx: balances.stx.balance,
  };
};
