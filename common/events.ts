import type { contracts } from './clarigen/next';
import type { TypedAbiArg, TypedAbiFunction } from '@clarigen/core';
import { hexToCvValue } from '@clarigen/core';
import { getOutboundAddress, satsToBtc } from './utils';
import { bytesToHex, hexToBytes } from 'micro-stacks/common';
import type { ApiEvent } from './api/stacks';

type ResponseType<T> = T extends TypedAbiFunction<TypedAbiArg<unknown, string>[], infer R>
  ? R
  : never;

type BridgeFunctions = typeof contracts['bridge']['functions'];

type InboundSwapResponse = NonNullable<ResponseType<BridgeFunctions['getInboundSwap']>>;

type InboundSwapMeta = NonNullable<ResponseType<BridgeFunctions['getInboundMeta']>>;

type OutboundSwapResponse = NonNullable<ResponseType<BridgeFunctions['getOutboundSwap']>>;

export type InboundSwapFull = InboundSwapResponse & InboundSwapMeta;

export type EscrowPrint = InboundSwapFull & {
  topic: 'escrow';
  txid: Uint8Array;
};

export type FinalizeInboundPrint = InboundSwapResponse & {
  topic: 'finalize-inbound';
  preimage: Uint8Array;
  txid: Uint8Array;
};

export type RevokeInboundPrint = InboundSwapResponse & {
  topic: 'revoke-inbound';
  txid: Uint8Array;
};

export type InitiateOutboundPrint = OutboundSwapResponse & {
  topic: 'initiate-outbound';
  swapId: bigint;
};

export type FinalizeOutboundPrint = OutboundSwapResponse & {
  topic: 'finalize-outbound';
  swapId: bigint;
  txid: Uint8Array;
};

export type RevokeOutboundPrint = OutboundSwapResponse & {
  topic: 'revoke-outbound';
  swapId: bigint;
};

export type Print =
  | EscrowPrint
  | FinalizeInboundPrint
  | RevokeInboundPrint
  | InitiateOutboundPrint
  | FinalizeOutboundPrint
  | RevokeOutboundPrint;

export interface BridgeEvent {
  txid: string;
  print: Print;
}

export const isEscrowPrint = (val: Print): val is EscrowPrint => val.topic === 'escrow';
export const isFinalizeInboundPrint = (val: Print): val is FinalizeInboundPrint =>
  val.topic === 'finalize-inbound';
export const isRevokeInboundPrint = (val: Print): val is RevokeInboundPrint =>
  val.topic === 'revoke-inbound';
export const isInitiateOutboundPrint = (val: Print): val is InitiateOutboundPrint =>
  val.topic === 'initiate-outbound';
export const isFinalizeOutboundPrint = (val: Print): val is FinalizeOutboundPrint =>
  val.topic === 'finalize-outbound';
export const isRevokeOutboundPrint = (val: Print): val is RevokeOutboundPrint =>
  val.topic === 'revoke-outbound';

export function getEventWithPrint<T extends Print>(prints: Print[], topic: T['topic']): T {
  const [found] = prints.filter(p => p.topic === topic);
  if (typeof found === 'undefined') {
    throw new Error(`No print with topic '${topic}'`);
  }
  return found as T;
}

export function getEscrowPrint(prints: Print[]) {
  return getEventWithPrint<EscrowPrint>(prints, 'escrow');
}
export function getFinalizeInboundPrint(prints: Print[]) {
  return getEventWithPrint<FinalizeInboundPrint>(prints, 'finalize-inbound');
}
export function getRevokeInboundPrint(prints: Print[]) {
  return getEventWithPrint<RevokeInboundPrint>(prints, 'revoke-inbound');
}
export function getInitiateOutboundPrint(prints: Print[]) {
  return getEventWithPrint<InitiateOutboundPrint>(prints, 'initiate-outbound');
}
export function getFinalizeOutboundPrint(prints: Print[]) {
  return getEventWithPrint<FinalizeOutboundPrint>(prints, 'finalize-outbound');
}
export function getRevokeOutboundPrint(prints: Print[]) {
  return getEventWithPrint<RevokeOutboundPrint>(prints, 'revoke-outbound');
}

export interface FormattedBridgeEvent extends BridgeEvent {
  description: string;
  title: string;
}

export function getPrintTitle(print: Print) {
  switch (print.topic) {
    case 'escrow':
      return 'Inbound swap started';
    case 'initiate-outbound':
      return 'Outbound swap started';
    case 'finalize-outbound':
      return 'Outbound swap finalized';
    case 'finalize-inbound':
      return 'Inbound swap finished';
    case 'revoke-inbound':
      return 'Inbound swap recovered';
    case 'revoke-outbound':
      return 'Outbound swap revoked';
  }
}

export function getPrintDescription(print: Print) {
  switch (print.topic) {
    case 'initiate-outbound':
      return `${satsToBtc(print.xbtc)} xBTC ${'\u279E'} ${satsToBtc(print.sats)} BTC`;
    case 'finalize-outbound':
      return `${satsToBtc(print.sats)} BTC to ${getOutboundAddress(print.hash, print.version)}`;
    case 'escrow':
      return `${satsToBtc(print.sats)} BTC ${'\u279E'} ${satsToBtc(print.xbtc)} xBTC`;
    case 'finalize-inbound':
      return `${satsToBtc(print.xbtc)} xBTC`;
    case 'revoke-inbound':
      return `BTC recovered in ${bytesToHex(print.txid)}`;
    case 'revoke-outbound':
      return `${satsToBtc(print.xbtc)} xBTC recovered`;
  }
}

export interface Event<T = Print> {
  txid: string;
  print: T;
  index: number;
}

export function getPrintFromRawEvent<T = Print>(event: ApiEvent): Event<T> | null {
  if (event.event_type !== 'smart_contract_log') {
    return null;
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const v = hexToCvValue(event.contract_log.value.hex);
  if ('topic' in v) {
    const print = v as T;
    return {
      txid: event.tx_id,
      index: event.event_index,
      print,
    };
  }
  return null;
}
