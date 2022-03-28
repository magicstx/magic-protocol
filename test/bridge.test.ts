/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  createClarityBin,
  getBlockHeight,
  TestProvider,
  PublicResultOk,
  mineBlocks,
} from '@clarigen/test';
import { bytesToHex, hexToBytes, numberToHex } from 'micro-stacks/common';
import { hashSha256 } from 'micro-stacks/crypto-sha';
import {
  contracts,
  BridgeContract,
  accounts,
  XbtcContract,
  TestUtilsContract,
  ClarityBitcoinContract,
} from '../common/clarigen';
import {
  CSV_DELAY,
  CSV_DELAY_BUFF,
  generateHTLCAddress,
  numberToLE,
  numberToLEBytes,
} from '../common/htlc';
import { getSwapAmount, logTxCosts, makeTxHex } from './helpers';
import { privateKey, publicKey, publicKeys } from './mocks';
import { script as bScript, Transaction, payments, networks } from 'bitcoinjs-lib';
import { base58checkDecode } from 'micro-stacks/crypto';
import { NativeClarityBinProvider } from '@clarigen/native-bin';
import { ContractReturn, CoreNodeEventType, filterEvents } from '@clarigen/core';

let contract: BridgeContract;
let xbtcContract: XbtcContract;
let testUtils: TestUtilsContract;
let clarityBtc: ClarityBitcoinContract;
let t: TestProvider;

const deployer = accounts.deployer.address;
const operator = accounts.operator.address;
const swapper = accounts.swapper.address;
const alice = accounts.wallet_3.address;

let bridgeId: string;
const xbtcTokenId = `${deployer}.xbtc::xbtc`;

const feeIn = 300n;
const feeOut = 100n;
const startingFunds = 2n * 1000000n;

// process.env.PRINT_CLARIGEN_STDERR = 'true';

beforeAll(async () => {
  const { bridge, ...rest } = contracts;
  const { deployed, provider } = await TestProvider.fromContracts(
    {
      ...rest,
      clarityBitcoin: {
        ...contracts.clarityBitcoin,
        contractFile: 'contracts/test/clarity-bitcoin.clar',
      },
      bridge,
    },
    { accounts }
  );
  t = provider;
  contract = deployed.bridge.contract;
  xbtcContract = deployed.xbtc.contract;
  testUtils = deployed.testUtils.contract;
  bridgeId = deployed.bridge.identifier;
  clarityBtc = deployed.clarityBitcoin.contract;
});

test('can register as operator', async () => {
  const receipt = await t.txOk(
    contract.registerOperator(publicKey, feeIn, feeOut, 100, 100, 'first', startingFunds),
    operator
  );
  expect(receipt.value).toEqual(0n);

  expect(await t.rov(contract.getOperatorIdByController(operator))).toEqual(0n);
  expect(await t.rov(contract.getOperatorIdByPublicKey(publicKey))).toEqual(0n);
});

test('alice can register as operator', async () => {
  await t.txOk(xbtcContract.transfer(1000, operator, alice, null), operator);
  const receipt = await t.txOk(
    contract.registerOperator(publicKeys[2], feeIn, feeOut, 100, 100, 'second', 1000),
    alice
  );
  expect(receipt.value).toEqual(1n);

  expect(await t.rov(contract.getOperatorIdByController(alice))).toEqual(1n);
  expect(await t.rov(contract.getOperatorIdByPublicKey(publicKeys[2]))).toEqual(1n);
});

test('cannot set invalid fee', async () => {
  async function expectFeeError(inbound: bigint, outbound: bigint) {
    const receipt = await t.txErr(
      contract.registerOperator(Buffer.from('asdf', 'hex'), inbound, outbound, 0, 0, 'first', 0),
      deployer
    );
    expect(receipt.value).toEqual(8n);
  }
  await expectFeeError(10001n, 0n);
  await expectFeeError(-10001n, 0n);
  await expectFeeError(0n, 10001n);
  await expectFeeError(0n, -10001n);
});

test('cannot re-register with same controller', async () => {
  const receipt = await t.txErr(
    contract.registerOperator(Buffer.from('asdf', 'hex'), feeIn, feeOut, 0, 0, 'first', 0),
    operator
  );
  expect(receipt.value).toEqual(2n);
});

