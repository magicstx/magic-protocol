export {};
// import { accounts, contracts } from '../common/clarigen';
// import { StacksMocknet } from 'micro-stacks/network';
// import { NodeProvider, tx } from '@clarigen/node';
// import { PostConditionMode } from '@stacks/transactions';
// import { CSV_DELAY_BUFF, generateHTLCAddress, numberToLE, secretToHash } from '../common/htlc';
// import { publicKeys } from '../test/mocks';
// import { hexToBytes } from 'micro-stacks/common';
// import { hashSha256 } from 'micro-stacks/crypto-sha';

// const network = new StacksMocknet();
// const clarigenConfig = {
//   privateKey: '530d9f61984c888536871c6573073bdfc0058896dc1adfe9a6a10dfacadc209101',
//   network,
//   deployerAddress: accounts.deployer.address,
// };

// const deployed = NodeProvider.fromContracts(contracts, clarigenConfig);
// const bridge = deployed.bridge.contract;

// async function getBurnBlock() {
//   const url = network.getInfoUrl();
//   const res = await fetch(url);
//   const data = (await res.json()) as { burn_block_height: number };
//   return data.burn_block_height;
// }

// async function run() {
//   console.log(accounts.operator.address);
//   // const operatorId = await bridge.getOperatorIdByController(accounts.operator.address);
//   // if (!operatorId) throw 'Operator not registered';
//   const operatorId = 0n;
//   const operator = await bridge.getOperator(operatorId);
//   if (!operator) throw 'Panic';
//   const publicKey = operator['public-key'];
//   const swapperId = 1n;
//   const preImage = hexToBytes('aaaa');
//   const hash = hashSha256(preImage);
//   const senderPublicKey = publicKeys[1];
//   const payment = generateHTLCAddress({
//     senderPublicKey: senderPublicKey,
//     recipientPublicKey: publicKey,
//     swapper: swapperId,
//     hash,
//     // expiration: height + 1500,
//     // expiration: 2,
//   });
//   console.log(`Public Key`, publicKey.toString('hex'));
//   // console.log(`Expiration: ${height + 1500}`);
//   console.log(`Address: ${payment.address || ''}`);

//   const swapperHex = numberToLE(swapperId);
//   const contractOutput = await bridge.generateHtlcScriptHash(
//     senderPublicKey,
//     operator['public-key'],
//     CSV_DELAY_BUFF,
//     Buffer.from(hash),
//     Buffer.from(swapperHex, 'hex')
//   );

//   console.log('Contract output:', contractOutput.toString('hex'));
//   console.log('JS output:', payment.output?.toString('hex'));
//   console.log('Equal outputs:', payment.output?.toString('hex') === contractOutput.toString('hex'));
// }

// run()
//   .catch(console.error)
//   .finally(() => {
//     process.exit();
//   });
