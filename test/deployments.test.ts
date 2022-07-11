import { NETWORK_CONFIG } from '../common/constants';
import { getContracts, mainnetContracts, WRAPPED_BTC_MAINNET } from '../common/contracts';

test('mainnet is properly configured', () => {
  const contracts = mainnetContracts();
  expect(contracts.wrappedBitcoin.identifier).toEqual(WRAPPED_BTC_MAINNET);
  expect(contracts.bridge.identifier).toEqual('SP3NHG9CBN9SPH68HD8HGPS7F7499KCAEC9K20NZZ.bridge');
});