test('cannot register with existing public key', async () => {
  const receipt = await t.txErr(
    contract.registerOperator(publicKey, feeIn, feeOut, 0, 0, 'first', 0),
    deployer
  );
  expect(receipt.value).toEqual(2n);
});

test('can add funds', async () => {
  const oldFunds = await t.rov(contract.getFunds(0n));
  const amount = 2n * 1000000n;
  const receipt = await t.txOk(contract.addFunds(amount), operator);
  expect(receipt.value).toEqual(amount + oldFunds);

  const funds = await t.rov(contract.getFunds(0n));
  expect(funds).toEqual(amount + startingFunds);
});

test('can remove funds', async () => {
  const oldFunds = await t.rov(contract.getFunds(0n));
  const amount = 1n * 1000000n;
  const receipt = await t.txOk(contract.removeFunds(amount), operator);
  expect(receipt.value).toEqual(oldFunds - amount);

  const funds = await t.rov(contract.getFunds(0n));
  expect(funds).toEqual(oldFunds - amount);
});

test('cannot remove more than funds', async () => {
  const oldFunds = await t.rov(contract.getFunds(0n));
  const receipt = await t.txErr(contract.removeFunds(oldFunds + 1n), operator);
  expect(receipt.value).toEqual(14n);

  const funds = await t.rov(contract.getFunds(0n));
  expect(funds).toEqual(oldFunds);
});

test('can register a swapper', async () => {
  const receipt = await t.txOk(contract.initializeSwapper(), swapper);
  expect(receipt.value).toEqual(0n);
});

test('cannot re-register', async () => {
  const receipt = await t.txErr(contract.initializeSwapper(), swapper);
  expect(receipt.value).toEqual(9n);
});

test('can calculate fees', async () => {
  async function expectAmount(amount: bigint, feeRate: bigint, final: bigint) {
    const result = await t.rov(contract.getAmountWithFeeRate(amount, feeRate));
    expect(result).toEqual(final);
  }
  await expectAmount(100n, 300n, 97n);
  await expectAmount(10000n, 1n, 9999n);
  await expectAmount(100n, 1n, 99n);
  await expectAmount(100n, -300n, 103n);
  await expectAmount(100n, 10000n, 0n);
  await expectAmount(100n, -10000n, 200n);
  await expectAmount(100n, 9999n, 0n);
});

const proof = {
  'tree-depth': 1n,
  'tx-index': 1n,
  hashes: [],
};

test('can calculate swap amount', async () => {
  async function expectAmount(amount: bigint, feeRate: bigint, baseFee: bigint, final: bigint) {
    const result = await t.rovOk(contract.getSwapAmount(amount, feeRate, baseFee));
    expect(result).toEqual(final);
  }
  await expectAmount(100n, 300n, 0n, 97n);
  await expectAmount(10000n, 1n, 0n, 9999n);
  await expectAmount(100n, 1n, 0n, 99n);
  await expectAmount(100n, -300n, 0n, 103n);
  await expectAmount(100n, -10000n, 0n, 200n);

  // with base fees
  await expectAmount(100n, 300n, 5n, 92n);
  await expectAmount(10000n, 1n, 10n, 9989n);
  await expectAmount(100n, 1n, 3n, 96n);
  await expectAmount(100n, -300n, 3n, 100n);
  await expectAmount(100n, 10000n, -100n, 100n);
  await expectAmount(100n, -10000n, -10n, 210n);

  // underflows
  async function expectUnderflow(amount: bigint, feeRate: bigint, baseFee: bigint) {
    const result = await t.rovErr(contract.getSwapAmount(amount, feeRate, baseFee));
    expect(result).toEqual(24n);
  }
  await expectUnderflow(100n, 9999n, 5n);
  await expectUnderflow(100n, 300n, 97n);
  await expectUnderflow(10000n, 1n, 10000n);
  await expectUnderflow(100n, 1n, 100n);
  await expectUnderflow(100n, -300n, 200n);
  await expectUnderflow(100n, 10000n, 0n);
  await expectUnderflow(100n, 9999n, 0n);
});

