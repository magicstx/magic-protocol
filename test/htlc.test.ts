/* eslint-disable @typescript-eslint/no-non-null-assertion */
import 'cross-fetch/polyfill';
import { TestProvider } from '@clarigen/test';
import { contracts, ClarityBitcoinContract, BridgeContract } from '../common/clarigen';
import { privateKeys, publicKeys } from './mocks';
import {
  generateHTLCAddress,
  generateHTLCScript,
  htlcASM,
  numberToLE,
  reverseBuffer,
} from '../common/htlc';
import {
  script as bScript,
  address as bAddress,
  crypto as bcrypto,
  Psbt,
  ECPair,
  networks,
  payments,
  Transaction,
} from 'bitcoinjs-lib';
import { base58checkDecode, ripemd160 } from 'micro-stacks/crypto';
import { bytesToHex, hexToBytes, numberToHex } from 'micro-stacks/common';
import { hashSha256 } from 'micro-stacks/crypto-sha';
import { expectBuffers, makeTxHex } from './helpers';
import { getTxHex } from '../common/api/electrum';

let clarityBtc: ClarityBitcoinContract;
let htlcContract: BridgeContract;
let t: TestProvider;

beforeAll(async () => {
  const { deployed, provider } = await TestProvider.fromContracts(contracts);
  t = provider;
  clarityBtc = deployed.clarityBitcoin.contract;
  htlcContract = deployed.bridge.contract;
});

const [sender, recipient] = publicKeys;

const preImage = hexToBytes('aaaa');
const hash = hashSha256(preImage);

const htlc = {
  senderPublicKey: sender,
  recipientPublicKey: recipient,
  expiration: 100,
  hash: Buffer.from(hash),
  swapper: 1,
};

test('can generate an htlc address', () => {
  const htlc = {
    senderPublicKey: sender,
    recipientPublicKey: recipient,
    expiration: 100,
    hash: Buffer.from('aaaa', 'hex'),
    swapper: 1,
  };
  const payment = generateHTLCAddress(htlc);

  const script = Uint8Array.from(generateHTLCScript(htlc));

  const scriptHash = ripemd160(hashSha256(script));
  // console.log('scriptHash', bytesToHex(scriptHash));

  const decoded = base58checkDecode(payment.address!);
  expect(decoded.hash).toEqual(scriptHash);
  expect(payment.hash).toEqual(Buffer.from(scriptHash));

  // micro-stacks scriptHash
});

test('can read a varint uint32', async () => {
  const buff = Buffer.from('81cd0a', 'hex');
  const num = await t.rovOk(htlcContract.readUint32(buff, 3));
  expect(num).toEqual(707969n);
  const nums = [17, 257, 65536, 83886079];
  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];
    const len = i + 1;
    const encoded = bScript.number.encode(num);
    const res = await t.rovOk(htlcContract.readUint32(encoded, len));
    expect(res).toEqual(BigInt(num));
  }
});

test('can make a correct script in clarity', async () => {
  const htlc = {
    senderPublicKey: sender,
    recipientPublicKey: recipient,
    expiration: 100,
    hash: Buffer.from(hash),
    swapper: 0n,
  };
  // console.log('block', numberToHex(100));
  // const payment = generateHTLCAddress(htlc, networks.bitcoin);
  const script = generateHTLCScript(htlc);
  const payment = generateHTLCAddress(htlc);

  const expiration = bScript.number.encode(100);
  const swapper = numberToLE(htlc.swapper);

  const clarScript = await t.rov(
    htlcContract.generateHtlcScript(
      htlc.senderPublicKey,
      htlc.recipientPublicKey,
      expiration,
      Buffer.from(hash),
      Buffer.from(swapper, 'hex')
    )
  );

  expectBuffers(clarScript, script);
  expectBuffers(clarScript, payment.redeem!.output!);
});

test('can make correct scriptHash in clarity', async () => {
  const preImage = hexToBytes('aaaa');
  const hash = hashSha256(preImage);

  const payment = generateHTLCAddress(htlc);

  const expiration = bScript.number.encode(htlc.expiration);
  const swapper = numberToLE(htlc.swapper);

  const scriptHash = await t.rov(
    htlcContract.generateHtlcScriptHash(
      htlc.senderPublicKey,
      htlc.recipientPublicKey,
      expiration,
      Buffer.from(hash),
      Buffer.from(swapper, 'hex')
    )
  );

  expectBuffers(scriptHash, payment.output!);
});

