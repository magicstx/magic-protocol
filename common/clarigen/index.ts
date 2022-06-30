export type ClarityAbiTypeBuffer = { buffer: { length: number } };
export type ClarityAbiTypeStringAscii = { 'string-ascii': { length: number } };
export type ClarityAbiTypeStringUtf8 = { 'string-utf8': { length: number } };
export type ClarityAbiTypeResponse = {
  response: { ok: ClarityAbiType; error: ClarityAbiType };
};
export type ClarityAbiTypeOptional = { optional: ClarityAbiType };
export type ClarityAbiTypeTuple = {
  tuple: { name: string; type: ClarityAbiType }[];
};
export type ClarityAbiTypeList = {
  list: { type: ClarityAbiType; length: number };
};

export type ClarityAbiTypeUInt128 = 'uint128';
export type ClarityAbiTypeInt128 = 'int128';
export type ClarityAbiTypeBool = 'bool';
export type ClarityAbiTypePrincipal = 'principal';
export type ClarityAbiTypeTraitReference = 'trait_reference';
export type ClarityAbiTypeNone = 'none';

export type ClarityAbiTypePrimitive =
  | ClarityAbiTypeUInt128
  | ClarityAbiTypeInt128
  | ClarityAbiTypeBool
  | ClarityAbiTypePrincipal
  | ClarityAbiTypeTraitReference
  | ClarityAbiTypeNone;

export type ClarityAbiType =
  | ClarityAbiTypePrimitive
  | ClarityAbiTypeBuffer
  | ClarityAbiTypeResponse
  | ClarityAbiTypeOptional
  | ClarityAbiTypeTuple
  | ClarityAbiTypeList
  | ClarityAbiTypeStringAscii
  | ClarityAbiTypeStringUtf8
  | ClarityAbiTypeTraitReference;

export interface ClarityAbiFunction {
  name: string;
  access: 'private' | 'public' | 'read_only';
  args: {
    name: string;
    type: ClarityAbiType;
  }[];
  outputs: {
    type: ClarityAbiType;
  };
}

export type TypedAbiFunction<T extends any[], R> = ClarityAbiFunction & {
  _t?: T;
  _r?: R;
};

export interface ClarityAbiVariable {
  name: string;
  access: 'variable' | 'constant';
  type: ClarityAbiType;
}

export type TypedAbiVariable<T> = ClarityAbiVariable & {
  defaultValue: T;
};

export interface ClarityAbiMap {
  name: string;
  key: ClarityAbiType;
  value: ClarityAbiType;
}

export type TypedAbiMap<K, V> = ClarityAbiMap & {
  _k?: K;
  _v?: V;
};

export interface ClarityAbiTypeFungibleToken {
  name: string;
}

export interface ClarityAbiTypeNonFungibleToken {
  name: string;
  type: ClarityAbiType;
}

export interface ClarityAbi {
  functions: ClarityAbiFunction[];
  variables: ClarityAbiVariable[];
  maps: ClarityAbiMap[];
  fungible_tokens: ClarityAbiTypeFungibleToken[];
  non_fungible_tokens: ClarityAbiTypeNonFungibleToken[];
}

export type TypedAbi = Readonly<{
  functions: {
    [key: string]: TypedAbiFunction<unknown[], unknown>;
  };
  variables: {
    [key: string]: TypedAbiVariable<unknown>;
  };
  maps: {
    [key: string]: TypedAbiMap<unknown, unknown>;
  };
  constants: {
    [key: string]: any;
  };
  fungible_tokens: Readonly<ClarityAbiTypeFungibleToken[]>;
  non_fungible_tokens: Readonly<ClarityAbiTypeNonFungibleToken[]>;
  contractName: string;
  contractFile?: string;
}>;

export interface ResponseOk<T, E> {
  value: T;
  isOk: true;
  _e?: E;
}

export interface ResponseErr<T, E> {
  value: E;
  isOk: false;
  _o?: T;
}

export type Response<Ok, Err> = ResponseOk<Ok, Err> | ResponseErr<Ok, Err>;

export function ok<T, Err = never>(value: T): ResponseOk<T, Err> {
  return {
    isOk: true,
    value,
  };
}

export function err<Ok = never, T = unknown>(value: T): ResponseErr<Ok, T> {
  return {
    isOk: false,
    value,
  };
}

export type OkType<R> = R extends ResponseOk<infer V, unknown> ? V : never;
export type ErrType<R> = R extends ResponseErr<unknown, infer V> ? V : never;