test('total volume is as expected', async () => {
  expect(await t.rov(contract.getUserInboundVolume(swapper))).toEqual(0n);
  expect(await t.rov(contract.getTotalInboundVolume())).toEqual(0n);
  expect(await t.rov(contract.getUserOutboundVolume(swapper))).toEqual(0n);
  expect(await t.rov(contract.getTotalOutboundVolume())).toEqual(0n);
  expect(await t.rov(contract.getUserTotalVolume(swapper))).toEqual(0n);
  expect(await t.rov(contract.getTotalVolume())).toEqual(0n);
});

describe('successful inbound swap', () => {
  const preImage = hexToBytes('aaaa');
  const hash = hashSha256(preImage);
  const htlc = {
    senderPublicKey: publicKeys[1],
    recipientPublicKey: publicKey,
    hash,
    swapper: 0n,
  };

  const swapperHex = numberToLEBytes(htlc.swapper);

  const payment = generateHTLCAddress(htlc);
  const sats = 50000n;
  const txHex = makeTxHex(payment, Number(sats));
  const txid = hexToBytes(Transaction.fromBuffer(txHex).getId());

  let swapperBalanceBefore: bigint;
  let operatorFundsBefore: bigint;
  let operatorEscrowBefore: bigint;

  // const xbtcAmount = (sats * (10000n - feeIn)) / 10000n;
  const xbtcAmount = getSwapAmount(sats, feeIn, 100);
  beforeAll(async () => {
    swapperBalanceBefore = await t.rovOk(xbtcContract.getBalance(swapper));
    operatorFundsBefore = (await t.rov(contract.getFunds(0n)))!;
    operatorEscrowBefore = (await t.rov(contract.getEscrow(0n)))!;

    await t.txOk(testUtils.setMined(txid), deployer);
  });
  test('can escrow with a valid transaction', async () => {
    const receipt = await t.txOk(
      contract.escrowSwap(
        { header: Buffer.from([]), height: 1n },
        [],
        txHex,
        proof,
        0n,
        htlc.senderPublicKey,
        htlc.recipientPublicKey,
        CSV_DELAY_BUFF,
        hash,
        swapperHex,
        0n
      ),
      swapper
    );
    // logTxCosts(receipt.costs, 'escrowSwap');
  });
  test('validates that escrow stored', async () => {
    const swap = await t.rov(contract.getInboundSwap(txid));
    if (swap === null) throw new Error('Expected swap');
    expect(swap.expiration).toEqual(501n - 200n);
    expect(swap.swapper).toEqual(0n);
    expect(swap.operator).toEqual(0n);
    expect(swap.hash).toEqual(hash);
    expect(swap.xbtc).toEqual(xbtcAmount);
  });

  test('validates metadata stored', async () => {
    const meta = await t.rov(contract.getInboundMeta(txid));
    if (meta === null) throw new Error('Expected swap');
    expect(meta.sats).toEqual(sats);
    expect(meta.csv).toEqual(BigInt(CSV_DELAY));
    expect(meta['redeem-script']).toEqual(Uint8Array.from(payment.redeem!.output!));
    expect(meta['output-index']).toEqual(0n);
    expect(meta['sender-public-key']).toEqual(htlc.senderPublicKey);
  });

  test('validates funds moved to escrow', async () => {
    const funds = await t.rov(contract.getFunds(0n));
    const escrow = await t.rov(contract.getEscrow(0n));
    if (escrow === null) throw new Error('Expected escrow');
    expect(funds).toEqual(operatorFundsBefore - xbtcAmount);
    expect(escrow).toEqual(operatorEscrowBefore + escrow);
    expect(operatorEscrowBefore).toEqual(0n);
    expect(escrow).toEqual(xbtcAmount);
  });

  test('inbound volume not updated yet', async () => {
    expect(await t.rov(contract.getUserInboundVolume(swapper))).toEqual(0n);
    expect(await t.rov(contract.getTotalInboundVolume())).toEqual(0n);
  });

  test('validates that txid cant be re-used', async () => {
    const receipt = await t.txErr(
      contract.escrowSwap(
        { header: Buffer.from([]), height: 1n },
        [],
        txHex,
        proof,
        0n,
        htlc.senderPublicKey,
        htlc.recipientPublicKey,
        CSV_DELAY_BUFF,
        hash,
        swapperHex,
        0n
      ),
      swapper
    );
    expect(receipt.value).toEqual(16n);
  });

  let finalizeReceipt: PublicResultOk<boolean>;

  test('can finalize an escrow', async () => {
    finalizeReceipt = await t.txOk(contract.finalizeSwap(txid, Buffer.from(preImage)), swapper);
  });

  test('validates proper amount of xbtc moved', () => {
    const tokensMoved = finalizeReceipt.assets.tokens[`${deployer}.bridge`][xbtcTokenId];
    expect(BigInt(tokensMoved)).toEqual(xbtcAmount);
  });

  test('xbtc sent to swapper', async () => {
    const balance = await t.rovOk(xbtcContract.getBalance(swapper));
    expect(balance - swapperBalanceBefore).toEqual(xbtcAmount);
  });

  test('validates that escrow updated', async () => {
    const escrow = await t.rov(contract.getEscrow(0n));
    expect(escrow).toEqual(0n);
    expect(await t.rov(contract.getFunds(0n))).toEqual(operatorFundsBefore - xbtcAmount);
  });

  test('validates that preimage is saved', async () => {
    const preimage = await t.rov(contract.getPreimage(txid));
    expect(preimage).toEqual(preImage);
  });

  test('inbound volume is updated', async () => {
    expect(await t.rov(contract.getUserInboundVolume(swapper))).toEqual(xbtcAmount);
    expect(await t.rov(contract.getTotalInboundVolume())).toEqual(xbtcAmount);
    expect(await t.rov(contract.getUserOutboundVolume(swapper))).toEqual(0n);
    expect(await t.rov(contract.getTotalOutboundVolume())).toEqual(0n);
    expect(await t.rov(contract.getUserTotalVolume(swapper))).toEqual(xbtcAmount);
    expect(await t.rov(contract.getTotalVolume())).toEqual(xbtcAmount);
  });
});

