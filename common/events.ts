import { contracts } from './clarigen';
import type { TypedAbiFunction } from '@clarigen/core';

type ResponseType<T> = T extends TypedAbiFunction<unknown[], infer R> ? R : never;

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
  'swap-id': BigInt;
};

export type FinalizeOutboundPrint = OutboundSwapResponse & {
  topic: 'finalize-outbound';
  'swap-id': BigInt;
  txid: Uint8Array;
};

export type RevokeOutboundPrint = OutboundSwapResponse & {
  topic: 'revoke-outbound';
  'swap-id': BigInt;
};

export type Prints =
  | EscrowPrint
  | FinalizeInboundPrint
  | RevokeInboundPrint
  | InitiateOutboundPrint
  | FinalizeOutboundPrint
  | RevokeOutboundPrint;

export const isEscrowPrint = (val: Prints): val is EscrowPrint => val.topic === 'escrow';
export const isFinalizeInboundPrint = (val: Prints): val is FinalizeInboundPrint =>
  val.topic === 'finalize-inbound';
export const isRevokeInboundPrint = (val: Prints): val is RevokeInboundPrint =>
  val.topic === 'revoke-inbound';
export const isInitiateOutboundPrint = (val: Prints): val is InitiateOutboundPrint =>
  val.topic === 'initiate-outbound';
export const isFinalizeOutboundPrint = (val: Prints): val is FinalizeOutboundPrint =>
  val.topic === 'finalize-outbound';
export const isRevokeOutboundPrint = (val: Prints): val is RevokeOutboundPrint =>
  val.topic === 'revoke-outbound';

export function getEventWithPrint<T extends Prints>(prints: Prints[], topic: T['topic']): T {
  const [found] = prints.filter(p => p.topic === topic);
  if (typeof found === 'undefined') {
    throw new Error(`No print with topic '${topic}'`);
  }
  return found as T;
}

export function getEscrowPrint(prints: Prints[]) {
  return getEventWithPrint<EscrowPrint>(prints, 'escrow');
}
export function getFinalizeInboundPrint(prints: Prints[]) {
  return getEventWithPrint<FinalizeInboundPrint>(prints, 'finalize-inbound');
}
export function getRevokeInboundPrint(prints: Prints[]) {
  return getEventWithPrint<RevokeInboundPrint>(prints, 'revoke-inbound');
}
export function getInitiateOutboundPrint(prints: Prints[]) {
  return getEventWithPrint<InitiateOutboundPrint>(prints, 'initiate-outbound');
}
export function getFinalizeOutboundPrint(prints: Prints[]) {
  return getEventWithPrint<FinalizeOutboundPrint>(prints, 'finalize-outbound');
}
export function getRevokeOutboundPrint(prints: Prints[]) {
  return getEventWithPrint<RevokeOutboundPrint>(prints, 'revoke-outbound');
}
