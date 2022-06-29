/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { payments, Psbt, ECPair, networks } from 'bitcoinjs-lib';
import { IntegerType, intToBigInt } from 'micro-stacks/common';
import { contracts as contractDef } from '../common/clarigen/single';
import { deploymentFactory } from '@clarigen/core';
import { simnetDeployment } from '../common/clarigen/deployments/simnet';

export const factory = deploymentFactory(contractDef, simnetDeployment);

type Wallets = typeof simnetDeployment['genesis']['wallets'];

export type Accounts = {
  [I in keyof Wallets as Wallets[number]['name']]: {
    balance: bigint;
    address: Wallets[number]['address'];
  };
};

export const accounts = Object.fromEntries(
  simnetDeployment.genesis.wallets.map(a => {
    return [
      a.name,
      {
        balance: BigInt(a.balance),
        address: a.address,
      },
    ];
  })
) as Accounts;

export function makeTxHex(payment: payments.Payment, value = 10000) {
  // input data from bitcoinjs-lib tests
  const alice = ECPair.fromWIF('L2uPYXe17xSTqbCjZvL2DsyXPCbXspvcu5mHLDYUgzdUbZGSKrSr');
  const psbt = new Psbt({ network: networks.regtest });
  psbt.addInput({
    hash: '7d067b4a697a09d2c3cff7d4d9506c9955e93bff41bf82d439da7d030382bc3e',
    index: 0,
    nonWitnessUtxo: Buffer.from(
      '0200000001f9f34e95b9d5c8abcd20fc5bd4a825d1517be62f0f775e5f36da944d9' +
        '452e550000000006b483045022100c86e9a111afc90f64b4904bd609e9eaed80d48' +
        'ca17c162b1aca0a788ac3526f002207bb79b60d4fc6526329bf18a77135dc566020' +
        '9e761da46e1c2f1152ec013215801210211755115eabf846720f5cb18f248666fec' +
        '631e5e1e66009ce3710ceea5b1ad13ffffffff01' +
        // value in satoshis (Int64LE) = 0x015f90 = 90000
        '905f010000000000' +
        // scriptPubkey length
        '19' +
        // scriptPubkey
        '76a9148bbc95d2709c71607c60ee3f097c1217482f518d88ac' +
        // locktime
        '00000000',
      'hex'
    ),
  });
  psbt.addOutput({
    address: payment.address!,
    value,
  });
  psbt.signInput(0, alice);
  psbt.finalizeAllInputs();
  const txHex = psbt.extractTransaction().toBuffer();
  return txHex;
}

export const blockLimits: Record<string, number> = {
  write_length: 15_000_000, // roughly 15 mb
  write_count: 7_750,
  read_length: 100_000_000,
  read_count: 7_750,
  runtime: 5_000_000_000,
};

type ReceiptCosts = Record<string, number>;

function costDisplay(cost: number, limit: number) {
  const percent = ((cost / limit) * 100).toFixed(2);
  return `${percent}%`;
}

export function logTxCosts(costs: ReceiptCosts, name?: string) {
  const message: string[] = name ? [`${name} costs:`] : [];
  Object.keys(costs).forEach(key => {
    const cost = costs[key];
    const limit = blockLimits[key];
    // console.log(key, costDisplay(cost, limit));
    message.push(`${key}: ${cost} (${costDisplay(cost, limit)})`);
  });
  console.log(message.join('\n'));
}

export function getSwapAmount(amount: bigint, feeRate: IntegerType, baseFee: IntegerType) {
  const base = intToBigInt(baseFee);
  const withFeeRate = (amount * (10000n - intToBigInt(feeRate, true))) / 10000n;
  return withFeeRate - base;
}

export function expectBuffers(actual: Uint8Array | Buffer, expected: Uint8Array | Buffer) {
  expect(Uint8Array.from(actual)).toEqual(Uint8Array.from(actual));
}
