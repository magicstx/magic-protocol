import { AllContracts, ContractFactory } from '@clarigen/core';
import { TestProvider } from '@clarigen/test';
import { hexToBytes } from 'micro-stacks/common';
import { hashSha256 } from 'micro-stacks/crypto-sha';
import { simnet } from '../common/clarigen/next';
import { factory, accounts } from './helpers';

const contract = factory.clarityBitcoin;
const testUtils = factory.testUtils;
let t: TestProvider;
const alice = accounts.wallet_3.address;

beforeAll(async () => {
  t = await TestProvider.fromProject(simnet);
});

// btc 728908
const firstBlock = hexToBytes(
  '046000205b8fe9509c8d5059419ecb0c7d8899ac5a33f4cc075b03000000000000000000d8ec11bb52893d95e8f240c0c44c2e837d239b930ed246f78b140be4841f459df46e3d62c0400a17a9ad0873'
);
// btc 728909
const secondBlock = hexToBytes(
  '00e0ff2792c4a807bd98f47aced50263c2158c2677cfe70fea970000000000000000000031f4a57d62e85d23c811762b4c5b75c5764931dddae07f9a605d32b799d021d86c703d62c0400a176d2a0f01'
);

// tbtc 2191392-2191394
const tBtcBlocks = [
  '04000020dd7a430b4c4ce754c91bc106ed03b173e5641cbd76eaae8a3900000000000000c7c142e49f65d7ebc92fa727903b0034ba241176404a6ce7296cd2e2d932b41f8e6b3d62d9ef001a817fbec1',
  '040000207edcfc00ee8475a6797137764bfde776ac3d63242018bd5ce400000000000000138c7924c854cf19fe8fcc41e2bea865a629a64e9a29477208c3f5ad342482480b6f3d62d9ef001a2776a70e',
  '0000002032363fd0d8d2c784d055548ae0c7b5a1a3218b879071c024e3000000000000009edcf4d56db8089410c1809c9129456ae5b0347ec4953c00fcd20c19db509bb7d4733d62ffff001dac1439b1',
];
const tbtcLast = hexToBytes(tBtcBlocks[2]);
const tbtcPrev = tBtcBlocks
  .slice(0, 2)
  .reverse()
  .map(b => hexToBytes(b));

const tbtcTxid = 'a1bed67d3852d25aa08a78bdbd6e39a03bac2d3884ff98c5d215856b6f63c4c0';
const tbtcTx = {
  txHex:
    '01000000014ee1c348ec8280ccf5863099f5b3aed89d3534fab036a18897117236fa575461000000006a4730440220778ced9996a88e9e0b10dc40d437d5f47f80e4978e61ea8d4f165f45e8e47fbb022067dac4aedda52515a8fa868f263479453a0e7287721f9df9dd229221e8403503012103134531bbd7e8fa903fd9387ffa6c1cb652819e899533fd81ffa80d3882314691ffffffff020000000000000000426a4061323536663165313064336263313135303531306162656439626630346163663866316331646338656363663933363463623963383966633230303235646635dad20500000000001976a91485fbeb05f4ef6e46b4782acfacd3ea41fe60516988ac00000000',
  proof: {
    hashes: [
      '0c535ec986f3e9a4f9e145b2d14d4cd28f4b3ef2e3c11f4e1846ad03644d3cda',
      'c347a2a3075a443bf291647618f50881dadb2a7653ccf251e8c2bc120f9eb42d',
      '5c6ca3697451ba3030620920b6df8226717ce496ccd14807de2a5515f4a82acb',
      '635fad8036b4a78f269efa2c71fb89f601d3de21611a0a4fa7dd20e5e4799b5e',
    ],
    'tx-index': 11,
    'tree-depth': 4,
  },
  block: {
    header:
      '04000020dd7a430b4c4ce754c91bc106ed03b173e5641cbd76eaae8a3900000000000000c7c142e49f65d7ebc92fa727903b0034ba241176404a6ce7296cd2e2d932b41f8e6b3d62d9ef001a817fbec1',
    height: 41690,
  },
};

test.skip('testing block header', async () => {
  const parsed = await t.rovOk(contract.parseBlockHeader(secondBlock));
  const { parent } = parsed;
  const firstHash = hashSha256(hashSha256(firstBlock));
});

test('verify-prev-block', async () => {
  const isValid = await t.rovOk(contract.verifyPrevBlock(secondBlock, firstBlock));
  expect(isValid).toEqual(true);

  const err = await t.rovErr(contract.verifyPrevBlock(firstBlock, secondBlock));
  expect(err).toEqual(7n);
});

test('verify-prev-blocks', async () => {
  const lastBlock = await t.rovOk(contract.verifyPrevBlocks(secondBlock, [firstBlock]));
  expect(lastBlock).toEqual(firstBlock);

  const err = await t.rovErr(contract.verifyPrevBlocks(firstBlock, [secondBlock]));
  expect(err).toEqual(7n);
});

test('was-tx-mined-prev', async () => {
  await t.txOk(testUtils.setBurnHeader(tbtcTx.block.height, tbtcLast), alice);
  const result = await t.txOk(
    contract.wasTxMinedPrev(
      {
        header: tbtcLast,
        height: BigInt(tbtcTx.block.height),
      },
      tbtcPrev,
      hexToBytes(tbtcTx.txHex),
      {
        hashes: tbtcTx.proof.hashes.map(h => hexToBytes(h)),
        treeDepth: BigInt(tbtcTx.proof['tree-depth']),
        txIndex: BigInt(tbtcTx.proof['tx-index']),
      }
    ),
    alice
  );
  console.log(result.logs);
  expect(result.value).toEqual(true);
});

test('verify-prev-blocks works with one block', async () => {
  const lastBlock = await t.rovOk(contract.verifyPrevBlocks(secondBlock, []));
  expect(lastBlock).toEqual(secondBlock);
});
