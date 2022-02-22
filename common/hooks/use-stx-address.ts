import { useStxAddresses } from '@micro-stacks/react';
import { NETWORK_CONFIG } from '../constants';

export function useStxAddress() {
  const addresses = useStxAddresses();
  if (!addresses) return undefined;
  return NETWORK_CONFIG === 'mainnet' ? addresses.mainnet : addresses.testnet;
}
