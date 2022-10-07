import type { IntegerType } from 'micro-stacks/common';
import { bytesToBigInt, intToBigInt as _intToBigInt } from 'micro-stacks/common';
import BigNumber from 'bignumber.js';
import { address as bAddress, networks, payments } from 'bitcoinjs-lib';
import { coreUrl, btcNetwork, NETWORK_CONFIG } from './constants';
import { hashSha256 } from 'micro-stacks/crypto-sha';
import { base58checkEncode, hashRipemd160 } from 'micro-stacks/crypto';
import type { Supplier } from './store';

export function getTxUrl(txId: string) {
  const id = getTxId(txId);
  if (coreUrl.includes('http://localhost')) {
    return `http://localhost:8000/txid/${id}`;
  }
  const network = coreUrl.includes('testnet') ? 'testnet' : 'mainnet';
  return `https://explorer.stacks.co/txid/${id}?chain=${network}`;
}

export function getBtcTxUrl(txId: string) {
  if (NETWORK_CONFIG === 'mocknet') {
    return `http://localhost:8001/tx/${txId}`;
  }
  const base = `https://mempool.space/`;
  return `${base}${NETWORK_CONFIG === 'mainnet' ? '' : 'testnet/'}tx/${txId}`;
}

export type IntegerOrBN = IntegerType | BigNumber;

export function intToString(int: IntegerOrBN) {
  const str = typeof int === 'bigint' ? int.toString() : String(int);
  return str;
}

export function satsToBtc(sats: IntegerOrBN, minDecimals?: number) {
  const n = new BigNumber(intToString(sats)).shiftedBy(-8).decimalPlaces(8);
  if (typeof minDecimals === 'undefined') return n.toFormat();
  const rounded = n.toFormat(minDecimals);
  const normal = n.toFormat();
  return rounded.length > normal.length ? rounded : normal;
}

export function btcToSatsBN(btc: IntegerOrBN) {
  return new BigNumber(intToString(btc)).shiftedBy(8).decimalPlaces(0);
}

export function btcToSats(btc: IntegerOrBN) {
  return btcToSatsBN(btc).toString();
}

/**
 * truncateMiddle
 *
 * If contract_id, it will truncate the principal, while keeping the contract name untouched.
 * If prefixed with '0x', will truncate everything after prefix.
 *
 * @param input - the string to truncate
 * @param offset - the number of chars to keep on either end
 */
export function truncateMiddle(input: string, offset = 5): string {
  if (!input) return '';
  // hex
  if (input.startsWith('0x')) {
    return truncateHex(input, offset);
  }
  // for contracts
  if (input.includes('.')) {
    const parts = input.split('.');
    const start = parts[0]?.substr(0, offset);
    const end = parts[0]?.substr(parts[0].length - offset, parts[0].length);
    return `${start}…${end}.${parts[1]}`;
  } else {
    // everything else
    const start = input?.substr(0, offset);
    const end = input?.substr(input.length - offset, input.length);
    return `${start}…${end}`;
  }
}

export function truncateHex(hex: string, offset = 5): string {
  return `${hex.substring(0, offset + 2)}…${hex.substring(hex.length - offset)}`;
}

export function bpsToPercent(bps: number) {
  return new BigNumber(bps).dividedBy(100).toString();
}

export function intToBigInt(num: IntegerOrBN) {
  if (num instanceof Uint8Array) {
    return bytesToBigInt(num);
  }
  if (typeof num === 'bigint') {
    return num;
  }
  const bn = new BigNumber(num).decimalPlaces(0);
  if (bn.isNaN()) return 0n;
  return BigInt(bn.toString());
}

export function getSwapAmount(
  amount: IntegerOrBN,
  feeRate: IntegerType,
  baseFee: IntegerType | null
) {
  const withBps = (intToBigInt(amount) * (10000n - _intToBigInt(feeRate, true))) / 10000n;
  if (baseFee !== null) {
    return withBps - intToBigInt(baseFee);
  }
  return withBps;
}

export function getSupplierSwapAmount(
  amount: IntegerType,
  supplier: Supplier,
  isOutbound: boolean
) {
  const baseFee = isOutbound ? supplier.outboundBaseFee : supplier.inboundBaseFee;
  const feeRate = isOutbound ? supplier.outboundFee : supplier.inboundFee;
  return getSwapAmount(amount, feeRate, baseFee);
}

export const addressVersionToMainnetVersion: Record<number, number> = {
  [0]: 0,
  [5]: 5,
  [111]: 0,
  [196]: 5,
};

export function parseBtcAddress(address: string) {
  const b58 = bAddress.fromBase58Check(address);
  const version = addressVersionToMainnetVersion[b58.version] as number | undefined;
  if (typeof version !== 'number') throw new Error('Invalid address version.');
  return {
    version,
    hash: b58.hash,
  };
}

// Add 0x to beginning of txid
export function getTxId(txId: string) {
  return txId.startsWith('0x') ? txId : `0x${txId}`;
}

export function getOutboundPayment(hash: Uint8Array, versionBytes: Uint8Array) {
  const version = Number(bytesToBigInt(versionBytes));
  if (version === networks.bitcoin.pubKeyHash) {
    return payments.p2pkh({ network: btcNetwork, hash: Buffer.from(hash) });
  } else {
    return payments.p2sh({ network: btcNetwork, hash: Buffer.from(hash) });
  }
}

export function getOutboundAddress(hash: Uint8Array, versionBytes: Uint8Array) {
  const { address } = getOutboundPayment(hash, versionBytes);
  if (!address) throw new Error('Invalid BTC payment');
  return address;
}

export function pubKeyToBtcAddress(publicKey: Uint8Array) {
  const sha256 = hashSha256(publicKey);
  const hash160 = hashRipemd160(sha256);
  return base58checkEncode(hash160, btcNetwork.pubKeyHash);
}

export function splitContractId(identifier: string) {
  return identifier.split('.');
}
