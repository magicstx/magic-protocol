import 'cross-fetch/polyfill';
// import { network } from '../common/constants';
// import { StacksTestnet, StacksMainnet } from 'micro-stacks/network';
import { OPERATOR_KEY, setupScript } from './helpers';
import { bytesToHex } from 'micro-stacks/common';

async function run() {
  const { provider, bridge, contracts } = setupScript(OPERATOR_KEY);

  const lastOutbound = await provider.ro(bridge.getNextOutboundId());

  for (let i = 0n; i < lastOutbound; i++) {
    const finalized = await provider.ro(bridge.getCompletedOutboundSwapTxid(i));
    console.log('\n\n------');
    console.log('Swap ID:', i);
    if (finalized) {
      console.log('Finalized', bytesToHex(finalized));
    } else {
      console.log('Not finalized');
    }
  }
}

run()
  .catch(console.error)
  .finally(() => {
    process.exit();
  });
