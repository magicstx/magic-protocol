export {};
// import { accounts, contracts } from '../common/clarigen';
// import { StacksMocknet } from 'micro-stacks/network';
// import { NodeProvider, tx } from '@clarigen/node';
// import { getNonce } from './helpers';
// import { PostConditionMode } from '@stacks/transactions';
// import { hexToBytes } from 'micro-stacks/common';

// const network = new StacksMocknet();
// const clarigenConfig = {
//   privateKey: '530d9f61984c888536871c6573073bdfc0058896dc1adfe9a6a10dfacadc209101',
//   network,
//   deployerAddress: accounts.deployer.address,
// };

// const deployed = NodeProvider.fromContracts(contracts, clarigenConfig);
// const bridge = deployed.bridge.contract;

// async function run() {
//   const [txid] = process.argv.slice(2);
//   const preImage = hexToBytes('aaaa');
//   const result = await tx(bridge.finalizeSwap(Buffer.from(txid, 'hex'), Buffer.from(preImage)), {
//     postConditionMode: PostConditionMode.Allow,
//   });
//   console.log(`http://localhost:3999/extended/v1/tx/0x${result.txId}?unanchored=true`);
// }

// run()
//   .catch(console.error)
//   .finally(() => {
//     process.exit();
//   });
