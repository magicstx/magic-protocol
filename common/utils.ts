import { wrapWithMicroStacks } from '@micro-stacks/nextjs';
import { bytesToBigInt, IntegerType, intToBigInt } from 'micro-stacks/common';
import BigNumber from 'bignumber.js';
import { address as bAddress, networks, payments } from 'bitcoinjs-lib';
import { network, coreUrl, btcNetwork, NETWORK_CONFIG, LOCAL_URL } from './constants';
import { hashSha256 } from 'micro-stacks/crypto-sha';
import { base58checkEncode, hashRipemd160 } from 'micro-stacks/crypto';

export function getTxUrl(txId: string) {
  const id = getTxId(txId);
  if (coreUrl.includes('http://localhost')) {
    return `${coreUrl}/extended/v1/tx/${id}?unanchored=true`;
  }
  const network = coreUrl.includes('testnet') ? 'testnet' : 'mainnet';
  return `https://explorer.stacks.co/txid/${id}?chain=${network}`;
}

export function getBtcTxUrl(txId: string) {
  const base = `https://mempool.space/`;
  return `${base}${NETWORK_CONFIG === 'mainnet' ? '' : 'testnet/'}tx/${txId}`;
}

export const withMicroStacks = wrapWithMicroStacks({
  authOptions: {
    appDetails: {
      name: 'Magic Bridge',
      icon: `${LOCAL_URL}/burst.svg`,
    },
  },
  network,
  useCookies: true,
});

export function intToString(int: IntegerType) {
  const str = typeof int === 'bigint' ? int.toString() : String(int);
  return str;
}

export function satsToBtc(sats: IntegerType, minDecimals?: number) {
  const n = new BigNumber(intToString(sats)).shiftedBy(-8).decimalPlaces(8);
  if (typeof minDecimals === 'undefined') return n.toFormat();
  const rounded = n.toFormat(minDecimals);
  const normal = n.toFormat();
  return rounded.length > normal.length ? rounded : normal;
}

export function btcToSats(btc: IntegerType) {
  return new BigNumber(intToString(btc)).shiftedBy(8).decimalPlaces(0).toString();
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

export function getSwapAmount(amount: IntegerType, feeRate: IntegerType, baseFee?: IntegerType) {
  const withBps = (intToBigInt(amount) * (10000n - intToBigInt(feeRate, true))) / 10000n;
  if (typeof baseFee !== 'undefined') {
    return withBps - intToBigInt(baseFee);
  }
  return withBps;
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
