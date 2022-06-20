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
import { hexToBytes } from 'micro-stacks/common';

const [pubKey, amt, inboundFee, outboundFee, inboundBase, outboundBase] = process.argv.slice(2);

async function run() {
  console.log('CONTRACT_ADDRESS', CONTRACT_ADDRESS);
  console.log('OPERATOR_KEY', OPERATOR_KEY);
  const { bridge, nonce, network, provider } = await setupScript(OPERATOR_KEY);
  console.log('nonce', nonce);

  const amount = 1_000_000_000n; // 10 xbtc
  const pubHex = pubKey || process.env.BTC_PUBLIC!;
  const OPERATOR_PUBLIC = hexToBytes(pubHex);
  console.log('OPERATOR_PUBLIC', pubHex);

  const registerTx = bridge.registerSupplier(
    OPERATOR_PUBLIC,
    BigInt(inboundFee || 50n),
    BigInt(outboundFee || 30n),
    BigInt(inboundBase || 1000n),
    BigInt(outboundBase || 1000n),
    BigInt(amt || amount)
  );

  console.log('Args:', registerTx.nativeArgs.slice(1));
  // console.log(registerTx);

  const registerReceipt = await provider.tx(registerTx, {
    postConditionMode: PostConditionMode.Allow,
  });
  logTxid(registerReceipt);

  // const swapperInfo = await setupScript(SWAPPER_KEY);
  // const registerSwapper = await tx(swapperInfo.bridge.registerSwapper());
  // logTxid(registerSwapper);
}

run()
  .catch(console.error)
  .finally(() => {
    process.exit();
  });
