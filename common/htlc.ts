import { script, Network, networks, payments } from 'bitcoinjs-lib';
import {
  bytesToHex,
  IntegerType,
  intToHexString,
  hexToBytes,
  utf8ToBytes,
} from 'micro-stacks/common';
import { hashSha256 } from 'micro-stacks/crypto-sha';

export interface HTLC {
  hash: Uint8Array;
  senderPublicKey: Uint8Array;
  recipientPublicKey: Uint8Array;
  expiration?: number;
  swapper: IntegerType;
}

export type BufferType = Buffer | Uint8Array;

export function numberToLE(num: IntegerType, length = 4) {
  const hexBE = intToHexString(num, length);
  let le = '';
  // reverse the buffer
  for (let i = 0; i < length; i++) {
    le += hexBE.slice(-2 * (i + 1), -2 * i || length * 2);
  }
  return le;
}

export function numberToLEBytes(num: IntegerType, length = 4) {
  return hexToBytes(numberToLE(num, length));
}

export const CSV_DELAY = 500;
export const CSV_DELAY_BUFF = script.number.encode(CSV_DELAY);
export const CSV_DELAY_HEX = CSV_DELAY_BUFF.toString('hex');

export function encodeExpiration(expiration?: number): Buffer {
  return typeof expiration === 'undefined' ? CSV_DELAY_BUFF : script.number.encode(expiration);
}

export function htlcASM({ hash, senderPublicKey, recipientPublicKey, expiration, swapper }: HTLC) {
  const swapperHex = numberToLE(swapper);
  return `
  ${swapperHex} OP_DROP
	OP_IF
    OP_SHA256 ${bytesToHex(hash)}
    OP_EQUALVERIFY
		${bytesToHex(recipientPublicKey)}
	OP_ELSE
		${encodeExpiration(expiration).toString('hex')}
		OP_CHECKSEQUENCEVERIFY
		OP_DROP
		${bytesToHex(senderPublicKey)}
	OP_ENDIF
	OP_CHECKSIG`
    .replace(/\s+/g, ' ')
    .trim();
}

export function generateHTLCScript(htlc: HTLC) {
  const asm = htlcASM(htlc);
  const output = script.fromASM(asm);
  return output;
}

export function generateHTLCAddress(htlc: HTLC, _network?: Network) {
  const network = _network || networks.regtest;
  const script = generateHTLCScript(htlc);
  // const payment = payments.p2wsh({ redeem: { output: script, network }, network });
  // const payment = payments.p2sh({ , network });
  // const hash = ripemd160(Uint8Array.from(script));
  // const payment = payments.p2sh({ output: Buffer.from(hash), network });
  const payment = payments.p2sh({ redeem: { output: script, network }, network });
  return payment;
}

export function reverseBuffer(buffer: BufferType): Uint8Array {
  if (buffer.length < 1) return buffer;
  let j = buffer.length - 1;
  let tmp = 0;
  for (let i = 0; i < buffer.length / 2; i++) {
    tmp = buffer[i];
    buffer[i] = buffer[j];
    buffer[j] = tmp;
    j--;
  }
  return Uint8Array.from(buffer);
}

export function getScriptHash(output: BufferType): Uint8Array {
  const uintOutput = Uint8Array.from(output);
  const hash = hashSha256(uintOutput);
  const reversed = reverseBuffer(Buffer.from(hash));
  return reversed;
}

export function hexPadded(hex: string) {
  const bytes = hex.length % 2 ? `0${hex}` : hex;
  return bytes;
}

export function secretToHash(secret: string) {
  const bytes = utf8ToBytes(secret);
  return hashSha256(bytes);
}