describe('validating inbound swaps', () => {
  const preImage = hexToBytes('aabb');
  const hash = hashSha256(preImage);
  const htlc = {
    senderPublicKey: publicKeys[1],
    recipientPublicKey: publicKey,
    hash,
    swapper: 0n,
  };

  const swapperHex = numberToLEBytes(htlc.swapper);

  const payment = generateHTLCAddress(htlc);
  const sats = 50000n;
  const txHex = makeTxHex(payment, Number(sats));
  const txid = hexToBytes(Transaction.fromBuffer(txHex).getId());

  let swapperBalanceBefore: bigint;
  let operatorFundsBefore: bigint;
  let operatorEscrowBefore: bigint;

  // const xbtcAmount = (sats * (10000n - feeIn)) / 10000n;
  const xbtcAmount = getSwapAmount(sats, feeIn, 100);
  test('validates that tx was mined', async () => {
    const receipt = await t.txErr(
      contract.escrowSwap(
        {
          header: hexToBytes(
            '046000205b8fe9509c8d5059419ecb0c7d8899ac5a33f4cc075b03000000000000000000d8ec11bb52893d95e8f240c0c44c2e837d239b930ed246f78b140be4841f459df46e3d62c0400a17a9ad0873'
          ),
          height: 1n,
        },
        [],
        txHex,
        proof,
        0n,
        htlc.senderPublicKey,
        htlc.recipientPublicKey,
        CSV_DELAY_BUFF,
        hash,
        swapperHex,
        0n
      ),
      swapper
    );
    expect(receipt.value).toEqual(21n);
  });

  test('validates proper htlc output', async () => {
    await t.txOk(testUtils.setMined(txid), deployer);
    const receipt = await t.txErr(
      contract.escrowSwap(
        { header: Buffer.from([]), height: 1n },
        [],
        txHex,
        proof,
        0n,
        htlc.senderPublicKey,
        publicKeys[2],
        CSV_DELAY_BUFF,
        hash,
        swapperHex,
        0n
      ),
      swapper
    );
    expect(receipt.value).toEqual(11n);
  });

  test('validates that operator pubkey is correct', async () => {
    const payment = generateHTLCAddress({
      senderPublicKey: publicKeys[1],
      recipientPublicKey: publicKeys[2],
      hash,
      swapper: 0n,
    });

    const txHex = makeTxHex(payment, Number(sats));
    const txid = hexToBytes(Transaction.fromBuffer(txHex).getId());
    await t.txOk(testUtils.setMined(txid), deployer);
    const receipt = await t.txErr(
      contract.escrowSwap(
        { header: Buffer.from([]), height: 1n },
        [],
        txHex,
        proof,
        0n,
        htlc.senderPublicKey,
        htlc.recipientPublicKey,
        CSV_DELAY_BUFF,
        hash,
        swapperHex,
        0n
      ),
      swapper
    );
    expect(receipt.value).toEqual(11n);
  });

  test('validates legit tx', async () => {
    const txBuff = hexToBytes('aaaaaaaa');
    const txid = await t.rov(clarityBtc.getTxid(txBuff));
    await t.txOk(testUtils.setMined(txid), deployer);
    const receipt = await t.txErr(
      contract.escrowSwap(
        { header: Buffer.from([]), height: 1n },
        [],
        txBuff,
        proof,
        0n,
        htlc.senderPublicKey,
        htlc.recipientPublicKey,
        CSV_DELAY_BUFF,
        hash,
        swapperHex,
        0n
      ),
      swapper
    );
    expect(receipt.value).toEqual(10n);
  });

  // unable to hit this code point?
  test.skip('validates hash length', async () => {
    const hash = hexToBytes('aaaa');
    const payment = generateHTLCAddress({
      senderPublicKey: publicKeys[1],
      recipientPublicKey: publicKeys[2],
      hash,
      swapper: 0n,
    });

    const txHex = makeTxHex(payment, Number(sats));
    const txid = hexToBytes(Transaction.fromBuffer(txHex).getId());
    await t.txOk(testUtils.setMined(txid), deployer);
    const receipt = await t.txErr(
      contract.escrowSwap(
        { header: Buffer.from([]), height: 1n },
        [],
        txHex,
        proof,
        0n,
        htlc.senderPublicKey,
        htlc.recipientPublicKey,
        CSV_DELAY_BUFF,
        hash,
        swapperHex,
        0n
      ),
      swapper
    );
    expect(receipt.value).toEqual(12n);
  });

  test('validates operator has sufficient funds', async () => {
    const htlc = {
      senderPublicKey: publicKeys[1],
      recipientPublicKey: publicKeys[2],
      hash,
      swapper: 0n,
    };
    const payment = generateHTLCAddress(htlc);
    const funds = await t.rov(contract.getFunds(1n));
    const txHex = makeTxHex(payment, Number(funds * 2n));
    const txid = hexToBytes(Transaction.fromBuffer(txHex).getId());
    await t.txOk(testUtils.setMined(txid), deployer);
    const receipt = await t.txErr(
      contract.escrowSwap(
        { header: Buffer.from([]), height: 1n },
        [],
        txHex,
        proof,
        0n,
        htlc.senderPublicKey,
        htlc.recipientPublicKey,
        CSV_DELAY_BUFF,
        hash,
        swapperHex,
        1n
      ),
      swapper
    );
    expect(receipt.value).toEqual(14n);
  });

  test('validates htlc expiration', async () => {
    const htlc = {
      senderPublicKey: publicKeys[1],
      recipientPublicKey: publicKeys[0],
      hash,
      swapper: 0n,
      expiration: 249,
    };
    const payment = generateHTLCAddress(htlc);
    const txHex = makeTxHex(payment, 1000);
    const txid = hexToBytes(Transaction.fromBuffer(txHex).getId());
    await t.txOk(testUtils.setMined(txid), deployer);
    const receipt = await t.txErr(
      contract.escrowSwap(
        { header: Buffer.from([]), height: 1n },
        [],
        txHex,
        proof,
        0n,
        htlc.senderPublicKey,
        htlc.recipientPublicKey,
        bScript.number.encode(htlc.expiration),
        hash,
        swapperHex,
        0n
      ),
      swapper
    );
    expect(receipt.value).toEqual(15n);
  });

  test.todo('validates that operator allows inbound');

  describe('after valid escrow', () => {
    beforeAll(async () => {
      await t.txOk(
        contract.escrowSwap(
          { header: Buffer.from([]), height: 1n },
          [],
          txHex,
          proof,
          0n,
          htlc.senderPublicKey,
          htlc.recipientPublicKey,
          CSV_DELAY_BUFF,
          hash,
          swapperHex,
          0n
        ),
        swapper
      );
    });

    test('validates that preimage is valid', async () => {
      const receipt = await t.txErr(contract.finalizeSwap(txid, hexToBytes('aaddcc')), swapper);
      expect(receipt.value).toEqual(19n);
    });

    test('cannot finalize swap after expiration', async () => {
      const height = await getBlockHeight(t);
      const { expiration } = (await t.rov(contract.getInboundSwap(txid)))!;
      const blocksToMine = expiration - height + 1n;
      await mineBlocks(blocksToMine, t);
      const receipt = await t.txErr(contract.finalizeSwap(txid, preImage), swapper);
      expect(receipt.value).toEqual(20n);
    });
  });
});