test.skip('playing with asm', () => {
  const preImage = hexToBytes('aaaa');
  const hash = hashSha256(preImage);
  // console.log('op', numberToHex(78));
  // const preImage = Uint8Array.from(Buffer.from('aaaa', 'hex'));
  const htlc = {
    senderPublicKey: sender,
    recipientPublicKey: recipient,
    hash: Buffer.from(hash),
    swapper: 1,
  };
  // console.log('block', numberToHex(707969));
  // const payment = generateHTLCAddress(htlc, networks.bitcoin);
  const script = generateHTLCScript(htlc);
  // const asm = bScript.toASM(script);
  const asm = htlcASM(htlc);
  console.log(asm);
  console.log(script.toString('hex'));
  const decompiled = bScript.decompile(script);
  // console.log('decompiled', decompiled);

  const chunks = bScript.decompile(script);
  let buff = '';
  const parts: string[] = [];
  chunks!.forEach(chunk => {
    if (typeof chunk === 'number') {
      // console.log(chunk, numberToHex(chunk));
      buff += numberToHex(chunk);
    } else {
      parts.push(buff);
      // console.log(buff);
      parts.push(chunk.toString('hex'));
      // console.log(chunk.toString('hex'));
      buff = '';
    }
  });
  console.log(parts);
});

test('can generate LE hex', () => {
  const num = 16711680;
  const hex = numberToLE(num);
  expect(hex).toEqual('0000ff00');

  expect(numberToLE(1)).toEqual('01000000');
});

test('can read a uint32 le', async () => {
  async function expectUint(num: bigint) {
    const le = Buffer.from(numberToLE(num), 'hex');
    const result = await t.rovOk(htlcContract.readUint32(le, 4));
    expect(result).toEqual(num);
  }
  await expectUint(0n);
  await expectUint(1n);
  await expectUint(200n);
  await expectUint(1123432n);
});

test('can generate an tx with htlc output', async () => {
  const payment = generateHTLCAddress(htlc);
  const txHex = makeTxHex(payment);

  const parsedTx = await t.rovOk(clarityBtc.parseTx(txHex));
  const out = parsedTx.outs[0].scriptPubKey;
  // console.log(out.toString('hex'));
  // console.log(bScript.toASM(out));
  // console.log(bScript.decompile(out));
  expectBuffers(out, payment.output!);
  const reversed = payments.p2sh({ output: Buffer.from(out), network: networks.regtest });
  expect(reversed.address).toEqual(payment.address);
});

test('can generate a p2pkh script', async () => {
  const address = '1AbDToGxjv4TmrouWHfyCRSkQdRM5uujup';
  const decoded = base58checkDecode(address);

  const clarScript = await t.rov(htlcContract.generateP2pkhOutput(Buffer.from(decoded.hash)));
  const script = payments.p2pkh({ hash: Buffer.from(decoded.hash) }).output;
  expectBuffers(clarScript, script!);
  expectBuffers(clarScript, hexToBytes('76a9146931ad72f19daceac1042fcfcea763620aab13cf88ac'));
});

test('can generate a p2sh output', async () => {
  const address = '3Bck2eEkATX1hxy5qthGZqbE8xr2hMgXBm';
  const decoded = base58checkDecode(address);

  const clarScript = await t.rov(htlcContract.generateP2shOutput(Buffer.from(decoded.hash)));
  const script = payments.p2sh({ hash: Buffer.from(decoded.hash) }).output;
  expectBuffers(clarScript, script!);
  expectBuffers(clarScript, hexToBytes('a9146ce2535d5f3276455b11ff341cff12c01428f02f87'));
});

test('getting txHex for clarity', async () => {
  const txHexOriginal =
    '02000000000101ca9b17be19f1bc55fe300a8b49d0a18665382f3344bfaaf91e644174f329e9f6010000001716001464cb8b54a9ccb365708928421fe8807a99e1a9d0fdffffff02102700000000000017a914a4e97ce598f2199625a323d8173b4aeb934e049887104104000000000017a914b598a2baf08ff29da787188c82a99c533e2b2f98870247304402206dd11e034e311d3155181199a6c514e646c4dab24a6707241fbf5b9f5305d747022040018250e3f3ac9ee30c0477412f5729dfd1245a9db35cfa767420b603c1d2d9012102b248be3c783d5f2aecaf2a27f38ddf98025e108ce76d8eda721cdfee61ec4347b0842000';
  const txHex = getTxHex(txHexOriginal);
  const txBuff = Buffer.from(txHex, 'hex');
  const txid = bytesToHex(await t.rov(clarityBtc.getTxid(txBuff)));
  const expected = 'd2dac73ccaa630584ee26c0b2023181624831110c962cc1aa22b9de4a532527e';
  expect(txid).toEqual(expected);
  const doubleSha = reverseBuffer(Buffer.from(hashSha256(hashSha256(txBuff))));
  expect(bytesToHex(doubleSha)).toEqual(expected);
});
