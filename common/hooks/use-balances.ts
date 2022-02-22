import { useQueryAtom } from 'jotai-query-toolkit';
import { CONTRACT_ADDRESS } from '../constants';
import { balancesState } from '../store/api';

export const useBalances = () => {
  const [balances] = useQueryAtom(balancesState);
  if (!balances) throw new Error('Cannot get balances if logged out.');
  const xbtcId = `${CONTRACT_ADDRESS}.xbtc::xbtc`;
  return {
    xbtc: balances.fungible_tokens[xbtcId]?.balance || '0',
    stx: balances.stx.balance,
  };
};