describe('successful outbound swap', () => {
  const address = '1AbDToGxjv4TmrouWHfyCRSkQdRM5uujup';
  const decoded = base58checkDecode(address);
  const version = hexToBytes(numberToHex(decoded.version));
  const hash = Buffer.from(decoded.hash);
  const xbtcAmount = 30000n;
  const sats = getSwapAmount(xbtcAmount, feeOut, 100);
  let swapperBalanceBefore: bigint;
  let bridgeBalanceBefore: bigint;
  let operatorFundsBefore: bigint;
  let receipt: PublicResultOk<bigint>;
  const swapId = 0n;
  let prevVolume: bigint;

  const payment = payments.p2pkh({ hash, network: networks.regtest });
  const txHex = makeTxHex(payment, Number(sats));
  const txid = hexToBytes(Transaction.fromBuffer(txHex).getId());

  beforeAll(async () => {
    swapperBalanceBefore = await t.rovOk(xbtcContract.getBalance(swapper));
    bridgeBalanceBefore = await t.rovOk(xbtcContract.getBalance(bridgeId));
    operatorFundsBefore = (await t.rov(contract.getFunds(0n)))!;
    prevVolume = await t.rov(contract.getTotalVolume());
    await t.txOk(testUtils.setMined(txid), deployer);
  });

  test('can initiate an outbound swap successfully', async () => {
    receipt = await t.txOk(contract.initiateOutboundSwap(xbtcAmount, version, hash, 0n), swapper);
    expect(receipt.value).toEqual(swapId);
  });

  test('tx sent the right amount of xbtc', async () => {
    const tokensMoved = receipt.assets.tokens[swapper][xbtcTokenId];
    expect(tokensMoved).toEqual(xbtcAmount.toString());
    const balance = await t.rovOk(xbtcContract.getBalance(swapper));
    expect(balance).toEqual(swapperBalanceBefore - xbtcAmount);

    const bridgeBalance = await t.rovOk(xbtcContract.getBalance(bridgeId));
    expect(bridgeBalance).toEqual(bridgeBalanceBefore + xbtcAmount);
  });

  test('swap is saved correctly', async () => {
    const swap = (await t.rov(contract.getOutboundSwap(swapId)))!;
    expect(swap.sats).toEqual(sats);
    expect(swap.xbtc).toEqual(xbtcAmount);
    const blockHeight = await getBlockHeight(t);
    expect(swap['created-at']).toEqual(blockHeight - 1n);
    expect(swap.operator).toEqual(0n);
    expect(swap.version).toEqual(version);
    expect(Buffer.from(swap.hash)).toEqual(hash);
  });

  test('can successfully finalize outbound swap', async () => {
    const proof = {
      'tree-depth': 1n,
      'tx-index': 1n,
      hashes: [],
    };
    const receipt = await t.txOk(
      contract.finalizeOutboundSwap(
        { header: Buffer.from([]), height: 1n },
        [],
        txHex,
        proof,
        0n,
        swapId
      ),
      operator
    );
  });

  test('Swap saved as completed', async () => {
    const _txid = await t.rov(contract.getCompletedOutboundSwapTxid(0n));
    expect(_txid).toEqual(txid);

    const _id = await t.rov(contract.getCompletedOutboundSwapByTxid(txid));
    expect(_id).toEqual(swapId);
  });

  test('funds updated', async () => {
    const funds = await t.rov(contract.getFunds(0n));
    expect(funds).toEqual(operatorFundsBefore + xbtcAmount);
  });

  test('volume counts are updated', async () => {
    const newTotal = xbtcAmount + prevVolume;
    expect(await t.rov(contract.getUserInboundVolume(swapper))).toEqual(prevVolume);
    expect(await t.rov(contract.getTotalInboundVolume())).toEqual(prevVolume);
    expect(await t.rov(contract.getUserOutboundVolume(swapper))).toEqual(xbtcAmount);
    expect(await t.rov(contract.getTotalOutboundVolume())).toEqual(xbtcAmount);
    expect(await t.rov(contract.getUserTotalVolume(swapper))).toEqual(newTotal);
    expect(await t.rov(contract.getTotalVolume())).toEqual(newTotal);
  });
});

