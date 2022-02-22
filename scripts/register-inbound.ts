export {};
// import ElectrumClient from 'electrum-client-sl';
// import { NodeProvider, NodeTransaction } from '@clarigen/node';
// import { WebTransactionReceipt } from '@clarigen/core';
// import { accounts, contracts } from '../common/clarigen';
// import { reverseBuffer } from '../common/htlc';
// import { StacksMocknet } from '@stacks/network';
// import { getAddressFromPrivateKey, TransactionVersion } from '@stacks/transactions';
// import fetch from 'cross-fetch';
// import { Configuration, BlocksApi } from '@stacks/blockchain-api-client';
// import { tx as clarigenTx } from '@clarigen/node';
// import { publicKeys } from '../test/mocks';
// import { hexToBytes } from 'micro-stacks/common';
// import { hashSha256 } from 'micro-stacks/crypto-sha';
// import { numberToLE } from '../common/htlc';
// import { script as bScript } from 'bitcoinjs-lib';

// const electrumConfig = {
//   host: 'localhost',
//   port: 50001,
//   protocol: 'tcp',
// };

// const client = new ElectrumClient(
//   electrumConfig.host,
//   electrumConfig.port,
//   electrumConfig.protocol
// );

// const apiConfig = new Configuration({
//   fetchApi: fetch,
//   basePath: 'http://localhost:3999',
// });

// const blocksApi = new BlocksApi(apiConfig);

// const privateKey = '530d9f61984c888536871c6573073bdfc0058896dc1adfe9a6a10dfacadc209101';

// const clarigenConfig = {
//   privateKey,
//   network: new StacksMocknet(),
//   deployerAddress: accounts.deployer.address,
// };

// const deployed = NodeProvider.fromContracts(contracts, clarigenConfig);

// const bridge = deployed.bridge.contract;

// type MintParams = Parameters<typeof bridge.escrowSwap>;
// type BlockParam = MintParams[0];
// type ProofParam = MintParams[2];

// async function getStacksBlock(
//   hash: string,
//   offset = 0
// ): Promise<{ stacksHeight: bigint; burnHeight: number }> {
//   const blocksResponse = await blocksApi.getBlockList({ limit: 30, offset });
//   if (offset >= blocksResponse.total) throw new Error('No block found.');
//   for (const block of blocksResponse.results) {
//     if (block.burn_block_hash === `0x${hash}`) {
//       return {
//         stacksHeight: BigInt(block.height),
//         burnHeight: block.burn_block_height,
//       };
//     }
//   }
//   return getStacksBlock(hash, offset + 30);
// }

// async function run() {
//   const [txid] = process.argv.slice(2);

//   await client.connect();
//   const tx = await client.blockchain_transaction_get(txid, true);

//   const blockHash = tx.blockhash;

//   const { burnHeight, stacksHeight } = await getStacksBlock(blockHash);
//   const header = await client.blockchain_block_header(burnHeight);

//   const merkle = await client.blockchain_transaction_getMerkle(txid, burnHeight);
//   const hashes = merkle.merkle.map(hash => {
//     return reverseBuffer(Buffer.from(hash, 'hex'));
//   });

//   const blockArg: BlockParam = {
//     header: Buffer.from(header, 'hex'),
//     height: stacksHeight,
//   };

//   const txHex = Buffer.from(tx.hex, 'hex');

//   const proofArg: ProofParam = {
//     hashes,
//     'tx-index': BigInt(merkle.pos),
//     'tree-depth': BigInt(hashes.length),
//   };

//   const voutIndex = 0;

//   const senderPk = publicKeys[0];
//   const receipientPk = publicKeys[1];

//   const expiration = bScript.number.encode(2240);

//   const preImage = hexToBytes('aaaa');
//   const hash = hashSha256(preImage);

//   const swapperHex = numberToLE(0n);

//   const result = await clarigenTx(
//     bridge.escrowSwap(
//       blockArg,
//       txHex,
//       proofArg,
//       voutIndex,
//       senderPk,
//       receipientPk,
//       expiration,
//       Buffer.from(hash),
//       Buffer.from(swapperHex, 'hex'),
//       1n
//     )
//   );
//   console.log(`http://localhost:3999/extended/v1/tx/0x${result.txId}?unanchored=true`);
// }

// run()
//   .catch(console.error)
//   .then(async () => {
//     await client.close();
//   })
//   .finally(() => {
//     process.exit();
//   });
