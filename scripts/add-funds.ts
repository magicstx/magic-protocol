export {};
// import { accounts, contracts } from '../common/clarigen';
// import { StacksMocknet } from 'micro-stacks/network';
// import { NodeProvider, tx } from '@clarigen/node';
// import { getNonce } from './helpers';
// import { PostConditionMode } from '@stacks/transactions';

// const network = new StacksMocknet();
// const clarigenConfig = {
//   privateKey: '7287ba251d44a4d3fd9276c88ce34c5c52a038955511cccaf77e61068649c17801',
//   network,
//   deployerAddress: accounts.deployer.address,
// };

// const deployed = NodeProvider.fromContracts(contracts, clarigenConfig);
// const bridge = deployed.bridge.contract;

// async function run() {
//   const nonce = await getNonce(accounts.operator.address);

//   const result = await tx(bridge.addFunds(100_000_000n), {
//     nonce,
//     postConditionMode: PostConditionMode.Allow,
//   });
//   console.log(`http://localhost:3999/extended/v1/tx/0x${result.txId}?unanchored=true`);
// }

// run()
//   .catch(console.error)
//   .finally(() => {
//     process.exit();
//   });
