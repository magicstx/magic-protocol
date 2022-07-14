import { projectFactory } from '@clarigen/core';
import { project } from '../common/clarigen/next';

test('mainnet is properly configured', () => {
  const contracts = projectFactory(project, 'mainnet');
  expect(contracts.bridge.identifier).toEqual('SP3NHG9CBN9SPH68HD8HGPS7F7499KCAEC9K20NZZ.bridge');
});
