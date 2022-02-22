/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { config } from 'dotenv';
import 'cross-fetch/polyfill';
config({
  path: '.env.local',
});
import { tx } from '@clarigen/node';
import { logTxid, OPERATOR_KEY, setupScript, SWAPPER_KEY } from './helpers';
import { PostConditionMode } from 'micro-stacks/transactions';
import { CONTRACT_ADDRESS } from '../common/constants';
import { accounts } from '../common/clarigen';

async function run() {
  const [recipient] = process.argv.slice(2);
  const { bridge, nonce, network, provider, contracts } = await setupScript(
    process.env.DEPLOYER_KEY!
  );

  const tx = await provider.tx(
    contracts.xbtc.contract.transfer(10000000n, accounts.deployer.address, recipient, null),
    { postConditionMode: PostConditionMode.Allow }
  );

  logTxid(tx);
}

run()
  .catch(console.error)
  .finally(() => {
    process.exit();
  });
