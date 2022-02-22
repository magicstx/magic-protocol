export {};
// /* eslint-disable @typescript-eslint/no-non-null-assertion */
// import ElectrumClient from 'electrum-client-sl';
// import { privateKeys, publicKeys } from '../test/mocks';
// import { Psbt, networks, script as bScript, ECPair, payments, opcodes } from 'bitcoinjs-lib';
// import { StacksMocknet } from 'micro-stacks/network';
// import { accounts, contracts } from '../common/clarigen';
// import { NodeProvider } from '@clarigen/node';
// import { hexToBytes } from 'micro-stacks/common';
// import { hashSha256 } from 'micro-stacks/crypto-sha';
// import { generateHTLCAddress, numberToLE } from '../common/htlc';
// import { electrumClient } from '../common/api/electrum';

// const clarigenConfig = {
//   privateKey: privateKeys[0],
//   network: new StacksMocknet(),
//   deployerAddress: accounts.deployer.address,
// };

// const deployed = NodeProvider.fromContracts(contracts, clarigenConfig);
// const bridge = deployed.bridge.contract;

// async function getBurnBlock() {
//   const url = 'http://localhost:20443/v2/info';
//   const res = await fetch(url);
//   const data = (await res.json()) as { burn_block_height: number };
//   return data.burn_block_height;
// }

// async function run() {
//   const [txid] = process.argv.slice(2);

//   await electrumClient.connect();

//   const tx = await electrumClient.blockchain_transaction_get(txid, true);
//   // console.log(tx.vout[0].scriptPubKey.hex);
//   const txHex = Buffer.from(tx.hex, 'hex');

//   // const swap = (await bridge.getInboundSwap(Buffer.from(txid, 'hex')))!;
//   // const expiration = bScript.number.encode(Number(swap.expiration + 200n));
//   const preImage = hexToBytes('aaaa');
//   const hash = hashSha256(preImage);
//   // const swapperLe = numberToLE(swap.swapper);
//   const operator = (await bridge.getOperator(1))!;
//   // console.log(swap);
//   const htlcPayment = generateHTLCAddress({
//     senderPublicKey: publicKeys[0],
//     recipientPublicKey: operator['public-key'],
//     // expiration: Number(swap.expiration + 200n),
//     expiration: 2,
//     // hash: swap.hash,
//     hash: Buffer.from(hash),
//     // swapper: swap.swapper,
//     swapper: 202,
//   });
//   // console.log(htlcPayment.redeem?.output?.toString('hex'));
//   // const htlcScript = await bridge.generateHtlcScript(
//   //   publicKeys[0],
//   //   operator['public-key'],
//   //   expiration,
//   //   // expiration: 2,
//   //   swap.hash,
//   //   Buffer.from(swapperLe, 'hex')
//   // );

//   const psbt = new Psbt({ network: networks.regtest });
//   const signer = ECPair.fromPrivateKey(Buffer.from(privateKeys[1], 'hex'));
//   const sequence = bScript.number.encode(0);

//   // console.log(
//   //   bScript.decompile(
//   //     Buffer.from(
//   //       '4830450221008c9ed1848a7a915d9e6cc5c85be974adb2880cbd63e390ab84cdd83f2a6cca0202206c392d6d5a9f9b0a40e40e9736cc3da95603654812d9f831a1e93989a6336feb0102aaaa004c7554040000000075a8204f377ce906c6f4713d968ff2d8b7b9b5ffd0833751c8030e8f6368fd322a4de987632102f8bb63e1e52f6dd145628849ec593d74dfe04b131604d1e5f5f134677fb31e726752b2752103edf5ed04204ac5ab55832bb893958123f123e45fa417cfe950e4ece67359ee5868ac',
//   //       'hex'
//   //     )
//   //   )
//   // );
//   const burnHeight = await getBurnBlock();
//   // psbt.setLocktime(burnHeight);
//   // psbt.setVersion(2);
//   psbt.addInput({
//     hash: txid,
//     index: 0,
//     // sequence: 0,
//     // sequence: 0xfffffffe,
//     // sequence: burnHeight,
//     nonWitnessUtxo: txHex,
//     redeemScript: htlcPayment.redeem?.output,
//   });
//   psbt.addOutput({
//     address: 'n3k15aVS4rEWhVYn4YfAFjD8Em5mmsducg',
//     value: 5500,
//   });
//   psbt.signInput(0, signer);

//   psbt.finalizeInput(0, (index, input, script) => {
//     // console.log('input', input);
//     const inputScript = bScript.compile([
//       input.partialSig![0].signature,
//       Buffer.from(preImage),
//       opcodes.OP_TRUE,
//     ]);
//     // console.log('script', script.toString('hex'));
//     // console.log('finalize script', script.toString('hex'));
//     const payment = payments.p2sh({
//       redeem: {
//         output: script,
//         input: inputScript,
//       },
//     });
//     const decompiled = bScript.decompile(payment.input!);
//     // console.log(decompiled);
//     // console.log(bScript.toASM(script));
//     // console.log(bScript.toASM(payment.input!));
//     // console.log(payment.input?.toString('hex'));
//     // console.log(payme);
//     // console.log(payment.input?.toString('hex'));
//     return {
//       finalScriptSig: payment.input,
//       finalScriptWitness: undefined,
//     };
//   });

//   // psbt.validateSignaturesOfInput(0);
//   const final = psbt.extractTransaction();
//   // console.log(final.getId());
//   const finalId = await electrumClient.blockchain_transaction_broadcast(final.toHex());
//   console.log(finalId);
// }

// run()
//   .catch(console.error)
//   .finally(() => {
//     process.exit();
//   });
