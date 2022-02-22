export {};
// import { accounts, contracts } from '../common/clarigen';
// import { StacksMocknet } from 'micro-stacks/network';
// import { NodeProvider, tx } from '@clarigen/node';
// import { hexPadded, secretToHash } from '../common/htlc';
// import { getNonce } from './helpers';
// import { PostConditionMode } from '@stacks/transactions';
// import { bytesToHex, hexToBytes, utf8ToBytes } from 'micro-stacks/common';

// const network = new StacksMocknet();
// const clarigenConfig = {
//   privateKey: '530d9f61984c888536871c6573073bdfc0058896dc1adfe9a6a10dfacadc209101',
//   network,
//   deployerAddress: accounts.deployer.address,
// };

// const deployed = NodeProvider.fromContracts(contracts, clarigenConfig);
// const bridge = deployed.bridge.contract;

// async function run() {
//   const [txid, secret] = process.argv.slice(2);
//   console.log('secret', secret);
//   console.log('padded', hexPadded(secret));
//   const userHash = secretToHash(secret);
//   console.log('hash', bytesToHex(userHash));
//   const bytes = utf8ToBytes(secret);
//   console.log(bytesToHex(bytes));

//   const swap = await bridge.getInboundSwap(Buffer.from(txid, 'hex'));
//   if (!swap) throw new Error('Swap not found');
//   console.log('swap hash', swap.hash.toString('hex'));
//   console.log('swap', swap);
// }

// run()
//   .catch(console.error)
//   .finally(() => {
//     process.exit();
//   });