describe('revoking outbound swap', () => {
  const address = '1AbDToGxjv4TmrouWHfyCRSkQdRM5uujup';
  const decoded = base58checkDecode(address);
  const version = hexToBytes(numberToHex(decoded.version));
  const hash = Buffer.from(decoded.hash);
  const xbtcAmount = 10000n;
  const sats = getSwapAmount(xbtcAmount, feeOut, 100);
  let swapperBalanceBefore: bigint;
  let bridgeBalanceBefore: bigint;
  let operatorFundsBefore: bigint;
  let receipt: PublicResultOk<bigint>;
  let swapId: bigint;
  let prevVolume: bigint;

  const payment = payments.p2pkh({ hash, network: networks.regtest });
  const txHex = makeTxHex(payment, Number(sats));
  const txid = hexToBytes(Transaction.fromBuffer(txHex).getId());

  beforeAll(async () => {
    swapperBalanceBefore = await t.rovOk(xbtcContract.getBalance(swapper));
    bridgeBalanceBefore = await t.rovOk(xbtcContract.getBalance(bridgeId));
    operatorFundsBefore = (await t.rov(contract.getFunds(0n)))!;
    prevVolume = await t.rov(contract.getTotalVolume());
    await t.txOk(testUtils.setMined(txid), deployer);
    receipt = await t.txOk(contract.initiateOutboundSwap(xbtcAmount, version, hash, 0n), swapper);
    swapId = receipt.value;
  });

  test('cannot revoke if not expired', async () => {
    const receipt = await t.txErr(contract.revokeExpiredOutbound(swapId), swapper);
    expect(receipt.value).toEqual(25n);
  });

  describe('after expiration', () => {
    beforeAll(async () => {
      await mineBlocks(199n, t);
    });

    test('can revoke an outbound swap after expiration', async () => {
      // anyone can call this function
      const receipt = await t.txOk(contract.revokeExpiredOutbound(swapId), alice);
      const events = filterEvents(receipt.events, CoreNodeEventType.FtTransferEvent);
      expect(events.length).toEqual(1);
      const [ftTransfer] = events;
      expect(ftTransfer.ft_transfer_event.sender).toEqual(bridgeId);
      expect(ftTransfer.ft_transfer_event.recipient).toEqual(swapper);
      expect(ftTransfer.ft_transfer_event.amount).toEqual(xbtcAmount.toString());
      expect(ftTransfer.ft_transfer_event.asset_identifier).toEqual(xbtcTokenId);

      expect(receipt.assets.tokens[bridgeId][xbtcTokenId]).toEqual(xbtcAmount.toString());
    });
  });
});

describe('validating outbound swaps', () => {
  test.todo('cannot re-use txid');
  test.todo('cannot finalize an expired swap');
});

test('can update operator info', async () => {
  const newOperator: NonNullable<ContractReturn<typeof contract.getOperator>> = {
    'public-key': publicKeys[3],
    'inbound-base-fee': 123n,
    'outbound-base-fee': 234n,
    'inbound-fee': 10n,
    'outbound-fee': 20n,
    name: 'updated',
    controller: operator,
  };

  const receipt = await t.txOk(
    contract.updateOperator(
      newOperator['public-key'],
      newOperator['inbound-fee'],
      newOperator['outbound-fee'],
      newOperator['outbound-base-fee'],
      newOperator['inbound-base-fee'],
      newOperator.name
    ),
    operator
  );

  expect(receipt.value).toEqual(newOperator);

  const op = await t.rov(contract.getOperator(0n));
  expect(op).toEqual(newOperator);
});