export const contracts = {
  bridge: {
    functions: {
      concatBuffsFold: {
        name: 'concat-buffs-fold',
        access: 'private',
        args: [
          { name: 'b', type: { buffer: { length: 32 } } },
          { name: 'result', type: { buffer: { length: 192 } } },
        ],
        outputs: { type: { buffer: { length: 192 } } },
      } as TypedAbiFunction<[b: Uint8Array, result: Uint8Array], Uint8Array>,
      transfer: {
        name: 'transfer',
        access: 'private',
        args: [
          { name: 'amount', type: 'uint128' },
          { name: 'sender', type: 'principal' },
          { name: 'recipient', type: 'principal' },
        ],
        outputs: { type: { response: { ok: 'bool', error: 'uint128' } } },
      } as TypedAbiFunction<
        [amount: number | bigint, sender: string, recipient: string],
        Response<boolean, bigint>
      >,
      updateUserInboundVolume: {
        name: 'update-user-inbound-volume',
        access: 'private',
        args: [
          { name: 'user', type: 'principal' },
          { name: 'amount', type: 'uint128' },
        ],
        outputs: { type: 'bool' },
      } as TypedAbiFunction<[user: string, amount: number | bigint], boolean>,
      updateUserOutboundVolume: {
        name: 'update-user-outbound-volume',
        access: 'private',
        args: [
          { name: 'user', type: 'principal' },
          { name: 'amount', type: 'uint128' },
        ],
        outputs: { type: 'bool' },
      } as TypedAbiFunction<[user: string, amount: number | bigint], boolean>,
      addFunds: {
        name: 'add-funds',
        access: 'public',
        args: [{ name: 'amount', type: 'uint128' }],
        outputs: { type: { response: { ok: 'uint128', error: 'uint128' } } },
      } as TypedAbiFunction<[amount: number | bigint], Response<bigint, bigint>>,
      escrowSwap: {
        name: 'escrow-swap',
        access: 'public',
        args: [
          {
            name: 'block',
            type: {
              tuple: [
                { name: 'header', type: { buffer: { length: 80 } } },
                { name: 'height', type: 'uint128' },
              ],
            },
          },
          { name: 'prev-blocks', type: { list: { type: { buffer: { length: 80 } }, length: 10 } } },
          { name: 'tx', type: { buffer: { length: 1024 } } },
          {
            name: 'proof',
            type: {
              tuple: [
                {
                  name: 'hashes',
                  type: { list: { type: { buffer: { length: 32 } }, length: 12 } },
                },
                { name: 'tree-depth', type: 'uint128' },
                { name: 'tx-index', type: 'uint128' },
              ],
            },
          },
          { name: 'output-index', type: 'uint128' },
          { name: 'sender', type: { buffer: { length: 33 } } },
          { name: 'recipient', type: { buffer: { length: 33 } } },
          { name: 'expiration-buff', type: { buffer: { length: 4 } } },
          { name: 'hash', type: { buffer: { length: 32 } } },
          { name: 'swapper-buff', type: { buffer: { length: 4 } } },
          { name: 'supplier-id', type: 'uint128' },
          { name: 'min-to-receive', type: 'uint128' },
        ],
        outputs: {
          type: {
            response: {
              ok: {
                tuple: [
                  { name: 'csv', type: 'uint128' },
                  { name: 'output-index', type: 'uint128' },
                  { name: 'redeem-script', type: { buffer: { length: 120 } } },
                  { name: 'sats', type: 'uint128' },
                  { name: 'sender-public-key', type: { buffer: { length: 33 } } },
                ],
              },
              error: 'uint128',
            },
          },
        },
      } as TypedAbiFunction<
        [
          block: {
            header: Uint8Array;
            height: bigint;
          },
          prevBlocks: Uint8Array[],
          tx: Uint8Array,
          proof: {
            hashes: Uint8Array[];
            'tree-depth': bigint;
            'tx-index': bigint;
          },
          outputIndex: number | bigint,
          sender: Uint8Array,
          recipient: Uint8Array,
          expirationBuff: Uint8Array,
          hash: Uint8Array,
          swapperBuff: Uint8Array,
          supplierId: number | bigint,
          minToReceive: number | bigint
        ],
        Response<
          {
            csv: bigint;
            'output-index': bigint;
            'redeem-script': Uint8Array;
            sats: bigint;
            'sender-public-key': Uint8Array;
          },
          bigint
        >
      >,
      finalizeOutboundSwap: {
        name: 'finalize-outbound-swap',
        access: 'public',
        args: [
          {
            name: 'block',
            type: {
              tuple: [
                { name: 'header', type: { buffer: { length: 80 } } },
                { name: 'height', type: 'uint128' },
              ],
            },
          },
          { name: 'prev-blocks', type: { list: { type: { buffer: { length: 80 } }, length: 10 } } },
          { name: 'tx', type: { buffer: { length: 1024 } } },
          {
            name: 'proof',
            type: {
              tuple: [
                {
                  name: 'hashes',
                  type: { list: { type: { buffer: { length: 32 } }, length: 12 } },
                },
                { name: 'tree-depth', type: 'uint128' },
                { name: 'tx-index', type: 'uint128' },
              ],
            },
          },
          { name: 'output-index', type: 'uint128' },
          { name: 'swap-id', type: 'uint128' },
        ],
        outputs: { type: { response: { ok: 'bool', error: 'uint128' } } },
      } as TypedAbiFunction<
        [
          block: {
            header: Uint8Array;
            height: bigint;
          },
          prevBlocks: Uint8Array[],
          tx: Uint8Array,
          proof: {
            hashes: Uint8Array[];
            'tree-depth': bigint;
            'tx-index': bigint;
          },
          outputIndex: number | bigint,
          swapId: number | bigint
        ],
        Response<boolean, bigint>
      >,
      finalizeSwap: {
        name: 'finalize-swap',
        access: 'public',
        args: [
          { name: 'txid', type: { buffer: { length: 32 } } },
          { name: 'preimage', type: { buffer: { length: 128 } } },
        ],
        outputs: {
          type: {
            response: {
              ok: {
                tuple: [
                  { name: 'expiration', type: 'uint128' },
                  { name: 'hash', type: { buffer: { length: 32 } } },
                  { name: 'supplier', type: 'uint128' },
                  { name: 'swapper', type: 'uint128' },
                  { name: 'xbtc', type: 'uint128' },
                ],
              },
              error: 'uint128',
            },
          },
        },
      } as TypedAbiFunction<
        [txid: Uint8Array, preimage: Uint8Array],
        Response<
          {
            expiration: bigint;
            hash: Uint8Array;
            supplier: bigint;
            swapper: bigint;
            xbtc: bigint;
          },
          bigint
        >
      >,
      initializeSwapper: {
        name: 'initialize-swapper',
        access: 'public',
        args: [],
        outputs: { type: { response: { ok: 'uint128', error: 'uint128' } } },
      } as TypedAbiFunction<[], Response<bigint, bigint>>,
      initiateOutboundSwap: {
        name: 'initiate-outbound-swap',
        access: 'public',
        args: [
          { name: 'xbtc', type: 'uint128' },
          { name: 'btc-version', type: { buffer: { length: 1 } } },
          { name: 'btc-hash', type: { buffer: { length: 20 } } },
          { name: 'supplier-id', type: 'uint128' },
        ],
        outputs: { type: { response: { ok: 'uint128', error: 'uint128' } } },
      } as TypedAbiFunction<
        [
          xbtc: number | bigint,
          btcVersion: Uint8Array,
          btcHash: Uint8Array,
          supplierId: number | bigint
        ],
        Response<bigint, bigint>
      >,
      registerSupplier: {
        name: 'register-supplier',
        access: 'public',
        args: [
          { name: 'public-key', type: { buffer: { length: 33 } } },
          { name: 'inbound-fee', type: { optional: 'int128' } },
          { name: 'outbound-fee', type: { optional: 'int128' } },
          { name: 'outbound-base-fee', type: 'int128' },
          { name: 'inbound-base-fee', type: 'int128' },
          { name: 'funds', type: 'uint128' },
        ],
        outputs: { type: { response: { ok: 'uint128', error: 'uint128' } } },
      } as TypedAbiFunction<
        [
          publicKey: Uint8Array,
          inboundFee: bigint | null,
          outboundFee: bigint | null,
          outboundBaseFee: number | bigint,
          inboundBaseFee: number | bigint,
          funds: number | bigint
        ],
        Response<bigint, bigint>
      >,
      removeFunds: {
        name: 'remove-funds',
        access: 'public',
        args: [{ name: 'amount', type: 'uint128' }],
        outputs: { type: { response: { ok: 'uint128', error: 'uint128' } } },
      } as TypedAbiFunction<[amount: number | bigint], Response<bigint, bigint>>,
      revokeExpiredInbound: {
        name: 'revoke-expired-inbound',
        access: 'public',
        args: [{ name: 'txid', type: { buffer: { length: 32 } } }],
        outputs: {
          type: {
            response: {
              ok: {
                tuple: [
                  { name: 'expiration', type: 'uint128' },
                  { name: 'hash', type: { buffer: { length: 32 } } },
                  { name: 'supplier', type: 'uint128' },
                  { name: 'swapper', type: 'uint128' },
                  { name: 'xbtc', type: 'uint128' },
                ],
              },
              error: 'uint128',
            },
          },
        },
      } as TypedAbiFunction<
        [txid: Uint8Array],
        Response<
          {
            expiration: bigint;
            hash: Uint8Array;
            supplier: bigint;
            swapper: bigint;
            xbtc: bigint;
          },
          bigint
        >
      >,
      revokeExpiredOutbound: {
        name: 'revoke-expired-outbound',
        access: 'public',
        args: [{ name: 'swap-id', type: 'uint128' }],
        outputs: {
          type: {
            response: {
              ok: {
                tuple: [
                  { name: 'created-at', type: 'uint128' },
                  { name: 'hash', type: { buffer: { length: 20 } } },
                  { name: 'sats', type: 'uint128' },
                  { name: 'supplier', type: 'uint128' },
                  { name: 'swapper', type: 'principal' },
                  { name: 'version', type: { buffer: { length: 1 } } },
                  { name: 'xbtc', type: 'uint128' },
                ],
              },
              error: 'uint128',
            },
          },
        },
      } as TypedAbiFunction<
        [swapId: number | bigint],
        Response<
          {
            'created-at': bigint;
            hash: Uint8Array;
            sats: bigint;
            supplier: bigint;
            swapper: string;
            version: Uint8Array;
            xbtc: bigint;
          },
          bigint
        >
      >,
      updateSupplierFees: {
        name: 'update-supplier-fees',
        access: 'public',
        args: [
          { name: 'inbound-fee', type: { optional: 'int128' } },
          { name: 'outbound-fee', type: { optional: 'int128' } },
          { name: 'outbound-base-fee', type: 'int128' },
          { name: 'inbound-base-fee', type: 'int128' },
        ],
        outputs: {
          type: {
            response: {
              ok: {
                tuple: [
                  { name: 'controller', type: 'principal' },
                  { name: 'inbound-base-fee', type: 'int128' },
                  { name: 'inbound-fee', type: { optional: 'int128' } },
                  { name: 'outbound-base-fee', type: 'int128' },
                  { name: 'outbound-fee', type: { optional: 'int128' } },
                  { name: 'public-key', type: { buffer: { length: 33 } } },
                ],
              },
              error: 'uint128',
            },
          },
        },
      } as TypedAbiFunction<
        [
          inboundFee: bigint | null,
          outboundFee: bigint | null,
          outboundBaseFee: number | bigint,
          inboundBaseFee: number | bigint
        ],
        Response<
          {
            controller: string;
            'inbound-base-fee': bigint;
            'inbound-fee': bigint | null;
            'outbound-base-fee': bigint;
            'outbound-fee': bigint | null;
            'public-key': Uint8Array;
          },
          bigint
        >
      >,
      updateSupplierPublicKey: {
        name: 'update-supplier-public-key',
        access: 'public',
        args: [{ name: 'public-key', type: { buffer: { length: 33 } } }],
        outputs: {
          type: {
            response: {
              ok: {
                tuple: [
                  { name: 'controller', type: 'principal' },
                  { name: 'inbound-base-fee', type: 'int128' },
                  { name: 'inbound-fee', type: { optional: 'int128' } },
                  { name: 'outbound-base-fee', type: 'int128' },
                  { name: 'outbound-fee', type: { optional: 'int128' } },
                  { name: 'public-key', type: { buffer: { length: 33 } } },
                ],
              },
              error: 'uint128',
            },
          },
        },
      } as TypedAbiFunction<
        [publicKey: Uint8Array],
        Response<
          {
            controller: string;
            'inbound-base-fee': bigint;
            'inbound-fee': bigint | null;
            'outbound-base-fee': bigint;
            'outbound-fee': bigint | null;
            'public-key': Uint8Array;
          },
          bigint
        >
      >,
      buffToU8: {
        name: 'buff-to-u8',
        access: 'read_only',
        args: [{ name: 'byte', type: { buffer: { length: 1 } } }],
        outputs: { type: 'uint128' },
      } as TypedAbiFunction<[byte: Uint8Array], bigint>,
      bytesLen: {
        name: 'bytes-len',
        access: 'read_only',
        args: [{ name: 'bytes', type: { buffer: { length: 4 } } }],
        outputs: { type: { buffer: { length: 1 } } },
      } as TypedAbiFunction<[bytes: Uint8Array], Uint8Array>,
      concatBuffs: {
        name: 'concat-buffs',
        access: 'read_only',
        args: [{ name: 'buffs', type: { list: { type: { buffer: { length: 32 } }, length: 6 } } }],
        outputs: { type: { buffer: { length: 192 } } },
      } as TypedAbiFunction<[buffs: Uint8Array[]], Uint8Array>,
      generateHtlcScript: {
        name: 'generate-htlc-script',
        access: 'read_only',
        args: [
          { name: 'sender', type: { buffer: { length: 33 } } },
          { name: 'recipient', type: { buffer: { length: 33 } } },
          { name: 'expiration', type: { buffer: { length: 4 } } },
          { name: 'hash', type: { buffer: { length: 32 } } },
          { name: 'swapper', type: { buffer: { length: 4 } } },
        ],
        outputs: { type: { buffer: { length: 120 } } },
      } as TypedAbiFunction<
        [
          sender: Uint8Array,
          recipient: Uint8Array,
          expiration: Uint8Array,
          hash: Uint8Array,
          swapper: Uint8Array
        ],
        Uint8Array
      >,
      generateHtlcScriptHash: {
        name: 'generate-htlc-script-hash',
        access: 'read_only',
        args: [
          { name: 'sender', type: { buffer: { length: 33 } } },
          { name: 'recipient', type: { buffer: { length: 33 } } },
          { name: 'expiration', type: { buffer: { length: 4 } } },
          { name: 'hash', type: { buffer: { length: 32 } } },
          { name: 'swapper', type: { buffer: { length: 4 } } },
        ],
        outputs: { type: { buffer: { length: 23 } } },
      } as TypedAbiFunction<
        [
          sender: Uint8Array,
          recipient: Uint8Array,
          expiration: Uint8Array,
          hash: Uint8Array,
          swapper: Uint8Array
        ],
        Uint8Array
      >,
      generateOutput: {
        name: 'generate-output',
        access: 'read_only',
        args: [
          { name: 'version', type: { buffer: { length: 1 } } },
          { name: 'hash', type: { buffer: { length: 20 } } },
        ],
        outputs: { type: { buffer: { length: 25 } } },
      } as TypedAbiFunction<[version: Uint8Array, hash: Uint8Array], Uint8Array>,
      generateP2pkhOutput: {
        name: 'generate-p2pkh-output',
        access: 'read_only',
        args: [{ name: 'hash', type: { buffer: { length: 20 } } }],
        outputs: { type: { buffer: { length: 25 } } },
      } as TypedAbiFunction<[hash: Uint8Array], Uint8Array>,
      generateP2shOutput: {
        name: 'generate-p2sh-output',
        access: 'read_only',
        args: [{ name: 'hash', type: { buffer: { length: 20 } } }],
        outputs: { type: { buffer: { length: 23 } } },
      } as TypedAbiFunction<[hash: Uint8Array], Uint8Array>,
      generateScriptHash: {
        name: 'generate-script-hash',
        access: 'read_only',
        args: [{ name: 'script', type: { buffer: { length: 120 } } }],
        outputs: { type: { buffer: { length: 23 } } },
      } as TypedAbiFunction<[script: Uint8Array], Uint8Array>,
      getAmountWithFeeRate: {
        name: 'get-amount-with-fee-rate',
        access: 'read_only',
        args: [
          { name: 'amount', type: 'uint128' },
          { name: 'fee-rate', type: 'int128' },
        ],
        outputs: { type: 'int128' },
      } as TypedAbiFunction<[amount: number | bigint, feeRate: number | bigint], bigint>,
      getCompletedOutboundSwapByTxid: {
        name: 'get-completed-outbound-swap-by-txid',
        access: 'read_only',
        args: [{ name: 'txid', type: { buffer: { length: 32 } } }],
        outputs: { type: { optional: 'uint128' } },
      } as TypedAbiFunction<[txid: Uint8Array], bigint | null>,
      getCompletedOutboundSwapTxid: {
        name: 'get-completed-outbound-swap-txid',
        access: 'read_only',
        args: [{ name: 'id', type: 'uint128' }],
        outputs: { type: { optional: { buffer: { length: 32 } } } },
      } as TypedAbiFunction<[id: number | bigint], Uint8Array | null>,
      getEscrow: {
        name: 'get-escrow',
        access: 'read_only',
        args: [{ name: 'id', type: 'uint128' }],
        outputs: { type: { optional: 'uint128' } },
      } as TypedAbiFunction<[id: number | bigint], bigint | null>,
      getFullInbound: {
        name: 'get-full-inbound',
        access: 'read_only',
        args: [{ name: 'txid', type: { buffer: { length: 32 } } }],
        outputs: {
          type: {
            response: {
              ok: {
                tuple: [
                  { name: 'csv', type: 'uint128' },
                  { name: 'expiration', type: 'uint128' },
                  { name: 'hash', type: { buffer: { length: 32 } } },
                  { name: 'output-index', type: 'uint128' },
                  { name: 'redeem-script', type: { buffer: { length: 120 } } },
                  { name: 'sats', type: 'uint128' },
                  { name: 'sender-public-key', type: { buffer: { length: 33 } } },
                  { name: 'supplier', type: 'uint128' },
                  { name: 'swapper', type: 'uint128' },
                  { name: 'swapper-principal', type: 'principal' },
                  { name: 'xbtc', type: 'uint128' },
                ],
              },
              error: 'uint128',
            },
          },
        },
      } as TypedAbiFunction<
        [txid: Uint8Array],
        Response<
          {
            csv: bigint;
            expiration: bigint;
            hash: Uint8Array;
            'output-index': bigint;
            'redeem-script': Uint8Array;
            sats: bigint;
            'sender-public-key': Uint8Array;
            supplier: bigint;
            swapper: bigint;
            'swapper-principal': string;
            xbtc: bigint;
          },
          bigint
        >
      >,
      getFullSupplier: {
        name: 'get-full-supplier',
        access: 'read_only',
        args: [{ name: 'id', type: 'uint128' }],
        outputs: {
          type: {
            response: {
              ok: {
                tuple: [
                  { name: 'controller', type: 'principal' },
                  { name: 'escrow', type: 'uint128' },
                  { name: 'funds', type: 'uint128' },
                  { name: 'inbound-base-fee', type: 'int128' },
                  { name: 'inbound-fee', type: { optional: 'int128' } },
                  { name: 'outbound-base-fee', type: 'int128' },
                  { name: 'outbound-fee', type: { optional: 'int128' } },
                  { name: 'public-key', type: { buffer: { length: 33 } } },
                ],
              },
              error: 'uint128',
            },
          },
        },
      } as TypedAbiFunction<
        [id: number | bigint],
        Response<
          {
            controller: string;
            escrow: bigint;
            funds: bigint;
            'inbound-base-fee': bigint;
            'inbound-fee': bigint | null;
            'outbound-base-fee': bigint;
            'outbound-fee': bigint | null;
            'public-key': Uint8Array;
          },
          bigint
        >
      >,
      getFunds: {
        name: 'get-funds',
        access: 'read_only',
        args: [{ name: 'id', type: 'uint128' }],
        outputs: { type: 'uint128' },
      } as TypedAbiFunction<[id: number | bigint], bigint>,
      getInboundMeta: {
        name: 'get-inbound-meta',
        access: 'read_only',
        args: [{ name: 'txid', type: { buffer: { length: 32 } } }],
        outputs: {
          type: {
            optional: {
              tuple: [
                { name: 'csv', type: 'uint128' },
                { name: 'output-index', type: 'uint128' },
                { name: 'redeem-script', type: { buffer: { length: 120 } } },
                { name: 'sats', type: 'uint128' },
                { name: 'sender-public-key', type: { buffer: { length: 33 } } },
              ],
            },
          },
        },
      } as TypedAbiFunction<
        [txid: Uint8Array],
        {
          csv: bigint;
          'output-index': bigint;
          'redeem-script': Uint8Array;
          sats: bigint;
          'sender-public-key': Uint8Array;
        } | null
      >,
      getInboundSwap: {
        name: 'get-inbound-swap',
        access: 'read_only',
        args: [{ name: 'txid', type: { buffer: { length: 32 } } }],
        outputs: {
          type: {
            optional: {
              tuple: [
                { name: 'expiration', type: 'uint128' },
                { name: 'hash', type: { buffer: { length: 32 } } },
                { name: 'supplier', type: 'uint128' },
                { name: 'swapper', type: 'uint128' },
                { name: 'xbtc', type: 'uint128' },
              ],
            },
          },
        },
      } as TypedAbiFunction<
        [txid: Uint8Array],
        {
          expiration: bigint;
          hash: Uint8Array;
          supplier: bigint;
          swapper: bigint;
          xbtc: bigint;
        } | null
      >,
      getNextOutboundId: {
        name: 'get-next-outbound-id',
        access: 'read_only',
        args: [],
        outputs: { type: 'uint128' },
      } as TypedAbiFunction<[], bigint>,
      getNextSupplierId: {
        name: 'get-next-supplier-id',
        access: 'read_only',
        args: [],
        outputs: { type: 'uint128' },
      } as TypedAbiFunction<[], bigint>,
      getNextSwapperId: {
        name: 'get-next-swapper-id',
        access: 'read_only',
        args: [],
        outputs: { type: 'uint128' },
      } as TypedAbiFunction<[], bigint>,
      getOutboundSwap: {
        name: 'get-outbound-swap',
        access: 'read_only',
        args: [{ name: 'id', type: 'uint128' }],
        outputs: {
          type: {
            optional: {
              tuple: [
                { name: 'created-at', type: 'uint128' },
                { name: 'hash', type: { buffer: { length: 20 } } },
                { name: 'sats', type: 'uint128' },
                { name: 'supplier', type: 'uint128' },
                { name: 'swapper', type: 'principal' },
                { name: 'version', type: { buffer: { length: 1 } } },
                { name: 'xbtc', type: 'uint128' },
              ],
            },
          },
        },
      } as TypedAbiFunction<
        [id: number | bigint],
        {
          'created-at': bigint;
          hash: Uint8Array;
          sats: bigint;
          supplier: bigint;
          swapper: string;
          version: Uint8Array;
          xbtc: bigint;
        } | null
      >,
      getPreimage: {
        name: 'get-preimage',
        access: 'read_only',
        args: [{ name: 'txid', type: { buffer: { length: 32 } } }],
        outputs: { type: { optional: { buffer: { length: 128 } } } },
      } as TypedAbiFunction<[txid: Uint8Array], Uint8Array | null>,
      getSupplier: {
        name: 'get-supplier',
        access: 'read_only',
        args: [{ name: 'id', type: 'uint128' }],
        outputs: {
          type: {
            optional: {
              tuple: [
                { name: 'controller', type: 'principal' },
                { name: 'inbound-base-fee', type: 'int128' },
                { name: 'inbound-fee', type: { optional: 'int128' } },
                { name: 'outbound-base-fee', type: 'int128' },
                { name: 'outbound-fee', type: { optional: 'int128' } },
                { name: 'public-key', type: { buffer: { length: 33 } } },
              ],
            },
          },
        },
      } as TypedAbiFunction<
        [id: number | bigint],
        {
          controller: string;
          'inbound-base-fee': bigint;
          'inbound-fee': bigint | null;
          'outbound-base-fee': bigint;
          'outbound-fee': bigint | null;
          'public-key': Uint8Array;
        } | null
      >,
      getSupplierIdByController: {
        name: 'get-supplier-id-by-controller',
        access: 'read_only',
        args: [{ name: 'controller', type: 'principal' }],
        outputs: { type: { optional: 'uint128' } },
      } as TypedAbiFunction<[controller: string], bigint | null>,
      getSupplierIdByPublicKey: {
        name: 'get-supplier-id-by-public-key',
        access: 'read_only',
        args: [{ name: 'public-key', type: { buffer: { length: 33 } } }],
        outputs: { type: { optional: 'uint128' } },
      } as TypedAbiFunction<[publicKey: Uint8Array], bigint | null>,
      getSwapAmount: {
        name: 'get-swap-amount',
        access: 'read_only',
        args: [
          { name: 'amount', type: 'uint128' },
          { name: 'fee-rate', type: 'int128' },
          { name: 'base-fee', type: 'int128' },
        ],
        outputs: { type: { response: { ok: 'uint128', error: 'uint128' } } },
      } as TypedAbiFunction<
        [amount: number | bigint, feeRate: number | bigint, baseFee: number | bigint],
        Response<bigint, bigint>
      >,
      getSwapperId: {
        name: 'get-swapper-id',
        access: 'read_only',
        args: [{ name: 'swapper', type: 'principal' }],
        outputs: { type: { optional: 'uint128' } },
      } as TypedAbiFunction<[swapper: string], bigint | null>,
      getSwapperPrincipal: {
        name: 'get-swapper-principal',
        access: 'read_only',
        args: [{ name: 'id', type: 'uint128' }],
        outputs: { type: { optional: 'principal' } },
      } as TypedAbiFunction<[id: number | bigint], string | null>,
      getTotalInboundVolume: {
        name: 'get-total-inbound-volume',
        access: 'read_only',
        args: [],
        outputs: { type: 'uint128' },
      } as TypedAbiFunction<[], bigint>,
      getTotalOutboundVolume: {
        name: 'get-total-outbound-volume',
        access: 'read_only',
        args: [],
        outputs: { type: 'uint128' },
      } as TypedAbiFunction<[], bigint>,
      getTotalVolume: {
        name: 'get-total-volume',
        access: 'read_only',
        args: [],
        outputs: { type: 'uint128' },
      } as TypedAbiFunction<[], bigint>,
      getUserInboundVolume: {
        name: 'get-user-inbound-volume',
        access: 'read_only',
        args: [{ name: 'user', type: 'principal' }],
        outputs: { type: 'uint128' },
      } as TypedAbiFunction<[user: string], bigint>,
      getUserOutboundVolume: {
        name: 'get-user-outbound-volume',
        access: 'read_only',
        args: [{ name: 'user', type: 'principal' }],
        outputs: { type: 'uint128' },
      } as TypedAbiFunction<[user: string], bigint>,
      getUserTotalVolume: {
        name: 'get-user-total-volume',
        access: 'read_only',
        args: [{ name: 'user', type: 'principal' }],
        outputs: { type: 'uint128' },
      } as TypedAbiFunction<[user: string], bigint>,
      readUint32: {
        name: 'read-uint32',
        access: 'read_only',
        args: [
          { name: 'num', type: { buffer: { length: 4 } } },
          { name: 'length', type: 'uint128' },
        ],
        outputs: { type: { response: { ok: 'uint128', error: 'uint128' } } },
      } as TypedAbiFunction<[num: Uint8Array, length: number | bigint], Response<bigint, bigint>>,
      validateBtcAddr: {
        name: 'validate-btc-addr',
        access: 'read_only',
        args: [
          { name: 'version', type: { buffer: { length: 1 } } },
          { name: 'hash', type: { buffer: { length: 20 } } },
        ],
        outputs: { type: { response: { ok: 'bool', error: 'uint128' } } },
      } as TypedAbiFunction<[version: Uint8Array, hash: Uint8Array], Response<boolean, bigint>>,
      validateExpiration: {
        name: 'validate-expiration',
        access: 'read_only',
        args: [
          { name: 'expiration', type: 'uint128' },
          { name: 'mined-height', type: 'uint128' },
        ],
        outputs: { type: { response: { ok: 'bool', error: 'uint128' } } },
      } as TypedAbiFunction<
        [expiration: number | bigint, minedHeight: number | bigint],
        Response<boolean, bigint>
      >,
      validateFee: {
        name: 'validate-fee',
        access: 'read_only',
        args: [{ name: 'fee-opt', type: { optional: 'int128' } }],
        outputs: { type: { response: { ok: 'bool', error: 'uint128' } } },
      } as TypedAbiFunction<[feeOpt: bigint | null], Response<boolean, bigint>>,
      validateOutboundRevocable: {
        name: 'validate-outbound-revocable',
        access: 'read_only',
        args: [{ name: 'swap-id', type: 'uint128' }],
        outputs: {
          type: {
            response: {
              ok: {
                tuple: [
                  { name: 'created-at', type: 'uint128' },
                  { name: 'hash', type: { buffer: { length: 20 } } },
                  { name: 'sats', type: 'uint128' },
                  { name: 'supplier', type: 'uint128' },
                  { name: 'swapper', type: 'principal' },
                  { name: 'version', type: { buffer: { length: 1 } } },
                  { name: 'xbtc', type: 'uint128' },
                ],
              },
              error: 'uint128',
            },
          },
        },
      } as TypedAbiFunction<
        [swapId: number | bigint],
        Response<
          {
            'created-at': bigint;
            hash: Uint8Array;
            sats: bigint;
            supplier: bigint;
            swapper: string;
            version: Uint8Array;
            xbtc: bigint;
          },
          bigint
        >
      >,
    },
    maps: {
      completedOutboundSwapTxids: {
        name: 'completed-outbound-swap-txids',
        key: { buffer: { length: 32 } },
        value: 'uint128',
      } as TypedAbiMap<Uint8Array, bigint>,
      completedOutboundSwaps: {
        name: 'completed-outbound-swaps',
        key: 'uint128',
        value: { buffer: { length: 32 } },
      } as TypedAbiMap<bigint, Uint8Array>,
      inboundMeta: {
        name: 'inbound-meta',
        key: { buffer: { length: 32 } },
        value: {
          tuple: [
            { name: 'csv', type: 'uint128' },
            { name: 'output-index', type: 'uint128' },
            { name: 'redeem-script', type: { buffer: { length: 120 } } },
            { name: 'sats', type: 'uint128' },
            { name: 'sender-public-key', type: { buffer: { length: 33 } } },
          ],
        },
      } as TypedAbiMap<
        Uint8Array,
        {
          csv: bigint;
          'output-index': bigint;
          'redeem-script': Uint8Array;
          sats: bigint;
          'sender-public-key': Uint8Array;
        }
      >,
      inboundPreimages: {
        name: 'inbound-preimages',
        key: { buffer: { length: 32 } },
        value: { buffer: { length: 128 } },
      } as TypedAbiMap<Uint8Array, Uint8Array>,
      inboundSwaps: {
        name: 'inbound-swaps',
        key: { buffer: { length: 32 } },
        value: {
          tuple: [
            { name: 'expiration', type: 'uint128' },
            { name: 'hash', type: { buffer: { length: 32 } } },
            { name: 'supplier', type: 'uint128' },
            { name: 'swapper', type: 'uint128' },
            { name: 'xbtc', type: 'uint128' },
          ],
        },
      } as TypedAbiMap<
        Uint8Array,
        {
          expiration: bigint;
          hash: Uint8Array;
          supplier: bigint;
          swapper: bigint;
          xbtc: bigint;
        }
      >,
      outboundSwaps: {
        name: 'outbound-swaps',
        key: 'uint128',
        value: {
          tuple: [
            { name: 'created-at', type: 'uint128' },
            { name: 'hash', type: { buffer: { length: 20 } } },
            { name: 'sats', type: 'uint128' },
            { name: 'supplier', type: 'uint128' },
            { name: 'swapper', type: 'principal' },
            { name: 'version', type: { buffer: { length: 1 } } },
            { name: 'xbtc', type: 'uint128' },
          ],
        },
      } as TypedAbiMap<
        bigint,
        {
          'created-at': bigint;
          hash: Uint8Array;
          sats: bigint;
          supplier: bigint;
          swapper: string;
          version: Uint8Array;
          xbtc: bigint;
        }
      >,
      supplierByController: {
        name: 'supplier-by-controller',
        key: 'principal',
        value: 'uint128',
      } as TypedAbiMap<string, bigint>,
      supplierById: {
        name: 'supplier-by-id',
        key: 'uint128',
        value: {
          tuple: [
            { name: 'controller', type: 'principal' },
            { name: 'inbound-base-fee', type: 'int128' },
            { name: 'inbound-fee', type: { optional: 'int128' } },
            { name: 'outbound-base-fee', type: 'int128' },
            { name: 'outbound-fee', type: { optional: 'int128' } },
            { name: 'public-key', type: { buffer: { length: 33 } } },
          ],
        },
      } as TypedAbiMap<
        bigint,
        {
          controller: string;
          'inbound-base-fee': bigint;
          'inbound-fee': bigint | null;
          'outbound-base-fee': bigint;
          'outbound-fee': bigint | null;
          'public-key': Uint8Array;
        }
      >,
      supplierByPublicKey: {
        name: 'supplier-by-public-key',
        key: { buffer: { length: 33 } },
        value: 'uint128',
      } as TypedAbiMap<Uint8Array, bigint>,
      supplierEscrow: { name: 'supplier-escrow', key: 'uint128', value: 'uint128' } as TypedAbiMap<
        bigint,
        bigint
      >,
      supplierFunds: { name: 'supplier-funds', key: 'uint128', value: 'uint128' } as TypedAbiMap<
        bigint,
        bigint
      >,
      swapperById: { name: 'swapper-by-id', key: 'uint128', value: 'principal' } as TypedAbiMap<
        bigint,
        string
      >,
      swapperByPrincipal: {
        name: 'swapper-by-principal',
        key: 'principal',
        value: 'uint128',
      } as TypedAbiMap<string, bigint>,
      userInboundVolumeMap: {
        name: 'user-inbound-volume-map',
        key: 'principal',
        value: 'uint128',
      } as TypedAbiMap<string, bigint>,
      userOutboundVolumeMap: {
        name: 'user-outbound-volume-map',
        key: 'principal',
        value: 'uint128',
      } as TypedAbiMap<string, bigint>,
    },
    variables: {
      bUFF_TO_BYTE: {
        name: 'BUFF_TO_BYTE',
        type: {
          list: {
            type: {
              buffer: {
                length: 1,
              },
            },
            length: 256,
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Uint8Array[]>,
      eRR_ADD_FUNDS: {
        name: 'ERR_ADD_FUNDS',
        type: {
          response: {
            ok: 'none',
            error: 'uint128',
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Response<null, bigint>>,
      eRR_ALREADY_FINALIZED: {
        name: 'ERR_ALREADY_FINALIZED',
        type: {
          response: {
            ok: 'none',
            error: 'uint128',
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Response<null, bigint>>,
      eRR_ESCROW_EXPIRED: {
        name: 'ERR_ESCROW_EXPIRED',
        type: {
          response: {
            ok: 'none',
            error: 'uint128',
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Response<null, bigint>>,
      eRR_FEE_INVALID: {
        name: 'ERR_FEE_INVALID',
        type: {
          response: {
            ok: 'none',
            error: 'uint128',
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Response<null, bigint>>,
      eRR_INCONSISTENT_FEES: {
        name: 'ERR_INCONSISTENT_FEES',
        type: {
          response: {
            ok: 'none',
            error: 'uint128',
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Response<null, bigint>>,
      eRR_INSUFFICIENT_AMOUNT: {
        name: 'ERR_INSUFFICIENT_AMOUNT',
        type: {
          response: {
            ok: 'none',
            error: 'uint128',
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Response<null, bigint>>,
      eRR_INSUFFICIENT_FUNDS: {
        name: 'ERR_INSUFFICIENT_FUNDS',
        type: {
          response: {
            ok: 'none',
            error: 'uint128',
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Response<null, bigint>>,
      eRR_INVALID_BTC_ADDR: {
        name: 'ERR_INVALID_BTC_ADDR',
        type: {
          response: {
            ok: 'none',
            error: 'uint128',
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Response<null, bigint>>,
      eRR_INVALID_ESCROW: {
        name: 'ERR_INVALID_ESCROW',
        type: {
          response: {
            ok: 'none',
            error: 'uint128',
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Response<null, bigint>>,
      eRR_INVALID_EXPIRATION: {
        name: 'ERR_INVALID_EXPIRATION',
        type: {
          response: {
            ok: 'none',
            error: 'uint128',
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Response<null, bigint>>,
      eRR_INVALID_HASH: {
        name: 'ERR_INVALID_HASH',
        type: {
          response: {
            ok: 'none',
            error: 'uint128',
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Response<null, bigint>>,
      eRR_INVALID_OUTPUT: {
        name: 'ERR_INVALID_OUTPUT',
        type: {
          response: {
            ok: 'none',
            error: 'uint128',
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Response<null, bigint>>,
      eRR_INVALID_PREIMAGE: {
        name: 'ERR_INVALID_PREIMAGE',
        type: {
          response: {
            ok: 'none',
            error: 'uint128',
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Response<null, bigint>>,
      eRR_INVALID_SUPPLIER: {
        name: 'ERR_INVALID_SUPPLIER',
        type: {
          response: {
            ok: 'none',
            error: 'uint128',
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Response<null, bigint>>,
      eRR_INVALID_TX: {
        name: 'ERR_INVALID_TX',
        type: {
          response: {
            ok: 'none',
            error: 'uint128',
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Response<null, bigint>>,
      eRR_PANIC: {
        name: 'ERR_PANIC',
        type: {
          response: {
            ok: 'none',
            error: 'uint128',
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Response<null, bigint>>,
      eRR_READ_UINT: {
        name: 'ERR_READ_UINT',
        type: {
          response: {
            ok: 'none',
            error: 'uint128',
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Response<null, bigint>>,
      eRR_REVOKE_INBOUND_IS_FINALIZED: {
        name: 'ERR_REVOKE_INBOUND_IS_FINALIZED',
        type: {
          response: {
            ok: 'none',
            error: 'uint128',
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Response<null, bigint>>,
      eRR_REVOKE_INBOUND_NOT_EXPIRED: {
        name: 'ERR_REVOKE_INBOUND_NOT_EXPIRED',
        type: {
          response: {
            ok: 'none',
            error: 'uint128',
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Response<null, bigint>>,
      eRR_REVOKE_OUTBOUND_IS_FINALIZED: {
        name: 'ERR_REVOKE_OUTBOUND_IS_FINALIZED',
        type: {
          response: {
            ok: 'none',
            error: 'uint128',
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Response<null, bigint>>,
      eRR_REVOKE_OUTBOUND_NOT_EXPIRED: {
        name: 'ERR_REVOKE_OUTBOUND_NOT_EXPIRED',
        type: {
          response: {
            ok: 'none',
            error: 'uint128',
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Response<null, bigint>>,
      eRR_SUPPLIER_EXISTS: {
        name: 'ERR_SUPPLIER_EXISTS',
        type: {
          response: {
            ok: 'none',
            error: 'uint128',
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Response<null, bigint>>,
      eRR_SUPPLIER_NOT_FOUND: {
        name: 'ERR_SUPPLIER_NOT_FOUND',
        type: {
          response: {
            ok: 'none',
            error: 'uint128',
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Response<null, bigint>>,
      eRR_SWAPPER_EXISTS: {
        name: 'ERR_SWAPPER_EXISTS',
        type: {
          response: {
            ok: 'none',
            error: 'uint128',
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Response<null, bigint>>,
      eRR_SWAPPER_NOT_FOUND: {
        name: 'ERR_SWAPPER_NOT_FOUND',
        type: {
          response: {
            ok: 'none',
            error: 'uint128',
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Response<null, bigint>>,
      eRR_SWAP_NOT_FOUND: {
        name: 'ERR_SWAP_NOT_FOUND',
        type: {
          response: {
            ok: 'none',
            error: 'uint128',
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Response<null, bigint>>,
      eRR_TRANSFER: {
        name: 'ERR_TRANSFER',
        type: {
          response: {
            ok: 'none',
            error: 'uint128',
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Response<null, bigint>>,
      eRR_TXID_USED: {
        name: 'ERR_TXID_USED',
        type: {
          response: {
            ok: 'none',
            error: 'uint128',
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Response<null, bigint>>,
      eRR_TX_NOT_MINED: {
        name: 'ERR_TX_NOT_MINED',
        type: {
          response: {
            ok: 'none',
            error: 'uint128',
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Response<null, bigint>>,
      eRR_UNAUTHORIZED: {
        name: 'ERR_UNAUTHORIZED',
        type: {
          response: {
            ok: 'none',
            error: 'uint128',
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Response<null, bigint>>,
      eSCROW_EXPIRATION: {
        name: 'ESCROW_EXPIRATION',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      mIN_EXPIRATION: {
        name: 'MIN_EXPIRATION',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      oUTBOUND_EXPIRATION: {
        name: 'OUTBOUND_EXPIRATION',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      p2PKH_VERSION: {
        name: 'P2PKH_VERSION',
        type: {
          buffer: {
            length: 1,
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Uint8Array>,
      p2SH_VERSION: {
        name: 'P2SH_VERSION',
        type: {
          buffer: {
            length: 1,
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Uint8Array>,
      rEVOKED_INBOUND_PREIMAGE: {
        name: 'REVOKED_INBOUND_PREIMAGE',
        type: {
          buffer: {
            length: 1,
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Uint8Array>,
      rEVOKED_OUTBOUND_TXID: {
        name: 'REVOKED_OUTBOUND_TXID',
        type: {
          buffer: {
            length: 1,
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Uint8Array>,
      nextOutboundId: {
        name: 'next-outbound-id',
        type: 'uint128',
        access: 'variable',
      } as TypedAbiVariable<bigint>,
      nextSupplierId: {
        name: 'next-supplier-id',
        type: 'uint128',
        access: 'variable',
      } as TypedAbiVariable<bigint>,
      nextSwapperId: {
        name: 'next-swapper-id',
        type: 'uint128',
        access: 'variable',
      } as TypedAbiVariable<bigint>,
      totalInboundVolumeVar: {
        name: 'total-inbound-volume-var',
        type: 'uint128',
        access: 'variable',
      } as TypedAbiVariable<bigint>,
      totalOutboundVolumeVar: {
        name: 'total-outbound-volume-var',
        type: 'uint128',
        access: 'variable',
      } as TypedAbiVariable<bigint>,
    },
    constants: {},
    fungible_tokens: [],
    non_fungible_tokens: [],
    contractName: 'bridge',
  },
  restrictedTokenTrait: {
    functions: {},
    maps: {},
    variables: {},
    constants: {},
    fungible_tokens: [],
    non_fungible_tokens: [],
    contractName: 'restricted-token-trait',
  },
  wrappedBitcoin: {
    functions: {
      addPrincipalToRole: {
        name: 'add-principal-to-role',
        access: 'public',
        args: [
          { name: 'role-to-add', type: 'uint128' },
          { name: 'principal-to-add', type: 'principal' },
        ],
        outputs: { type: { response: { ok: 'bool', error: 'uint128' } } },
      } as TypedAbiFunction<
        [roleToAdd: number | bigint, principalToAdd: string],
        Response<boolean, bigint>
      >,
      burnTokens: {
        name: 'burn-tokens',
        access: 'public',
        args: [
          { name: 'burn-amount', type: 'uint128' },
          { name: 'burn-from', type: 'principal' },
        ],
        outputs: { type: { response: { ok: 'bool', error: 'uint128' } } },
      } as TypedAbiFunction<
        [burnAmount: number | bigint, burnFrom: string],
        Response<boolean, bigint>
      >,
      initialize: {
        name: 'initialize',
        access: 'public',
        args: [
          { name: 'name-to-set', type: { 'string-ascii': { length: 32 } } },
          { name: 'symbol-to-set', type: { 'string-ascii': { length: 32 } } },
          { name: 'decimals-to-set', type: 'uint128' },
          { name: 'initial-owner', type: 'principal' },
        ],
        outputs: { type: { response: { ok: 'bool', error: 'uint128' } } },
      } as TypedAbiFunction<
        [
          nameToSet: string,
          symbolToSet: string,
          decimalsToSet: number | bigint,
          initialOwner: string
        ],
        Response<boolean, bigint>
      >,
      mintTokens: {
        name: 'mint-tokens',
        access: 'public',
        args: [
          { name: 'mint-amount', type: 'uint128' },
          { name: 'mint-to', type: 'principal' },
        ],
        outputs: { type: { response: { ok: 'bool', error: 'uint128' } } },
      } as TypedAbiFunction<
        [mintAmount: number | bigint, mintTo: string],
        Response<boolean, bigint>
      >,
      removePrincipalFromRole: {
        name: 'remove-principal-from-role',
        access: 'public',
        args: [
          { name: 'role-to-remove', type: 'uint128' },
          { name: 'principal-to-remove', type: 'principal' },
        ],
        outputs: { type: { response: { ok: 'bool', error: 'uint128' } } },
      } as TypedAbiFunction<
        [roleToRemove: number | bigint, principalToRemove: string],
        Response<boolean, bigint>
      >,
      revokeTokens: {
        name: 'revoke-tokens',
        access: 'public',
        args: [
          { name: 'revoke-amount', type: 'uint128' },
          { name: 'revoke-from', type: 'principal' },
          { name: 'revoke-to', type: 'principal' },
        ],
        outputs: { type: { response: { ok: 'bool', error: 'uint128' } } },
      } as TypedAbiFunction<
        [revokeAmount: number | bigint, revokeFrom: string, revokeTo: string],
        Response<boolean, bigint>
      >,
      setTokenUri: {
        name: 'set-token-uri',
        access: 'public',
        args: [{ name: 'updated-uri', type: { 'string-utf8': { length: 256 } } }],
        outputs: { type: { response: { ok: 'bool', error: 'uint128' } } },
      } as TypedAbiFunction<[updatedUri: string], Response<boolean, bigint>>,
      transfer: {
        name: 'transfer',
        access: 'public',
        args: [
          { name: 'amount', type: 'uint128' },
          { name: 'sender', type: 'principal' },
          { name: 'recipient', type: 'principal' },
          { name: 'memo', type: { optional: { buffer: { length: 34 } } } },
        ],
        outputs: { type: { response: { ok: 'bool', error: 'uint128' } } },
      } as TypedAbiFunction<
        [amount: number | bigint, sender: string, recipient: string, memo: Uint8Array | null],
        Response<boolean, bigint>
      >,
      updateBlacklisted: {
        name: 'update-blacklisted',
        access: 'public',
        args: [
          { name: 'principal-to-update', type: 'principal' },
          { name: 'set-blacklisted', type: 'bool' },
        ],
        outputs: { type: { response: { ok: 'bool', error: 'uint128' } } },
      } as TypedAbiFunction<
        [principalToUpdate: string, setBlacklisted: boolean],
        Response<boolean, bigint>
      >,
      detectTransferRestriction: {
        name: 'detect-transfer-restriction',
        access: 'read_only',
        args: [
          { name: 'amount', type: 'uint128' },
          { name: 'sender', type: 'principal' },
          { name: 'recipient', type: 'principal' },
        ],
        outputs: { type: { response: { ok: 'uint128', error: 'uint128' } } },
      } as TypedAbiFunction<
        [amount: number | bigint, sender: string, recipient: string],
        Response<bigint, bigint>
      >,
      getBalance: {
        name: 'get-balance',
        access: 'read_only',
        args: [{ name: 'owner', type: 'principal' }],
        outputs: { type: { response: { ok: 'uint128', error: 'none' } } },
      } as TypedAbiFunction<[owner: string], Response<bigint, null>>,
      getDecimals: {
        name: 'get-decimals',
        access: 'read_only',
        args: [],
        outputs: { type: { response: { ok: 'uint128', error: 'none' } } },
      } as TypedAbiFunction<[], Response<bigint, null>>,
      getName: {
        name: 'get-name',
        access: 'read_only',
        args: [],
        outputs: { type: { response: { ok: { 'string-ascii': { length: 32 } }, error: 'none' } } },
      } as TypedAbiFunction<[], Response<string, null>>,
      getSymbol: {
        name: 'get-symbol',
        access: 'read_only',
        args: [],
        outputs: { type: { response: { ok: { 'string-ascii': { length: 32 } }, error: 'none' } } },
      } as TypedAbiFunction<[], Response<string, null>>,
      getTokenUri: {
        name: 'get-token-uri',
        access: 'read_only',
        args: [],
        outputs: {
          type: {
            response: { ok: { optional: { 'string-utf8': { length: 256 } } }, error: 'none' },
          },
        },
      } as TypedAbiFunction<[], Response<string | null, null>>,
      getTotalSupply: {
        name: 'get-total-supply',
        access: 'read_only',
        args: [],
        outputs: { type: { response: { ok: 'uint128', error: 'none' } } },
      } as TypedAbiFunction<[], Response<bigint, null>>,
      hasRole: {
        name: 'has-role',
        access: 'read_only',
        args: [
          { name: 'role-to-check', type: 'uint128' },
          { name: 'principal-to-check', type: 'principal' },
        ],
        outputs: { type: 'bool' },
      } as TypedAbiFunction<[roleToCheck: number | bigint, principalToCheck: string], boolean>,
      isBlacklisted: {
        name: 'is-blacklisted',
        access: 'read_only',
        args: [{ name: 'principal-to-check', type: 'principal' }],
        outputs: { type: 'bool' },
      } as TypedAbiFunction<[principalToCheck: string], boolean>,
      messageForRestriction: {
        name: 'message-for-restriction',
        access: 'read_only',
        args: [{ name: 'restriction-code', type: 'uint128' }],
        outputs: { type: { response: { ok: { 'string-ascii': { length: 70 } }, error: 'none' } } },
      } as TypedAbiFunction<[restrictionCode: number | bigint], Response<string, null>>,
    },
    maps: {
      blacklist: {
        name: 'blacklist',
        key: { tuple: [{ name: 'account', type: 'principal' }] },
        value: { tuple: [{ name: 'blacklisted', type: 'bool' }] },
      } as TypedAbiMap<
        {
          account: string;
        },
        {
          blacklisted: boolean;
        }
      >,
      roles: {
        name: 'roles',
        key: {
          tuple: [
            { name: 'account', type: 'principal' },
            { name: 'role', type: 'uint128' },
          ],
        },
        value: { tuple: [{ name: 'allowed', type: 'bool' }] },
      } as TypedAbiMap<
        {
          account: string;
          role: bigint;
        },
        {
          allowed: boolean;
        }
      >,
    },
    variables: {
      bLACKLISTER_ROLE: {
        name: 'BLACKLISTER_ROLE',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      bURNER_ROLE: {
        name: 'BURNER_ROLE',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      mINTER_ROLE: {
        name: 'MINTER_ROLE',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      oWNER_ROLE: {
        name: 'OWNER_ROLE',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      pERMISSION_DENIED_ERROR: {
        name: 'PERMISSION_DENIED_ERROR',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      rESTRICTION_BLACKLIST: {
        name: 'RESTRICTION_BLACKLIST',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      rESTRICTION_NONE: {
        name: 'RESTRICTION_NONE',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      rEVOKER_ROLE: {
        name: 'REVOKER_ROLE',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      deployerPrincipal: {
        name: 'deployer-principal',
        type: 'principal',
        access: 'variable',
      } as TypedAbiVariable<string>,
      isInitialized: {
        name: 'is-initialized',
        type: 'bool',
        access: 'variable',
      } as TypedAbiVariable<boolean>,
      tokenDecimals: {
        name: 'token-decimals',
        type: 'uint128',
        access: 'variable',
      } as TypedAbiVariable<bigint>,
      tokenName: {
        name: 'token-name',
        type: {
          'string-ascii': {
            length: 32,
          },
        },
        access: 'variable',
      } as TypedAbiVariable<string>,
      tokenSymbol: {
        name: 'token-symbol',
        type: {
          'string-ascii': {
            length: 32,
          },
        },
        access: 'variable',
      } as TypedAbiVariable<string>,
      uri: {
        name: 'uri',
        type: {
          'string-utf8': {
            length: 256,
          },
        },
        access: 'variable',
      } as TypedAbiVariable<string>,
    },
    constants: {},
    fungible_tokens: [{ name: 'wrapped-bitcoin' }],
    non_fungible_tokens: [],
    contractName: 'Wrapped-Bitcoin',
  },
  clarityBitcoin: {
    functions: {
      buffToU8: {
        name: 'buff-to-u8',
        access: 'read_only',
        args: [{ name: 'byte', type: { buffer: { length: 1 } } }],
        outputs: { type: 'uint128' },
      } as TypedAbiFunction<[byte: Uint8Array], bigint>,
      getReversedTxid: {
        name: 'get-reversed-txid',
        access: 'read_only',
        args: [{ name: 'tx', type: { buffer: { length: 1024 } } }],
        outputs: { type: { buffer: { length: 32 } } },
      } as TypedAbiFunction<[tx: Uint8Array], Uint8Array>,
      getTxid: {
        name: 'get-txid',
        access: 'read_only',
        args: [{ name: 'tx', type: { buffer: { length: 1024 } } }],
        outputs: { type: { buffer: { length: 32 } } },
      } as TypedAbiFunction<[tx: Uint8Array], Uint8Array>,
      innerBuff32Permutation: {
        name: 'inner-buff32-permutation',
        access: 'read_only',
        args: [
          { name: 'target-index', type: 'uint128' },
          {
            name: 'state',
            type: {
              tuple: [
                { name: 'hash-input', type: { buffer: { length: 32 } } },
                { name: 'hash-output', type: { buffer: { length: 32 } } },
              ],
            },
          },
        ],
        outputs: {
          type: {
            tuple: [
              { name: 'hash-input', type: { buffer: { length: 32 } } },
              { name: 'hash-output', type: { buffer: { length: 32 } } },
            ],
          },
        },
      } as TypedAbiFunction<
        [
          targetIndex: number | bigint,
          state: {
            'hash-input': Uint8Array;
            'hash-output': Uint8Array;
          }
        ],
        {
          'hash-input': Uint8Array;
          'hash-output': Uint8Array;
        }
      >,
      innerMerkleProofVerify: {
        name: 'inner-merkle-proof-verify',
        access: 'read_only',
        args: [
          { name: 'ctr', type: 'uint128' },
          {
            name: 'state',
            type: {
              tuple: [
                { name: 'cur-hash', type: { buffer: { length: 32 } } },
                { name: 'path', type: 'uint128' },
                {
                  name: 'proof-hashes',
                  type: { list: { type: { buffer: { length: 32 } }, length: 12 } },
                },
                { name: 'root-hash', type: { buffer: { length: 32 } } },
                { name: 'tree-depth', type: 'uint128' },
                { name: 'verified', type: 'bool' },
              ],
            },
          },
        ],
        outputs: {
          type: {
            tuple: [
              { name: 'cur-hash', type: { buffer: { length: 32 } } },
              { name: 'path', type: 'uint128' },
              {
                name: 'proof-hashes',
                type: { list: { type: { buffer: { length: 32 } }, length: 12 } },
              },
              { name: 'root-hash', type: { buffer: { length: 32 } } },
              { name: 'tree-depth', type: 'uint128' },
              { name: 'verified', type: 'bool' },
            ],
          },
        },
      } as TypedAbiFunction<
        [
          ctr: number | bigint,
          state: {
            'cur-hash': Uint8Array;
            path: bigint;
            'proof-hashes': Uint8Array[];
            'root-hash': Uint8Array;
            'tree-depth': bigint;
            verified: boolean;
          }
        ],
        {
          'cur-hash': Uint8Array;
          path: bigint;
          'proof-hashes': Uint8Array[];
          'root-hash': Uint8Array;
          'tree-depth': bigint;
          verified: boolean;
        }
      >,
      innerReadSlice: {
        name: 'inner-read-slice',
        access: 'read_only',
        args: [
          { name: 'chunk_size', type: 'uint128' },
          {
            name: 'input',
            type: {
              tuple: [
                { name: 'acc', type: { buffer: { length: 1024 } } },
                { name: 'buffer', type: { buffer: { length: 1024 } } },
                { name: 'index', type: 'uint128' },
                { name: 'remaining', type: 'uint128' },
              ],
            },
          },
        ],
        outputs: {
          type: {
            tuple: [
              { name: 'acc', type: { buffer: { length: 1024 } } },
              { name: 'buffer', type: { buffer: { length: 1024 } } },
              { name: 'index', type: 'uint128' },
              { name: 'remaining', type: 'uint128' },
            ],
          },
        },
      } as TypedAbiFunction<
        [
          chunk_size: number | bigint,
          input: {
            acc: Uint8Array;
            buffer: Uint8Array;
            index: bigint;
            remaining: bigint;
          }
        ],
        {
          acc: Uint8Array;
          buffer: Uint8Array;
          index: bigint;
          remaining: bigint;
        }
      >,
      innerReadSlice1024: {
        name: 'inner-read-slice-1024',
        access: 'read_only',
        args: [
          { name: 'ignored', type: 'bool' },
          {
            name: 'input',
            type: {
              tuple: [
                { name: 'acc', type: { buffer: { length: 1024 } } },
                { name: 'data', type: { buffer: { length: 1024 } } },
                { name: 'index', type: 'uint128' },
              ],
            },
          },
        ],
        outputs: {
          type: {
            tuple: [
              { name: 'acc', type: { buffer: { length: 1024 } } },
              { name: 'data', type: { buffer: { length: 1024 } } },
              { name: 'index', type: 'uint128' },
            ],
          },
        },
      } as TypedAbiFunction<
        [
          ignored: boolean,
          input: {
            acc: Uint8Array;
            data: Uint8Array;
            index: bigint;
          }
        ],
        {
          acc: Uint8Array;
          data: Uint8Array;
          index: bigint;
        }
      >,
      isBitSet: {
        name: 'is-bit-set',
        access: 'read_only',
        args: [
          { name: 'val', type: 'uint128' },
          { name: 'bit', type: 'uint128' },
        ],
        outputs: { type: 'bool' },
      } as TypedAbiFunction<[val: number | bigint, bit: number | bigint], boolean>,
      parseBlockHeader: {
        name: 'parse-block-header',
        access: 'read_only',
        args: [{ name: 'headerbuff', type: { buffer: { length: 80 } } }],
        outputs: {
          type: {
            response: {
              ok: {
                tuple: [
                  { name: 'merkle-root', type: { buffer: { length: 32 } } },
                  { name: 'nbits', type: 'uint128' },
                  { name: 'nonce', type: 'uint128' },
                  { name: 'parent', type: { buffer: { length: 32 } } },
                  { name: 'timestamp', type: 'uint128' },
                  { name: 'version', type: 'uint128' },
                ],
              },
              error: 'uint128',
            },
          },
        },
      } as TypedAbiFunction<
        [headerbuff: Uint8Array],
        Response<
          {
            'merkle-root': Uint8Array;
            nbits: bigint;
            nonce: bigint;
            parent: Uint8Array;
            timestamp: bigint;
            version: bigint;
          },
          bigint
        >
      >,
      parseTx: {
        name: 'parse-tx',
        access: 'read_only',
        args: [{ name: 'tx', type: { buffer: { length: 1024 } } }],
        outputs: {
          type: {
            response: {
              ok: {
                tuple: [
                  {
                    name: 'ins',
                    type: {
                      list: {
                        type: {
                          tuple: [
                            {
                              name: 'outpoint',
                              type: {
                                tuple: [
                                  { name: 'hash', type: { buffer: { length: 32 } } },
                                  { name: 'index', type: 'uint128' },
                                ],
                              },
                            },
                            { name: 'scriptSig', type: { buffer: { length: 256 } } },
                            { name: 'sequence', type: 'uint128' },
                          ],
                        },
                        length: 8,
                      },
                    },
                  },
                  { name: 'locktime', type: 'uint128' },
                  {
                    name: 'outs',
                    type: {
                      list: {
                        type: {
                          tuple: [
                            { name: 'scriptPubKey', type: { buffer: { length: 128 } } },
                            { name: 'value', type: 'uint128' },
                          ],
                        },
                        length: 8,
                      },
                    },
                  },
                  { name: 'version', type: 'uint128' },
                ],
              },
              error: 'uint128',
            },
          },
        },
      } as TypedAbiFunction<
        [tx: Uint8Array],
        Response<
          {
            ins: {
              outpoint: {
                hash: Uint8Array;
                index: bigint;
              };
              scriptSig: Uint8Array;
              sequence: bigint;
            }[];
            locktime: bigint;
            outs: {
              scriptPubKey: Uint8Array;
              value: bigint;
            }[];
            version: bigint;
          },
          bigint
        >
      >,
      readHashslice: {
        name: 'read-hashslice',
        access: 'read_only',
        args: [
          {
            name: 'old-ctx',
            type: {
              tuple: [
                { name: 'index', type: 'uint128' },
                { name: 'txbuff', type: { buffer: { length: 1024 } } },
              ],
            },
          },
        ],
        outputs: {
          type: {
            response: {
              ok: {
                tuple: [
                  {
                    name: 'ctx',
                    type: {
                      tuple: [
                        { name: 'index', type: 'uint128' },
                        { name: 'txbuff', type: { buffer: { length: 1024 } } },
                      ],
                    },
                  },
                  { name: 'hashslice', type: { buffer: { length: 32 } } },
                ],
              },
              error: 'uint128',
            },
          },
        },
      } as TypedAbiFunction<
        [
          oldCtx: {
            index: bigint;
            txbuff: Uint8Array;
          }
        ],
        Response<
          {
            ctx: {
              index: bigint;
              txbuff: Uint8Array;
            };
            hashslice: Uint8Array;
          },
          bigint
        >
      >,
      readNextTxin: {
        name: 'read-next-txin',
        access: 'read_only',
        args: [
          { name: 'ignored', type: 'bool' },
          {
            name: 'state-res',
            type: {
              response: {
                ok: {
                  tuple: [
                    {
                      name: 'ctx',
                      type: {
                        tuple: [
                          { name: 'index', type: 'uint128' },
                          { name: 'txbuff', type: { buffer: { length: 1024 } } },
                        ],
                      },
                    },
                    { name: 'remaining', type: 'uint128' },
                    {
                      name: 'txins',
                      type: {
                        list: {
                          type: {
                            tuple: [
                              {
                                name: 'outpoint',
                                type: {
                                  tuple: [
                                    { name: 'hash', type: { buffer: { length: 32 } } },
                                    { name: 'index', type: 'uint128' },
                                  ],
                                },
                              },
                              { name: 'scriptSig', type: { buffer: { length: 256 } } },
                              { name: 'sequence', type: 'uint128' },
                            ],
                          },
                          length: 8,
                        },
                      },
                    },
                  ],
                },
                error: 'uint128',
              },
            },
          },
        ],
        outputs: {
          type: {
            response: {
              ok: {
                tuple: [
                  {
                    name: 'ctx',
                    type: {
                      tuple: [
                        { name: 'index', type: 'uint128' },
                        { name: 'txbuff', type: { buffer: { length: 1024 } } },
                      ],
                    },
                  },
                  { name: 'remaining', type: 'uint128' },
                  {
                    name: 'txins',
                    type: {
                      list: {
                        type: {
                          tuple: [
                            {
                              name: 'outpoint',
                              type: {
                                tuple: [
                                  { name: 'hash', type: { buffer: { length: 32 } } },
                                  { name: 'index', type: 'uint128' },
                                ],
                              },
                            },
                            { name: 'scriptSig', type: { buffer: { length: 256 } } },
                            { name: 'sequence', type: 'uint128' },
                          ],
                        },
                        length: 8,
                      },
                    },
                  },
                ],
              },
              error: 'uint128',
            },
          },
        },
      } as TypedAbiFunction<
        [
          ignored: boolean,
          stateRes: Response<
            {
              ctx: {
                index: bigint;
                txbuff: Uint8Array;
              };
              remaining: bigint;
              txins: {
                outpoint: {
                  hash: Uint8Array;
                  index: bigint;
                };
                scriptSig: Uint8Array;
                sequence: bigint;
              }[];
            },
            bigint
          >
        ],
        Response<
          {
            ctx: {
              index: bigint;
              txbuff: Uint8Array;
            };
            remaining: bigint;
            txins: {
              outpoint: {
                hash: Uint8Array;
                index: bigint;
              };
              scriptSig: Uint8Array;
              sequence: bigint;
            }[];
          },
          bigint
        >
      >,
      readNextTxout: {
        name: 'read-next-txout',
        access: 'read_only',
        args: [
          { name: 'ignored', type: 'bool' },
          {
            name: 'state-res',
            type: {
              response: {
                ok: {
                  tuple: [
                    {
                      name: 'ctx',
                      type: {
                        tuple: [
                          { name: 'index', type: 'uint128' },
                          { name: 'txbuff', type: { buffer: { length: 1024 } } },
                        ],
                      },
                    },
                    { name: 'remaining', type: 'uint128' },
                    {
                      name: 'txouts',
                      type: {
                        list: {
                          type: {
                            tuple: [
                              { name: 'scriptPubKey', type: { buffer: { length: 128 } } },
                              { name: 'value', type: 'uint128' },
                            ],
                          },
                          length: 8,
                        },
                      },
                    },
                  ],
                },
                error: 'uint128',
              },
            },
          },
        ],
        outputs: {
          type: {
            response: {
              ok: {
                tuple: [
                  {
                    name: 'ctx',
                    type: {
                      tuple: [
                        { name: 'index', type: 'uint128' },
                        { name: 'txbuff', type: { buffer: { length: 1024 } } },
                      ],
                    },
                  },
                  { name: 'remaining', type: 'uint128' },
                  {
                    name: 'txouts',
                    type: {
                      list: {
                        type: {
                          tuple: [
                            { name: 'scriptPubKey', type: { buffer: { length: 128 } } },
                            { name: 'value', type: 'uint128' },
                          ],
                        },
                        length: 8,
                      },
                    },
                  },
                ],
              },
              error: 'uint128',
            },
          },
        },
      } as TypedAbiFunction<
        [
          ignored: boolean,
          stateRes: Response<
            {
              ctx: {
                index: bigint;
                txbuff: Uint8Array;
              };
              remaining: bigint;
              txouts: {
                scriptPubKey: Uint8Array;
                value: bigint;
              }[];
            },
            bigint
          >
        ],
        Response<
          {
            ctx: {
              index: bigint;
              txbuff: Uint8Array;
            };
            remaining: bigint;
            txouts: {
              scriptPubKey: Uint8Array;
              value: bigint;
            }[];
          },
          bigint
        >
      >,
      readSlice: {
        name: 'read-slice',
        access: 'read_only',
        args: [
          { name: 'data', type: { buffer: { length: 1024 } } },
          { name: 'offset', type: 'uint128' },
          { name: 'size', type: 'uint128' },
        ],
        outputs: { type: { response: { ok: { buffer: { length: 1024 } }, error: 'uint128' } } },
      } as TypedAbiFunction<
        [data: Uint8Array, offset: number | bigint, size: number | bigint],
        Response<Uint8Array, bigint>
      >,
      readSlice1: {
        name: 'read-slice-1',
        access: 'read_only',
        args: [
          {
            name: 'input',
            type: {
              tuple: [
                { name: 'data', type: { buffer: { length: 1024 } } },
                { name: 'index', type: 'uint128' },
              ],
            },
          },
        ],
        outputs: { type: { buffer: { length: 1024 } } },
      } as TypedAbiFunction<
        [
          input: {
            data: Uint8Array;
            index: bigint;
          }
        ],
        Uint8Array
      >,
      readSlice128: {
        name: 'read-slice-128',
        access: 'read_only',
        args: [
          {
            name: 'input',
            type: {
              tuple: [
                { name: 'data', type: { buffer: { length: 1024 } } },
                { name: 'index', type: 'uint128' },
              ],
            },
          },
        ],
        outputs: { type: { buffer: { length: 1024 } } },
      } as TypedAbiFunction<
        [
          input: {
            data: Uint8Array;
            index: bigint;
          }
        ],
        Uint8Array
      >,
      readSlice16: {
        name: 'read-slice-16',
        access: 'read_only',
        args: [
          {
            name: 'input',
            type: {
              tuple: [
                { name: 'data', type: { buffer: { length: 1024 } } },
                { name: 'index', type: 'uint128' },
              ],
            },
          },
        ],
        outputs: { type: { buffer: { length: 1024 } } },
      } as TypedAbiFunction<
        [
          input: {
            data: Uint8Array;
            index: bigint;
          }
        ],
        Uint8Array
      >,
      readSlice2: {
        name: 'read-slice-2',
        access: 'read_only',
        args: [
          {
            name: 'input',
            type: {
              tuple: [
                { name: 'data', type: { buffer: { length: 1024 } } },
                { name: 'index', type: 'uint128' },
              ],
            },
          },
        ],
        outputs: { type: { buffer: { length: 1024 } } },
      } as TypedAbiFunction<
        [
          input: {
            data: Uint8Array;
            index: bigint;
          }
        ],
        Uint8Array
      >,
      readSlice256: {
        name: 'read-slice-256',
        access: 'read_only',
        args: [
          {
            name: 'input',
            type: {
              tuple: [
                { name: 'data', type: { buffer: { length: 1024 } } },
                { name: 'index', type: 'uint128' },
              ],
            },
          },
        ],
        outputs: { type: { buffer: { length: 1024 } } },
      } as TypedAbiFunction<
        [
          input: {
            data: Uint8Array;
            index: bigint;
          }
        ],
        Uint8Array
      >,
      readSlice32: {
        name: 'read-slice-32',
        access: 'read_only',
        args: [
          {
            name: 'input',
            type: {
              tuple: [
                { name: 'data', type: { buffer: { length: 1024 } } },
                { name: 'index', type: 'uint128' },
              ],
            },
          },
        ],
        outputs: { type: { buffer: { length: 1024 } } },
      } as TypedAbiFunction<
        [
          input: {
            data: Uint8Array;
            index: bigint;
          }
        ],
        Uint8Array
      >,
      readSlice4: {
        name: 'read-slice-4',
        access: 'read_only',
        args: [
          {
            name: 'input',
            type: {
              tuple: [
                { name: 'data', type: { buffer: { length: 1024 } } },
                { name: 'index', type: 'uint128' },
              ],
            },
          },
        ],
        outputs: { type: { buffer: { length: 1024 } } },
      } as TypedAbiFunction<
        [
          input: {
            data: Uint8Array;
            index: bigint;
          }
        ],
        Uint8Array
      >,
      readSlice512: {
        name: 'read-slice-512',
        access: 'read_only',
        args: [
          {
            name: 'input',
            type: {
              tuple: [
                { name: 'data', type: { buffer: { length: 1024 } } },
                { name: 'index', type: 'uint128' },
              ],
            },
          },
        ],
        outputs: { type: { buffer: { length: 1024 } } },
      } as TypedAbiFunction<
        [
          input: {
            data: Uint8Array;
            index: bigint;
          }
        ],
        Uint8Array
      >,
      readSlice64: {
        name: 'read-slice-64',
        access: 'read_only',
        args: [
          {
            name: 'input',
            type: {
              tuple: [
                { name: 'data', type: { buffer: { length: 1024 } } },
                { name: 'index', type: 'uint128' },
              ],
            },
          },
        ],
        outputs: { type: { buffer: { length: 1024 } } },
      } as TypedAbiFunction<
        [
          input: {
            data: Uint8Array;
            index: bigint;
          }
        ],
        Uint8Array
      >,
      readSlice8: {
        name: 'read-slice-8',
        access: 'read_only',
        args: [
          {
            name: 'input',
            type: {
              tuple: [
                { name: 'data', type: { buffer: { length: 1024 } } },
                { name: 'index', type: 'uint128' },
              ],
            },
          },
        ],
        outputs: { type: { buffer: { length: 1024 } } },
      } as TypedAbiFunction<
        [
          input: {
            data: Uint8Array;
            index: bigint;
          }
        ],
        Uint8Array
      >,
      readTxins: {
        name: 'read-txins',
        access: 'read_only',
        args: [
          {
            name: 'ctx',
            type: {
              tuple: [
                { name: 'index', type: 'uint128' },
                { name: 'txbuff', type: { buffer: { length: 1024 } } },
              ],
            },
          },
        ],
        outputs: {
          type: {
            response: {
              ok: {
                tuple: [
                  {
                    name: 'ctx',
                    type: {
                      tuple: [
                        { name: 'index', type: 'uint128' },
                        { name: 'txbuff', type: { buffer: { length: 1024 } } },
                      ],
                    },
                  },
                  { name: 'remaining', type: 'uint128' },
                  {
                    name: 'txins',
                    type: {
                      list: {
                        type: {
                          tuple: [
                            {
                              name: 'outpoint',
                              type: {
                                tuple: [
                                  { name: 'hash', type: { buffer: { length: 32 } } },
                                  { name: 'index', type: 'uint128' },
                                ],
                              },
                            },
                            { name: 'scriptSig', type: { buffer: { length: 256 } } },
                            { name: 'sequence', type: 'uint128' },
                          ],
                        },
                        length: 8,
                      },
                    },
                  },
                ],
              },
              error: 'uint128',
            },
          },
        },
      } as TypedAbiFunction<
        [
          ctx: {
            index: bigint;
            txbuff: Uint8Array;
          }
        ],
        Response<
          {
            ctx: {
              index: bigint;
              txbuff: Uint8Array;
            };
            remaining: bigint;
            txins: {
              outpoint: {
                hash: Uint8Array;
                index: bigint;
              };
              scriptSig: Uint8Array;
              sequence: bigint;
            }[];
          },
          bigint
        >
      >,
      readTxouts: {
        name: 'read-txouts',
        access: 'read_only',
        args: [
          {
            name: 'ctx',
            type: {
              tuple: [
                { name: 'index', type: 'uint128' },
                { name: 'txbuff', type: { buffer: { length: 1024 } } },
              ],
            },
          },
        ],
        outputs: {
          type: {
            response: {
              ok: {
                tuple: [
                  {
                    name: 'ctx',
                    type: {
                      tuple: [
                        { name: 'index', type: 'uint128' },
                        { name: 'txbuff', type: { buffer: { length: 1024 } } },
                      ],
                    },
                  },
                  { name: 'remaining', type: 'uint128' },
                  {
                    name: 'txouts',
                    type: {
                      list: {
                        type: {
                          tuple: [
                            { name: 'scriptPubKey', type: { buffer: { length: 128 } } },
                            { name: 'value', type: 'uint128' },
                          ],
                        },
                        length: 8,
                      },
                    },
                  },
                ],
              },
              error: 'uint128',
            },
          },
        },
      } as TypedAbiFunction<
        [
          ctx: {
            index: bigint;
            txbuff: Uint8Array;
          }
        ],
        Response<
          {
            ctx: {
              index: bigint;
              txbuff: Uint8Array;
            };
            remaining: bigint;
            txouts: {
              scriptPubKey: Uint8Array;
              value: bigint;
            }[];
          },
          bigint
        >
      >,
      readUint16: {
        name: 'read-uint16',
        access: 'read_only',
        args: [
          {
            name: 'ctx',
            type: {
              tuple: [
                { name: 'index', type: 'uint128' },
                { name: 'txbuff', type: { buffer: { length: 1024 } } },
              ],
            },
          },
        ],
        outputs: {
          type: {
            response: {
              ok: {
                tuple: [
                  {
                    name: 'ctx',
                    type: {
                      tuple: [
                        { name: 'index', type: 'uint128' },
                        { name: 'txbuff', type: { buffer: { length: 1024 } } },
                      ],
                    },
                  },
                  { name: 'uint16', type: 'uint128' },
                ],
              },
              error: 'uint128',
            },
          },
        },
      } as TypedAbiFunction<
        [
          ctx: {
            index: bigint;
            txbuff: Uint8Array;
          }
        ],
        Response<
          {
            ctx: {
              index: bigint;
              txbuff: Uint8Array;
            };
            uint16: bigint;
          },
          bigint
        >
      >,
      readUint32: {
        name: 'read-uint32',
        access: 'read_only',
        args: [
          {
            name: 'ctx',
            type: {
              tuple: [
                { name: 'index', type: 'uint128' },
                { name: 'txbuff', type: { buffer: { length: 1024 } } },
              ],
            },
          },
        ],
        outputs: {
          type: {
            response: {
              ok: {
                tuple: [
                  {
                    name: 'ctx',
                    type: {
                      tuple: [
                        { name: 'index', type: 'uint128' },
                        { name: 'txbuff', type: { buffer: { length: 1024 } } },
                      ],
                    },
                  },
                  { name: 'uint32', type: 'uint128' },
                ],
              },
              error: 'uint128',
            },
          },
        },
      } as TypedAbiFunction<
        [
          ctx: {
            index: bigint;
            txbuff: Uint8Array;
          }
        ],
        Response<
          {
            ctx: {
              index: bigint;
              txbuff: Uint8Array;
            };
            uint32: bigint;
          },
          bigint
        >
      >,
      readUint64: {
        name: 'read-uint64',
        access: 'read_only',
        args: [
          {
            name: 'ctx',
            type: {
              tuple: [
                { name: 'index', type: 'uint128' },
                { name: 'txbuff', type: { buffer: { length: 1024 } } },
              ],
            },
          },
        ],
        outputs: {
          type: {
            response: {
              ok: {
                tuple: [
                  {
                    name: 'ctx',
                    type: {
                      tuple: [
                        { name: 'index', type: 'uint128' },
                        { name: 'txbuff', type: { buffer: { length: 1024 } } },
                      ],
                    },
                  },
                  { name: 'uint64', type: 'uint128' },
                ],
              },
              error: 'uint128',
            },
          },
        },
      } as TypedAbiFunction<
        [
          ctx: {
            index: bigint;
            txbuff: Uint8Array;
          }
        ],
        Response<
          {
            ctx: {
              index: bigint;
              txbuff: Uint8Array;
            };
            uint64: bigint;
          },
          bigint
        >
      >,
      readVarint: {
        name: 'read-varint',
        access: 'read_only',
        args: [
          {
            name: 'ctx',
            type: {
              tuple: [
                { name: 'index', type: 'uint128' },
                { name: 'txbuff', type: { buffer: { length: 1024 } } },
              ],
            },
          },
        ],
        outputs: {
          type: {
            response: {
              ok: {
                tuple: [
                  {
                    name: 'ctx',
                    type: {
                      tuple: [
                        { name: 'index', type: 'uint128' },
                        { name: 'txbuff', type: { buffer: { length: 1024 } } },
                      ],
                    },
                  },
                  { name: 'varint', type: 'uint128' },
                ],
              },
              error: 'uint128',
            },
          },
        },
      } as TypedAbiFunction<
        [
          ctx: {
            index: bigint;
            txbuff: Uint8Array;
          }
        ],
        Response<
          {
            ctx: {
              index: bigint;
              txbuff: Uint8Array;
            };
            varint: bigint;
          },
          bigint
        >
      >,
      readVarslice: {
        name: 'read-varslice',
        access: 'read_only',
        args: [
          {
            name: 'old-ctx',
            type: {
              tuple: [
                { name: 'index', type: 'uint128' },
                { name: 'txbuff', type: { buffer: { length: 1024 } } },
              ],
            },
          },
        ],
        outputs: {
          type: {
            response: {
              ok: {
                tuple: [
                  {
                    name: 'ctx',
                    type: {
                      tuple: [
                        { name: 'index', type: 'uint128' },
                        { name: 'txbuff', type: { buffer: { length: 1024 } } },
                      ],
                    },
                  },
                  { name: 'varslice', type: { buffer: { length: 1024 } } },
                ],
              },
              error: 'uint128',
            },
          },
        },
      } as TypedAbiFunction<
        [
          oldCtx: {
            index: bigint;
            txbuff: Uint8Array;
          }
        ],
        Response<
          {
            ctx: {
              index: bigint;
              txbuff: Uint8Array;
            };
            varslice: Uint8Array;
          },
          bigint
        >
      >,
      reverseBuff32: {
        name: 'reverse-buff32',
        access: 'read_only',
        args: [{ name: 'input', type: { buffer: { length: 32 } } }],
        outputs: { type: { buffer: { length: 32 } } },
      } as TypedAbiFunction<[input: Uint8Array], Uint8Array>,
      verifyBlockHeader: {
        name: 'verify-block-header',
        access: 'read_only',
        args: [
          { name: 'headerbuff', type: { buffer: { length: 80 } } },
          { name: 'expected-block-height', type: 'uint128' },
        ],
        outputs: { type: 'bool' },
      } as TypedAbiFunction<
        [headerbuff: Uint8Array, expectedBlockHeight: number | bigint],
        boolean
      >,
      verifyMerkleProof: {
        name: 'verify-merkle-proof',
        access: 'read_only',
        args: [
          { name: 'reversed-txid', type: { buffer: { length: 32 } } },
          { name: 'merkle-root', type: { buffer: { length: 32 } } },
          {
            name: 'proof',
            type: {
              tuple: [
                {
                  name: 'hashes',
                  type: { list: { type: { buffer: { length: 32 } }, length: 12 } },
                },
                { name: 'tree-depth', type: 'uint128' },
                { name: 'tx-index', type: 'uint128' },
              ],
            },
          },
        ],
        outputs: { type: { response: { ok: 'bool', error: 'uint128' } } },
      } as TypedAbiFunction<
        [
          reversedTxid: Uint8Array,
          merkleRoot: Uint8Array,
          proof: {
            hashes: Uint8Array[];
            'tree-depth': bigint;
            'tx-index': bigint;
          }
        ],
        Response<boolean, bigint>
      >,
      verifyPrevBlock: {
        name: 'verify-prev-block',
        access: 'read_only',
        args: [
          { name: 'block', type: { buffer: { length: 80 } } },
          { name: 'parent', type: { buffer: { length: 80 } } },
        ],
        outputs: { type: { response: { ok: 'bool', error: 'uint128' } } },
      } as TypedAbiFunction<[block: Uint8Array, parent: Uint8Array], Response<boolean, bigint>>,
      verifyPrevBlocks: {
        name: 'verify-prev-blocks',
        access: 'read_only',
        args: [
          { name: 'block', type: { buffer: { length: 80 } } },
          { name: 'prev-blocks', type: { list: { type: { buffer: { length: 80 } }, length: 10 } } },
        ],
        outputs: { type: { response: { ok: { buffer: { length: 80 } }, error: 'uint128' } } },
      } as TypedAbiFunction<
        [block: Uint8Array, prevBlocks: Uint8Array[]],
        Response<Uint8Array, bigint>
      >,
      verifyPrevBlocksFold: {
        name: 'verify-prev-blocks-fold',
        access: 'read_only',
        args: [
          { name: 'parent', type: { buffer: { length: 80 } } },
          {
            name: 'next-resp',
            type: { response: { ok: { buffer: { length: 80 } }, error: 'uint128' } },
          },
        ],
        outputs: { type: { response: { ok: { buffer: { length: 80 } }, error: 'uint128' } } },
      } as TypedAbiFunction<
        [parent: Uint8Array, nextResp: Response<Uint8Array, bigint>],
        Response<Uint8Array, bigint>
      >,
      wasTxMinedPrev: {
        name: 'was-tx-mined-prev?',
        access: 'read_only',
        args: [
          {
            name: 'block',
            type: {
              tuple: [
                { name: 'header', type: { buffer: { length: 80 } } },
                { name: 'height', type: 'uint128' },
              ],
            },
          },
          { name: 'prev-blocks', type: { list: { type: { buffer: { length: 80 } }, length: 10 } } },
          { name: 'tx', type: { buffer: { length: 1024 } } },
          {
            name: 'proof',
            type: {
              tuple: [
                {
                  name: 'hashes',
                  type: { list: { type: { buffer: { length: 32 } }, length: 12 } },
                },
                { name: 'tree-depth', type: 'uint128' },
                { name: 'tx-index', type: 'uint128' },
              ],
            },
          },
        ],
        outputs: { type: { response: { ok: 'bool', error: 'uint128' } } },
      } as TypedAbiFunction<
        [
          block: {
            header: Uint8Array;
            height: bigint;
          },
          prevBlocks: Uint8Array[],
          tx: Uint8Array,
          proof: {
            hashes: Uint8Array[];
            'tree-depth': bigint;
            'tx-index': bigint;
          }
        ],
        Response<boolean, bigint>
      >,
      wasTxMined: {
        name: 'was-tx-mined?',
        access: 'read_only',
        args: [
          {
            name: 'block',
            type: {
              tuple: [
                { name: 'header', type: { buffer: { length: 80 } } },
                { name: 'height', type: 'uint128' },
              ],
            },
          },
          { name: 'tx', type: { buffer: { length: 1024 } } },
          {
            name: 'proof',
            type: {
              tuple: [
                {
                  name: 'hashes',
                  type: { list: { type: { buffer: { length: 32 } }, length: 12 } },
                },
                { name: 'tree-depth', type: 'uint128' },
                { name: 'tx-index', type: 'uint128' },
              ],
            },
          },
        ],
        outputs: { type: { response: { ok: 'bool', error: 'uint128' } } },
      } as TypedAbiFunction<
        [
          block: {
            header: Uint8Array;
            height: bigint;
          },
          tx: Uint8Array,
          proof: {
            hashes: Uint8Array[];
            'tree-depth': bigint;
            'tx-index': bigint;
          }
        ],
        Response<boolean, bigint>
      >,
    },
    maps: {},
    variables: {
      bUFF_TO_BYTE: {
        name: 'BUFF_TO_BYTE',
        type: {
          list: {
            type: {
              buffer: {
                length: 1,
              },
            },
            length: 256,
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Uint8Array[]>,
      eRRBADHEADER: {
        name: 'ERR-BAD-HEADER',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      eRRINVALIDPARENT: {
        name: 'ERR-INVALID-PARENT',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      eRROUTOFBOUNDS: {
        name: 'ERR-OUT-OF-BOUNDS',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      eRRPROOFTOOSHORT: {
        name: 'ERR-PROOF-TOO-SHORT',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      eRRTOOMANYTXINS: {
        name: 'ERR-TOO-MANY-TXINS',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      eRRTOOMANYTXOUTS: {
        name: 'ERR-TOO-MANY-TXOUTS',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      eRRVARSLICETOOLONG: {
        name: 'ERR-VARSLICE-TOO-LONG',
        type: 'uint128',
        access: 'constant',
      } as TypedAbiVariable<bigint>,
      lIST_128: {
        name: 'LIST_128',
        type: {
          list: {
            type: 'bool',
            length: 128,
          },
        },
        access: 'constant',
      } as TypedAbiVariable<boolean[]>,
      lIST_16: {
        name: 'LIST_16',
        type: {
          list: {
            type: 'bool',
            length: 16,
          },
        },
        access: 'constant',
      } as TypedAbiVariable<boolean[]>,
      lIST_256: {
        name: 'LIST_256',
        type: {
          list: {
            type: 'bool',
            length: 256,
          },
        },
        access: 'constant',
      } as TypedAbiVariable<boolean[]>,
      lIST_32: {
        name: 'LIST_32',
        type: {
          list: {
            type: 'bool',
            length: 32,
          },
        },
        access: 'constant',
      } as TypedAbiVariable<boolean[]>,
      lIST_512: {
        name: 'LIST_512',
        type: {
          list: {
            type: 'bool',
            length: 512,
          },
        },
        access: 'constant',
      } as TypedAbiVariable<boolean[]>,
      lIST_64: {
        name: 'LIST_64',
        type: {
          list: {
            type: 'bool',
            length: 64,
          },
        },
        access: 'constant',
      } as TypedAbiVariable<boolean[]>,
    },
    constants: {},
    fungible_tokens: [],
    non_fungible_tokens: [],
    contractName: 'clarity-bitcoin',
  },
  testUtils: {
    functions: {
      setBurnHeader: {
        name: 'set-burn-header',
        access: 'public',
        args: [
          { name: 'height', type: 'uint128' },
          { name: 'header', type: { buffer: { length: 80 } } },
        ],
        outputs: { type: { response: { ok: 'bool', error: 'none' } } },
      } as TypedAbiFunction<[height: number | bigint, header: Uint8Array], Response<boolean, null>>,
      setMined: {
        name: 'set-mined',
        access: 'public',
        args: [{ name: 'txid', type: { buffer: { length: 32 } } }],
        outputs: { type: { response: { ok: 'bool', error: 'none' } } },
      } as TypedAbiFunction<[txid: Uint8Array], Response<boolean, null>>,
      burnBlockHeader: {
        name: 'burn-block-header',
        access: 'read_only',
        args: [{ name: 'height', type: 'uint128' }],
        outputs: { type: { optional: { buffer: { length: 80 } } } },
      } as TypedAbiFunction<[height: number | bigint], Uint8Array | null>,
      wasMined: {
        name: 'was-mined',
        access: 'read_only',
        args: [{ name: 'txid', type: { buffer: { length: 32 } } }],
        outputs: { type: { optional: 'bool' } },
      } as TypedAbiFunction<[txid: Uint8Array], boolean | null>,
    },
    maps: {
      burnBlockHeaders: {
        name: 'burn-block-headers',
        key: 'uint128',
        value: { buffer: { length: 80 } },
      } as TypedAbiMap<bigint, Uint8Array>,
      minedTxs: {
        name: 'mined-txs',
        key: { buffer: { length: 32 } },
        value: 'bool',
      } as TypedAbiMap<Uint8Array, boolean>,
    },
    variables: {},
    constants: {},
    fungible_tokens: [],
    non_fungible_tokens: [],
    contractName: 'test-utils',
  },
  supplierWrapper: {
    functions: {
      withdrawFunds: {
        name: 'withdraw-funds',
        access: 'private',
        args: [{ name: 'amount', type: 'uint128' }],
        outputs: { type: { response: { ok: 'uint128', error: 'uint128' } } },
      } as TypedAbiFunction<[amount: number | bigint], Response<bigint, bigint>>,
      addFunds: {
        name: 'add-funds',
        access: 'public',
        args: [{ name: 'amount', type: 'uint128' }],
        outputs: { type: { response: { ok: 'uint128', error: 'uint128' } } },
      } as TypedAbiFunction<[amount: number | bigint], Response<bigint, bigint>>,
      finalizeSwap: {
        name: 'finalize-swap',
        access: 'public',
        args: [
          { name: 'txid', type: { buffer: { length: 32 } } },
          { name: 'preimage', type: { buffer: { length: 128 } } },
        ],
        outputs: {
          type: {
            response: {
              ok: {
                tuple: [
                  { name: 'csv', type: 'uint128' },
                  { name: 'expiration', type: 'uint128' },
                  { name: 'hash', type: { buffer: { length: 32 } } },
                  { name: 'output-index', type: 'uint128' },
                  { name: 'redeem-script', type: { buffer: { length: 120 } } },
                  { name: 'sats', type: 'uint128' },
                  { name: 'sender-public-key', type: { buffer: { length: 33 } } },
                  { name: 'supplier', type: 'uint128' },
                  { name: 'swapper', type: 'uint128' },
                  { name: 'swapper-principal', type: 'principal' },
                  { name: 'xbtc', type: 'uint128' },
                ],
              },
              error: 'uint128',
            },
          },
        },
      } as TypedAbiFunction<
        [txid: Uint8Array, preimage: Uint8Array],
        Response<
          {
            csv: bigint;
            expiration: bigint;
            hash: Uint8Array;
            'output-index': bigint;
            'redeem-script': Uint8Array;
            sats: bigint;
            'sender-public-key': Uint8Array;
            supplier: bigint;
            swapper: bigint;
            'swapper-principal': string;
            xbtc: bigint;
          },
          bigint
        >
      >,
      registerSupplier: {
        name: 'register-supplier',
        access: 'public',
        args: [
          { name: 'public-key', type: { buffer: { length: 33 } } },
          { name: 'inbound-fee', type: { optional: 'int128' } },
          { name: 'outbound-fee', type: { optional: 'int128' } },
          { name: 'outbound-base-fee', type: 'int128' },
          { name: 'inbound-base-fee', type: 'int128' },
          { name: 'funds', type: 'uint128' },
        ],
        outputs: { type: { response: { ok: 'uint128', error: 'uint128' } } },
      } as TypedAbiFunction<
        [
          publicKey: Uint8Array,
          inboundFee: bigint | null,
          outboundFee: bigint | null,
          outboundBaseFee: number | bigint,
          inboundBaseFee: number | bigint,
          funds: number | bigint
        ],
        Response<bigint, bigint>
      >,
      removeFunds: {
        name: 'remove-funds',
        access: 'public',
        args: [{ name: 'amount', type: 'uint128' }],
        outputs: { type: { response: { ok: 'uint128', error: 'uint128' } } },
      } as TypedAbiFunction<[amount: number | bigint], Response<bigint, bigint>>,
      transferOwner: {
        name: 'transfer-owner',
        access: 'public',
        args: [{ name: 'new-owner', type: 'principal' }],
        outputs: { type: { response: { ok: 'principal', error: 'uint128' } } },
      } as TypedAbiFunction<[newOwner: string], Response<string, bigint>>,
      updateSupplier: {
        name: 'update-supplier',
        access: 'public',
        args: [
          { name: 'public-key', type: { buffer: { length: 33 } } },
          { name: 'inbound-fee', type: { optional: 'int128' } },
          { name: 'outbound-fee', type: { optional: 'int128' } },
          { name: 'outbound-base-fee', type: 'int128' },
          { name: 'inbound-base-fee', type: 'int128' },
        ],
        outputs: {
          type: {
            response: {
              ok: {
                tuple: [
                  { name: 'controller', type: 'principal' },
                  { name: 'inbound-base-fee', type: 'int128' },
                  { name: 'inbound-fee', type: { optional: 'int128' } },
                  { name: 'outbound-base-fee', type: 'int128' },
                  { name: 'outbound-fee', type: { optional: 'int128' } },
                  { name: 'public-key', type: { buffer: { length: 33 } } },
                ],
              },
              error: 'uint128',
            },
          },
        },
      } as TypedAbiFunction<
        [
          publicKey: Uint8Array,
          inboundFee: bigint | null,
          outboundFee: bigint | null,
          outboundBaseFee: number | bigint,
          inboundBaseFee: number | bigint
        ],
        Response<
          {
            controller: string;
            'inbound-base-fee': bigint;
            'inbound-fee': bigint | null;
            'outbound-base-fee': bigint;
            'outbound-fee': bigint | null;
            'public-key': Uint8Array;
          },
          bigint
        >
      >,
      getOwner: {
        name: 'get-owner',
        access: 'read_only',
        args: [],
        outputs: { type: 'principal' },
      } as TypedAbiFunction<[], string>,
      validateOwner: {
        name: 'validate-owner',
        access: 'read_only',
        args: [],
        outputs: { type: { response: { ok: 'bool', error: 'uint128' } } },
      } as TypedAbiFunction<[], Response<boolean, bigint>>,
    },
    maps: {},
    variables: {
      eRR_PANIC: {
        name: 'ERR_PANIC',
        type: {
          response: {
            ok: 'none',
            error: 'uint128',
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Response<null, bigint>>,
      eRR_UNAUTHORIZED: {
        name: 'ERR_UNAUTHORIZED',
        type: {
          response: {
            ok: 'none',
            error: 'uint128',
          },
        },
        access: 'constant',
      } as TypedAbiVariable<Response<null, bigint>>,
      owner: {
        name: 'owner',
        type: 'principal',
        access: 'variable',
      } as TypedAbiVariable<string>,
    },
    constants: {},
    fungible_tokens: [],
    non_fungible_tokens: [],
    contractName: 'supplier-wrapper',
  },
  ftTrait: {
    functions: {},
    maps: {},
    variables: {},
    constants: {},
    fungible_tokens: [],
    non_fungible_tokens: [],
    contractName: 'ft-trait',
  },
} as const;
