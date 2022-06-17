export type ClarityAbiTypeBuffer = { buffer: { length: number } };
export type ClarityAbiTypeStringAscii = { 'string-ascii': { length: number } };
export type ClarityAbiTypeStringUtf8 = { 'string-utf8': { length: number } };
export type ClarityAbiTypeResponse = { response: { ok: ClarityAbiType; error: ClarityAbiType } };
export type ClarityAbiTypeOptional = { optional: ClarityAbiType };
export type ClarityAbiTypeTuple = { tuple: { name: string; type: ClarityAbiType }[] };
export type ClarityAbiTypeList = { list: { type: ClarityAbiType; length: number } };

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
}

export interface ResponseErr<T, E> {
  value: E;
  isOk: false;
}

export type Response<Ok, Err> = ResponseOk<Ok, Err> | ResponseErr<Ok, Err>;

export const contracts = {
  ftTrait: {
    functions: {},
    variables: {},
    maps: {},
    constants: {},
    fungible_tokens: [],
    non_fungible_tokens: [],
    contractName: 'ft-trait',
    contractFile: 'contracts/ft-trait.clar',
  },
  xbtc: {
    functions: {
      getTokenUri: {
        access: 'public',
        args: [],
        name: 'get-token-uri',
        outputs: {
          type: {
            response: { error: 'none', ok: { optional: { 'string-utf8': { length: 19 } } } },
          },
        },
      } as TypedAbiFunction<[], Response<string | null, null>>,
      transfer: {
        access: 'public',
        args: [
          { name: 'amount', type: 'uint128' },
          { name: 'sender', type: 'principal' },
          { name: 'recipient', type: 'principal' },
          { name: 'memo', type: { optional: { buffer: { length: 34 } } } },
        ],
        name: 'transfer',
        outputs: { type: { response: { error: 'uint128', ok: 'bool' } } },
      } as TypedAbiFunction<
        [amount: number | bigint, sender: string, recipient: string, memo: Uint8Array | null],
        Response<boolean, bigint>
      >,
      getBalance: {
        access: 'read_only',
        args: [{ name: 'owner', type: 'principal' }],
        name: 'get-balance',
        outputs: { type: { response: { error: 'none', ok: 'uint128' } } },
      } as TypedAbiFunction<[owner: string], Response<bigint, null>>,
      getDecimals: {
        access: 'read_only',
        args: [],
        name: 'get-decimals',
        outputs: { type: { response: { error: 'none', ok: 'uint128' } } },
      } as TypedAbiFunction<[], Response<bigint, null>>,
      getName: {
        access: 'read_only',
        args: [],
        name: 'get-name',
        outputs: { type: { response: { error: 'none', ok: { 'string-ascii': { length: 4 } } } } },
      } as TypedAbiFunction<[], Response<string, null>>,
      getSymbol: {
        access: 'read_only',
        args: [],
        name: 'get-symbol',
        outputs: { type: { response: { error: 'none', ok: { 'string-ascii': { length: 4 } } } } },
      } as TypedAbiFunction<[], Response<string, null>>,
      getTotalSupply: {
        access: 'read_only',
        args: [],
        name: 'get-total-supply',
        outputs: { type: { response: { error: 'none', ok: 'uint128' } } },
      } as TypedAbiFunction<[], Response<bigint, null>>,
    },
    variables: {},
    maps: {},
    constants: {},
    fungible_tokens: [{ name: 'xbtc' }],
    non_fungible_tokens: [],
    contractName: 'xbtc',
    contractFile: 'contracts/xbtc.clar',
  },
  testUtils: {
    functions: {
      setBurnHeader: {
        access: 'public',
        args: [
          { name: 'height', type: 'uint128' },
          { name: 'header', type: { buffer: { length: 80 } } },
        ],
        name: 'set-burn-header',
        outputs: { type: { response: { error: 'none', ok: 'bool' } } },
      } as TypedAbiFunction<[height: number | bigint, header: Uint8Array], Response<boolean, null>>,
      setMined: {
        access: 'public',
        args: [{ name: 'txid', type: { buffer: { length: 32 } } }],
        name: 'set-mined',
        outputs: { type: { response: { error: 'none', ok: 'bool' } } },
      } as TypedAbiFunction<[txid: Uint8Array], Response<boolean, null>>,
      burnBlockHeader: {
        access: 'read_only',
        args: [{ name: 'height', type: 'uint128' }],
        name: 'burn-block-header',
        outputs: { type: { optional: { buffer: { length: 80 } } } },
      } as TypedAbiFunction<[height: number | bigint], Uint8Array | null>,
      wasMined: {
        access: 'read_only',
        args: [{ name: 'txid', type: { buffer: { length: 32 } } }],
        name: 'was-mined',
        outputs: { type: { optional: 'bool' } },
      } as TypedAbiFunction<[txid: Uint8Array], boolean | null>,
    },
    variables: {},
    maps: {
      burnBlockHeaders: {
        key: 'uint128',
        name: 'burn-block-headers',
        value: { buffer: { length: 80 } },
      } as TypedAbiMap<bigint, Uint8Array>,
      minedTxs: {
        key: { buffer: { length: 32 } },
        name: 'mined-txs',
        value: 'bool',
      } as TypedAbiMap<Uint8Array, boolean>,
    },
    constants: {},
    fungible_tokens: [],
    non_fungible_tokens: [],
    contractName: 'test-utils',
    contractFile: 'contracts/test/test-utils.clar',
  },
  clarityBitcoin: {
    functions: {
      buffToU8: {
        access: 'read_only',
        args: [{ name: 'byte', type: { buffer: { length: 1 } } }],
        name: 'buff-to-u8',
        outputs: { type: 'uint128' },
      } as TypedAbiFunction<[byte: Uint8Array], bigint>,
      getReversedTxid: {
        access: 'read_only',
        args: [{ name: 'tx', type: { buffer: { length: 1024 } } }],
        name: 'get-reversed-txid',
        outputs: { type: { buffer: { length: 32 } } },
      } as TypedAbiFunction<[tx: Uint8Array], Uint8Array>,
      getTxid: {
        access: 'read_only',
        args: [{ name: 'tx', type: { buffer: { length: 1024 } } }],
        name: 'get-txid',
        outputs: { type: { buffer: { length: 32 } } },
      } as TypedAbiFunction<[tx: Uint8Array], Uint8Array>,
      innerBuff32Permutation: {
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
        name: 'inner-buff32-permutation',
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
                  type: { list: { length: 12, type: { buffer: { length: 32 } } } },
                },
                { name: 'root-hash', type: { buffer: { length: 32 } } },
                { name: 'tree-depth', type: 'uint128' },
                { name: 'verified', type: 'bool' },
              ],
            },
          },
        ],
        name: 'inner-merkle-proof-verify',
        outputs: {
          type: {
            tuple: [
              { name: 'cur-hash', type: { buffer: { length: 32 } } },
              { name: 'path', type: 'uint128' },
              {
                name: 'proof-hashes',
                type: { list: { length: 12, type: { buffer: { length: 32 } } } },
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
        name: 'inner-read-slice',
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
        name: 'inner-read-slice-1024',
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
        access: 'read_only',
        args: [
          { name: 'val', type: 'uint128' },
          { name: 'bit', type: 'uint128' },
        ],
        name: 'is-bit-set',
        outputs: { type: 'bool' },
      } as TypedAbiFunction<[val: number | bigint, bit: number | bigint], boolean>,
      parseBlockHeader: {
        access: 'read_only',
        args: [{ name: 'headerbuff', type: { buffer: { length: 80 } } }],
        name: 'parse-block-header',
        outputs: {
          type: {
            response: {
              error: 'uint128',
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
        access: 'read_only',
        args: [{ name: 'tx', type: { buffer: { length: 1024 } } }],
        name: 'parse-tx',
        outputs: {
          type: {
            response: {
              error: 'uint128',
              ok: {
                tuple: [
                  {
                    name: 'ins',
                    type: {
                      list: {
                        length: 8,
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
                      },
                    },
                  },
                  { name: 'locktime', type: 'uint128' },
                  {
                    name: 'outs',
                    type: {
                      list: {
                        length: 8,
                        type: {
                          tuple: [
                            { name: 'scriptPubKey', type: { buffer: { length: 128 } } },
                            { name: 'value', type: 'uint128' },
                          ],
                        },
                      },
                    },
                  },
                  { name: 'version', type: 'uint128' },
                ],
              },
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
        name: 'read-hashslice',
        outputs: {
          type: {
            response: {
              error: 'uint128',
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
        access: 'read_only',
        args: [
          { name: 'ignored', type: 'bool' },
          {
            name: 'state-res',
            type: {
              response: {
                error: 'uint128',
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
                          length: 8,
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
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        ],
        name: 'read-next-txin',
        outputs: {
          type: {
            response: {
              error: 'uint128',
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
                        length: 8,
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
                      },
                    },
                  },
                ],
              },
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
        access: 'read_only',
        args: [
          { name: 'ignored', type: 'bool' },
          {
            name: 'state-res',
            type: {
              response: {
                error: 'uint128',
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
                          length: 8,
                          type: {
                            tuple: [
                              { name: 'scriptPubKey', type: { buffer: { length: 128 } } },
                              { name: 'value', type: 'uint128' },
                            ],
                          },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        ],
        name: 'read-next-txout',
        outputs: {
          type: {
            response: {
              error: 'uint128',
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
                        length: 8,
                        type: {
                          tuple: [
                            { name: 'scriptPubKey', type: { buffer: { length: 128 } } },
                            { name: 'value', type: 'uint128' },
                          ],
                        },
                      },
                    },
                  },
                ],
              },
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
        access: 'read_only',
        args: [
          { name: 'data', type: { buffer: { length: 1024 } } },
          { name: 'offset', type: 'uint128' },
          { name: 'size', type: 'uint128' },
        ],
        name: 'read-slice',
        outputs: { type: { response: { error: 'uint128', ok: { buffer: { length: 1024 } } } } },
      } as TypedAbiFunction<
        [data: Uint8Array, offset: number | bigint, size: number | bigint],
        Response<Uint8Array, bigint>
      >,
      readSlice1: {
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
        name: 'read-slice-1',
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
        name: 'read-slice-128',
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
        name: 'read-slice-16',
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
        name: 'read-slice-2',
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
        name: 'read-slice-256',
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
        name: 'read-slice-32',
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
        name: 'read-slice-4',
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
        name: 'read-slice-512',
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
        name: 'read-slice-64',
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
        name: 'read-slice-8',
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
        name: 'read-txins',
        outputs: {
          type: {
            response: {
              error: 'uint128',
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
                        length: 8,
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
                      },
                    },
                  },
                ],
              },
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
        name: 'read-txouts',
        outputs: {
          type: {
            response: {
              error: 'uint128',
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
                        length: 8,
                        type: {
                          tuple: [
                            { name: 'scriptPubKey', type: { buffer: { length: 128 } } },
                            { name: 'value', type: 'uint128' },
                          ],
                        },
                      },
                    },
                  },
                ],
              },
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
        name: 'read-uint16',
        outputs: {
          type: {
            response: {
              error: 'uint128',
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
        name: 'read-uint32',
        outputs: {
          type: {
            response: {
              error: 'uint128',
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
        name: 'read-uint64',
        outputs: {
          type: {
            response: {
              error: 'uint128',
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
        name: 'read-varint',
        outputs: {
          type: {
            response: {
              error: 'uint128',
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
        name: 'read-varslice',
        outputs: {
          type: {
            response: {
              error: 'uint128',
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
        access: 'read_only',
        args: [{ name: 'input', type: { buffer: { length: 32 } } }],
        name: 'reverse-buff32',
        outputs: { type: { buffer: { length: 32 } } },
      } as TypedAbiFunction<[input: Uint8Array], Uint8Array>,
      verifyBlockHeader: {
        access: 'read_only',
        args: [
          { name: 'headerbuff', type: { buffer: { length: 80 } } },
          { name: 'expected-block-height', type: 'uint128' },
        ],
        name: 'verify-block-header',
        outputs: { type: 'bool' },
      } as TypedAbiFunction<
        [headerbuff: Uint8Array, expectedBlockHeight: number | bigint],
        boolean
      >,
      verifyMerkleProof: {
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
                  type: { list: { length: 12, type: { buffer: { length: 32 } } } },
                },
                { name: 'tree-depth', type: 'uint128' },
                { name: 'tx-index', type: 'uint128' },
              ],
            },
          },
        ],
        name: 'verify-merkle-proof',
        outputs: { type: { response: { error: 'uint128', ok: 'bool' } } },
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
        access: 'read_only',
        args: [
          { name: 'block', type: { buffer: { length: 80 } } },
          { name: 'parent', type: { buffer: { length: 80 } } },
        ],
        name: 'verify-prev-block',
        outputs: { type: { response: { error: 'uint128', ok: 'bool' } } },
      } as TypedAbiFunction<[block: Uint8Array, parent: Uint8Array], Response<boolean, bigint>>,
      verifyPrevBlocks: {
        access: 'read_only',
        args: [
          { name: 'block', type: { buffer: { length: 80 } } },
          { name: 'prev-blocks', type: { list: { length: 10, type: { buffer: { length: 80 } } } } },
        ],
        name: 'verify-prev-blocks',
        outputs: { type: { response: { error: 'uint128', ok: { buffer: { length: 80 } } } } },
      } as TypedAbiFunction<
        [block: Uint8Array, prevBlocks: Uint8Array[]],
        Response<Uint8Array, bigint>
      >,
      verifyPrevBlocksFold: {
        access: 'read_only',
        args: [
          { name: 'parent', type: { buffer: { length: 80 } } },
          {
            name: 'next-resp',
            type: { response: { error: 'uint128', ok: { buffer: { length: 80 } } } },
          },
        ],
        name: 'verify-prev-blocks-fold',
        outputs: { type: { response: { error: 'uint128', ok: { buffer: { length: 80 } } } } },
      } as TypedAbiFunction<
        [parent: Uint8Array, nextResp: Response<Uint8Array, bigint>],
        Response<Uint8Array, bigint>
      >,
      wasTxMinedPrev: {
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
          { name: 'prev-blocks', type: { list: { length: 10, type: { buffer: { length: 80 } } } } },
          { name: 'tx', type: { buffer: { length: 1024 } } },
          {
            name: 'proof',
            type: {
              tuple: [
                {
                  name: 'hashes',
                  type: { list: { length: 12, type: { buffer: { length: 32 } } } },
                },
                { name: 'tree-depth', type: 'uint128' },
                { name: 'tx-index', type: 'uint128' },
              ],
            },
          },
        ],
        name: 'was-tx-mined-prev?',
        outputs: { type: { response: { error: 'uint128', ok: 'bool' } } },
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
                  type: { list: { length: 12, type: { buffer: { length: 32 } } } },
                },
                { name: 'tree-depth', type: 'uint128' },
                { name: 'tx-index', type: 'uint128' },
              ],
            },
          },
        ],
        name: 'was-tx-mined?',
        outputs: { type: { response: { error: 'uint128', ok: 'bool' } } },
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
    variables: {
      BUFF_TO_BYTE: {
        access: 'constant',
        name: 'BUFF_TO_BYTE',
        type: {
          list: { length: 256, type: { buffer: { length: 1 } } },
        },
        defaultValue: [
          Uint8Array.from([0]),
          Uint8Array.from([1]),
          Uint8Array.from([2]),
          Uint8Array.from([3]),
          Uint8Array.from([4]),
          Uint8Array.from([5]),
          Uint8Array.from([6]),
          Uint8Array.from([7]),
          Uint8Array.from([8]),
          Uint8Array.from([9]),
          Uint8Array.from([10]),
          Uint8Array.from([11]),
          Uint8Array.from([12]),
          Uint8Array.from([13]),
          Uint8Array.from([14]),
          Uint8Array.from([15]),
          Uint8Array.from([16]),
          Uint8Array.from([17]),
          Uint8Array.from([18]),
          Uint8Array.from([19]),
          Uint8Array.from([20]),
          Uint8Array.from([21]),
          Uint8Array.from([22]),
          Uint8Array.from([23]),
          Uint8Array.from([24]),
          Uint8Array.from([25]),
          Uint8Array.from([26]),
          Uint8Array.from([27]),
          Uint8Array.from([28]),
          Uint8Array.from([29]),
          Uint8Array.from([30]),
          Uint8Array.from([31]),
          Uint8Array.from([32]),
          Uint8Array.from([33]),
          Uint8Array.from([34]),
          Uint8Array.from([35]),
          Uint8Array.from([36]),
          Uint8Array.from([37]),
          Uint8Array.from([38]),
          Uint8Array.from([39]),
          Uint8Array.from([40]),
          Uint8Array.from([41]),
          Uint8Array.from([42]),
          Uint8Array.from([43]),
          Uint8Array.from([44]),
          Uint8Array.from([45]),
          Uint8Array.from([46]),
          Uint8Array.from([47]),
          Uint8Array.from([48]),
          Uint8Array.from([49]),
          Uint8Array.from([50]),
          Uint8Array.from([51]),
          Uint8Array.from([52]),
          Uint8Array.from([53]),
          Uint8Array.from([54]),
          Uint8Array.from([55]),
          Uint8Array.from([56]),
          Uint8Array.from([57]),
          Uint8Array.from([58]),
          Uint8Array.from([59]),
          Uint8Array.from([60]),
          Uint8Array.from([61]),
          Uint8Array.from([62]),
          Uint8Array.from([63]),
          Uint8Array.from([64]),
          Uint8Array.from([65]),
          Uint8Array.from([66]),
          Uint8Array.from([67]),
          Uint8Array.from([68]),
          Uint8Array.from([69]),
          Uint8Array.from([70]),
          Uint8Array.from([71]),
          Uint8Array.from([72]),
          Uint8Array.from([73]),
          Uint8Array.from([74]),
          Uint8Array.from([75]),
          Uint8Array.from([76]),
          Uint8Array.from([77]),
          Uint8Array.from([78]),
          Uint8Array.from([79]),
          Uint8Array.from([80]),
          Uint8Array.from([81]),
          Uint8Array.from([82]),
          Uint8Array.from([83]),
          Uint8Array.from([84]),
          Uint8Array.from([85]),
          Uint8Array.from([86]),
          Uint8Array.from([87]),
          Uint8Array.from([88]),
          Uint8Array.from([89]),
          Uint8Array.from([90]),
          Uint8Array.from([91]),
          Uint8Array.from([92]),
          Uint8Array.from([93]),
          Uint8Array.from([94]),
          Uint8Array.from([95]),
          Uint8Array.from([96]),
          Uint8Array.from([97]),
          Uint8Array.from([98]),
          Uint8Array.from([99]),
          Uint8Array.from([100]),
          Uint8Array.from([101]),
          Uint8Array.from([102]),
          Uint8Array.from([103]),
          Uint8Array.from([104]),
          Uint8Array.from([105]),
          Uint8Array.from([106]),
          Uint8Array.from([107]),
          Uint8Array.from([108]),
          Uint8Array.from([109]),
          Uint8Array.from([110]),
          Uint8Array.from([111]),
          Uint8Array.from([112]),
          Uint8Array.from([113]),
          Uint8Array.from([114]),
          Uint8Array.from([115]),
          Uint8Array.from([116]),
          Uint8Array.from([117]),
          Uint8Array.from([118]),
          Uint8Array.from([119]),
          Uint8Array.from([120]),
          Uint8Array.from([121]),
          Uint8Array.from([122]),
          Uint8Array.from([123]),
          Uint8Array.from([124]),
          Uint8Array.from([125]),
          Uint8Array.from([126]),
          Uint8Array.from([127]),
          Uint8Array.from([128]),
          Uint8Array.from([129]),
          Uint8Array.from([130]),
          Uint8Array.from([131]),
          Uint8Array.from([132]),
          Uint8Array.from([133]),
          Uint8Array.from([134]),
          Uint8Array.from([135]),
          Uint8Array.from([136]),
          Uint8Array.from([137]),
          Uint8Array.from([138]),
          Uint8Array.from([139]),
          Uint8Array.from([140]),
          Uint8Array.from([141]),
          Uint8Array.from([142]),
          Uint8Array.from([143]),
          Uint8Array.from([144]),
          Uint8Array.from([145]),
          Uint8Array.from([146]),
          Uint8Array.from([147]),
          Uint8Array.from([148]),
          Uint8Array.from([149]),
          Uint8Array.from([150]),
          Uint8Array.from([151]),
          Uint8Array.from([152]),
          Uint8Array.from([153]),
          Uint8Array.from([154]),
          Uint8Array.from([155]),
          Uint8Array.from([156]),
          Uint8Array.from([157]),
          Uint8Array.from([158]),
          Uint8Array.from([159]),
          Uint8Array.from([160]),
          Uint8Array.from([161]),
          Uint8Array.from([162]),
          Uint8Array.from([163]),
          Uint8Array.from([164]),
          Uint8Array.from([165]),
          Uint8Array.from([166]),
          Uint8Array.from([167]),
          Uint8Array.from([168]),
          Uint8Array.from([169]),
          Uint8Array.from([170]),
          Uint8Array.from([171]),
          Uint8Array.from([172]),
          Uint8Array.from([173]),
          Uint8Array.from([174]),
          Uint8Array.from([175]),
          Uint8Array.from([176]),
          Uint8Array.from([177]),
          Uint8Array.from([178]),
          Uint8Array.from([179]),
          Uint8Array.from([180]),
          Uint8Array.from([181]),
          Uint8Array.from([182]),
          Uint8Array.from([183]),
          Uint8Array.from([184]),
          Uint8Array.from([185]),
          Uint8Array.from([186]),
          Uint8Array.from([187]),
          Uint8Array.from([188]),
          Uint8Array.from([189]),
          Uint8Array.from([190]),
          Uint8Array.from([191]),
          Uint8Array.from([192]),
          Uint8Array.from([193]),
          Uint8Array.from([194]),
          Uint8Array.from([195]),
          Uint8Array.from([196]),
          Uint8Array.from([197]),
          Uint8Array.from([198]),
          Uint8Array.from([199]),
          Uint8Array.from([200]),
          Uint8Array.from([201]),
          Uint8Array.from([202]),
          Uint8Array.from([203]),
          Uint8Array.from([204]),
          Uint8Array.from([205]),
          Uint8Array.from([206]),
          Uint8Array.from([207]),
          Uint8Array.from([208]),
          Uint8Array.from([209]),
          Uint8Array.from([210]),
          Uint8Array.from([211]),
          Uint8Array.from([212]),
          Uint8Array.from([213]),
          Uint8Array.from([214]),
          Uint8Array.from([215]),
          Uint8Array.from([216]),
          Uint8Array.from([217]),
          Uint8Array.from([218]),
          Uint8Array.from([219]),
          Uint8Array.from([220]),
          Uint8Array.from([221]),
          Uint8Array.from([222]),
          Uint8Array.from([223]),
          Uint8Array.from([224]),
          Uint8Array.from([225]),
          Uint8Array.from([226]),
          Uint8Array.from([227]),
          Uint8Array.from([228]),
          Uint8Array.from([229]),
          Uint8Array.from([230]),
          Uint8Array.from([231]),
          Uint8Array.from([232]),
          Uint8Array.from([233]),
          Uint8Array.from([234]),
          Uint8Array.from([235]),
          Uint8Array.from([236]),
          Uint8Array.from([237]),
          Uint8Array.from([238]),
          Uint8Array.from([239]),
          Uint8Array.from([240]),
          Uint8Array.from([241]),
          Uint8Array.from([242]),
          Uint8Array.from([243]),
          Uint8Array.from([244]),
          Uint8Array.from([245]),
          Uint8Array.from([246]),
          Uint8Array.from([247]),
          Uint8Array.from([248]),
          Uint8Array.from([249]),
          Uint8Array.from([250]),
          Uint8Array.from([251]),
          Uint8Array.from([252]),
          Uint8Array.from([253]),
          Uint8Array.from([254]),
          Uint8Array.from([255]),
        ],
      } as TypedAbiVariable<Uint8Array[]>,
      ERRBADHEADER: {
        access: 'constant',
        name: 'ERR-BAD-HEADER',
        type: 'uint128',
        defaultValue: 5n,
      } as TypedAbiVariable<bigint>,
      ERRINVALIDPARENT: {
        access: 'constant',
        name: 'ERR-INVALID-PARENT',
        type: 'uint128',
        defaultValue: 7n,
      } as TypedAbiVariable<bigint>,
      ERROUTOFBOUNDS: {
        access: 'constant',
        name: 'ERR-OUT-OF-BOUNDS',
        type: 'uint128',
        defaultValue: 1n,
      } as TypedAbiVariable<bigint>,
      ERRPROOFTOOSHORT: {
        access: 'constant',
        name: 'ERR-PROOF-TOO-SHORT',
        type: 'uint128',
        defaultValue: 6n,
      } as TypedAbiVariable<bigint>,
      ERRTOOMANYTXINS: {
        access: 'constant',
        name: 'ERR-TOO-MANY-TXINS',
        type: 'uint128',
        defaultValue: 2n,
      } as TypedAbiVariable<bigint>,
      ERRTOOMANYTXOUTS: {
        access: 'constant',
        name: 'ERR-TOO-MANY-TXOUTS',
        type: 'uint128',
        defaultValue: 3n,
      } as TypedAbiVariable<bigint>,
      ERRVARSLICETOOLONG: {
        access: 'constant',
        name: 'ERR-VARSLICE-TOO-LONG',
        type: 'uint128',
        defaultValue: 4n,
      } as TypedAbiVariable<bigint>,
      LIST_128: {
        access: 'constant',
        name: 'LIST_128',
        type: { list: { length: 128, type: 'bool' } },
        defaultValue: [
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
        ],
      } as TypedAbiVariable<boolean[]>,
      LIST_16: {
        access: 'constant',
        name: 'LIST_16',
        type: { list: { length: 16, type: 'bool' } },
        defaultValue: [
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
        ],
      } as TypedAbiVariable<boolean[]>,
      LIST_256: {
        access: 'constant',
        name: 'LIST_256',
        type: { list: { length: 256, type: 'bool' } },
        defaultValue: [
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
        ],
      } as TypedAbiVariable<boolean[]>,
      LIST_32: {
        access: 'constant',
        name: 'LIST_32',
        type: { list: { length: 32, type: 'bool' } },
        defaultValue: [
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
        ],
      } as TypedAbiVariable<boolean[]>,
      LIST_512: {
        access: 'constant',
        name: 'LIST_512',
        type: { list: { length: 512, type: 'bool' } },
        defaultValue: [
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
        ],
      } as TypedAbiVariable<boolean[]>,
      LIST_64: {
        access: 'constant',
        name: 'LIST_64',
        type: { list: { length: 64, type: 'bool' } },
        defaultValue: [
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
        ],
      } as TypedAbiVariable<boolean[]>,
    },
    maps: {},
    constants: {
      BUFF_TO_BYTE: [
        Uint8Array.from([0]),
        Uint8Array.from([1]),
        Uint8Array.from([2]),
        Uint8Array.from([3]),
        Uint8Array.from([4]),
        Uint8Array.from([5]),
        Uint8Array.from([6]),
        Uint8Array.from([7]),
        Uint8Array.from([8]),
        Uint8Array.from([9]),
        Uint8Array.from([10]),
        Uint8Array.from([11]),
        Uint8Array.from([12]),
        Uint8Array.from([13]),
        Uint8Array.from([14]),
        Uint8Array.from([15]),
        Uint8Array.from([16]),
        Uint8Array.from([17]),
        Uint8Array.from([18]),
        Uint8Array.from([19]),
        Uint8Array.from([20]),
        Uint8Array.from([21]),
        Uint8Array.from([22]),
        Uint8Array.from([23]),
        Uint8Array.from([24]),
        Uint8Array.from([25]),
        Uint8Array.from([26]),
        Uint8Array.from([27]),
        Uint8Array.from([28]),
        Uint8Array.from([29]),
        Uint8Array.from([30]),
        Uint8Array.from([31]),
        Uint8Array.from([32]),
        Uint8Array.from([33]),
        Uint8Array.from([34]),
        Uint8Array.from([35]),
        Uint8Array.from([36]),
        Uint8Array.from([37]),
        Uint8Array.from([38]),
        Uint8Array.from([39]),
        Uint8Array.from([40]),
        Uint8Array.from([41]),
        Uint8Array.from([42]),
        Uint8Array.from([43]),
        Uint8Array.from([44]),
        Uint8Array.from([45]),
        Uint8Array.from([46]),
        Uint8Array.from([47]),
        Uint8Array.from([48]),
        Uint8Array.from([49]),
        Uint8Array.from([50]),
        Uint8Array.from([51]),
        Uint8Array.from([52]),
        Uint8Array.from([53]),
        Uint8Array.from([54]),
        Uint8Array.from([55]),
        Uint8Array.from([56]),
        Uint8Array.from([57]),
        Uint8Array.from([58]),
        Uint8Array.from([59]),
        Uint8Array.from([60]),
        Uint8Array.from([61]),
        Uint8Array.from([62]),
        Uint8Array.from([63]),
        Uint8Array.from([64]),
        Uint8Array.from([65]),
        Uint8Array.from([66]),
        Uint8Array.from([67]),
        Uint8Array.from([68]),
        Uint8Array.from([69]),
        Uint8Array.from([70]),
        Uint8Array.from([71]),
        Uint8Array.from([72]),
        Uint8Array.from([73]),
        Uint8Array.from([74]),
        Uint8Array.from([75]),
        Uint8Array.from([76]),
        Uint8Array.from([77]),
        Uint8Array.from([78]),
        Uint8Array.from([79]),
        Uint8Array.from([80]),
        Uint8Array.from([81]),
        Uint8Array.from([82]),
        Uint8Array.from([83]),
        Uint8Array.from([84]),
        Uint8Array.from([85]),
        Uint8Array.from([86]),
        Uint8Array.from([87]),
        Uint8Array.from([88]),
        Uint8Array.from([89]),
        Uint8Array.from([90]),
        Uint8Array.from([91]),
        Uint8Array.from([92]),
        Uint8Array.from([93]),
        Uint8Array.from([94]),
        Uint8Array.from([95]),
        Uint8Array.from([96]),
        Uint8Array.from([97]),
        Uint8Array.from([98]),
        Uint8Array.from([99]),
        Uint8Array.from([100]),
        Uint8Array.from([101]),
        Uint8Array.from([102]),
        Uint8Array.from([103]),
        Uint8Array.from([104]),
        Uint8Array.from([105]),
        Uint8Array.from([106]),
        Uint8Array.from([107]),
        Uint8Array.from([108]),
        Uint8Array.from([109]),
        Uint8Array.from([110]),
        Uint8Array.from([111]),
        Uint8Array.from([112]),
        Uint8Array.from([113]),
        Uint8Array.from([114]),
        Uint8Array.from([115]),
        Uint8Array.from([116]),
        Uint8Array.from([117]),
        Uint8Array.from([118]),
        Uint8Array.from([119]),
        Uint8Array.from([120]),
        Uint8Array.from([121]),
        Uint8Array.from([122]),
        Uint8Array.from([123]),
        Uint8Array.from([124]),
        Uint8Array.from([125]),
        Uint8Array.from([126]),
        Uint8Array.from([127]),
        Uint8Array.from([128]),
        Uint8Array.from([129]),
        Uint8Array.from([130]),
        Uint8Array.from([131]),
        Uint8Array.from([132]),
        Uint8Array.from([133]),
        Uint8Array.from([134]),
        Uint8Array.from([135]),
        Uint8Array.from([136]),
        Uint8Array.from([137]),
        Uint8Array.from([138]),
        Uint8Array.from([139]),
        Uint8Array.from([140]),
        Uint8Array.from([141]),
        Uint8Array.from([142]),
        Uint8Array.from([143]),
        Uint8Array.from([144]),
        Uint8Array.from([145]),
        Uint8Array.from([146]),
        Uint8Array.from([147]),
        Uint8Array.from([148]),
        Uint8Array.from([149]),
        Uint8Array.from([150]),
        Uint8Array.from([151]),
        Uint8Array.from([152]),
        Uint8Array.from([153]),
        Uint8Array.from([154]),
        Uint8Array.from([155]),
        Uint8Array.from([156]),
        Uint8Array.from([157]),
        Uint8Array.from([158]),
        Uint8Array.from([159]),
        Uint8Array.from([160]),
        Uint8Array.from([161]),
        Uint8Array.from([162]),
        Uint8Array.from([163]),
        Uint8Array.from([164]),
        Uint8Array.from([165]),
        Uint8Array.from([166]),
        Uint8Array.from([167]),
        Uint8Array.from([168]),
        Uint8Array.from([169]),
        Uint8Array.from([170]),
        Uint8Array.from([171]),
        Uint8Array.from([172]),
        Uint8Array.from([173]),
        Uint8Array.from([174]),
        Uint8Array.from([175]),
        Uint8Array.from([176]),
        Uint8Array.from([177]),
        Uint8Array.from([178]),
        Uint8Array.from([179]),
        Uint8Array.from([180]),
        Uint8Array.from([181]),
        Uint8Array.from([182]),
        Uint8Array.from([183]),
        Uint8Array.from([184]),
        Uint8Array.from([185]),
        Uint8Array.from([186]),
        Uint8Array.from([187]),
        Uint8Array.from([188]),
        Uint8Array.from([189]),
        Uint8Array.from([190]),
        Uint8Array.from([191]),
        Uint8Array.from([192]),
        Uint8Array.from([193]),
        Uint8Array.from([194]),
        Uint8Array.from([195]),
        Uint8Array.from([196]),
        Uint8Array.from([197]),
        Uint8Array.from([198]),
        Uint8Array.from([199]),
        Uint8Array.from([200]),
        Uint8Array.from([201]),
        Uint8Array.from([202]),
        Uint8Array.from([203]),
        Uint8Array.from([204]),
        Uint8Array.from([205]),
        Uint8Array.from([206]),
        Uint8Array.from([207]),
        Uint8Array.from([208]),
        Uint8Array.from([209]),
        Uint8Array.from([210]),
        Uint8Array.from([211]),
        Uint8Array.from([212]),
        Uint8Array.from([213]),
        Uint8Array.from([214]),
        Uint8Array.from([215]),
        Uint8Array.from([216]),
        Uint8Array.from([217]),
        Uint8Array.from([218]),
        Uint8Array.from([219]),
        Uint8Array.from([220]),
        Uint8Array.from([221]),
        Uint8Array.from([222]),
        Uint8Array.from([223]),
        Uint8Array.from([224]),
        Uint8Array.from([225]),
        Uint8Array.from([226]),
        Uint8Array.from([227]),
        Uint8Array.from([228]),
        Uint8Array.from([229]),
        Uint8Array.from([230]),
        Uint8Array.from([231]),
        Uint8Array.from([232]),
        Uint8Array.from([233]),
        Uint8Array.from([234]),
        Uint8Array.from([235]),
        Uint8Array.from([236]),
        Uint8Array.from([237]),
        Uint8Array.from([238]),
        Uint8Array.from([239]),
        Uint8Array.from([240]),
        Uint8Array.from([241]),
        Uint8Array.from([242]),
        Uint8Array.from([243]),
        Uint8Array.from([244]),
        Uint8Array.from([245]),
        Uint8Array.from([246]),
        Uint8Array.from([247]),
        Uint8Array.from([248]),
        Uint8Array.from([249]),
        Uint8Array.from([250]),
        Uint8Array.from([251]),
        Uint8Array.from([252]),
        Uint8Array.from([253]),
        Uint8Array.from([254]),
        Uint8Array.from([255]),
      ],
      ERRBADHEADER: 5n,
      ERRINVALIDPARENT: 7n,
      ERROUTOFBOUNDS: 1n,
      ERRPROOFTOOSHORT: 6n,
      ERRTOOMANYTXINS: 2n,
      ERRTOOMANYTXOUTS: 3n,
      ERRVARSLICETOOLONG: 4n,
      LIST_128: [
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
      ],
      LIST_16: [
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
      ],
      LIST_256: [
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
      ],
      LIST_32: [
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
      ],
      LIST_512: [
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
      ],
      LIST_64: [
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
      ],
    },
    fungible_tokens: [],
    non_fungible_tokens: [],
    contractName: 'clarity-bitcoin',
    contractFile: 'contracts/clarity-bitcoin.clar',
  },
  bridge: {
    functions: {
      concatBuffsFold: {
        access: 'private',
        args: [
          { name: 'b', type: { buffer: { length: 32 } } },
          { name: 'result', type: { buffer: { length: 192 } } },
        ],
        name: 'concat-buffs-fold',
        outputs: { type: { buffer: { length: 192 } } },
      } as TypedAbiFunction<[b: Uint8Array, result: Uint8Array], Uint8Array>,
      transfer: {
        access: 'private',
        args: [
          { name: 'amount', type: 'uint128' },
          { name: 'sender', type: 'principal' },
          { name: 'recipient', type: 'principal' },
        ],
        name: 'transfer',
        outputs: { type: { response: { error: 'uint128', ok: 'bool' } } },
      } as TypedAbiFunction<
        [amount: number | bigint, sender: string, recipient: string],
        Response<boolean, bigint>
      >,
      updateUserInboundVolume: {
        access: 'private',
        args: [
          { name: 'user', type: 'principal' },
          { name: 'amount', type: 'uint128' },
        ],
        name: 'update-user-inbound-volume',
        outputs: { type: 'bool' },
      } as TypedAbiFunction<[user: string, amount: number | bigint], boolean>,
      updateUserOutboundVolume: {
        access: 'private',
        args: [
          { name: 'user', type: 'principal' },
          { name: 'amount', type: 'uint128' },
        ],
        name: 'update-user-outbound-volume',
        outputs: { type: 'bool' },
      } as TypedAbiFunction<[user: string, amount: number | bigint], boolean>,
      addFunds: {
        access: 'public',
        args: [{ name: 'amount', type: 'uint128' }],
        name: 'add-funds',
        outputs: { type: { response: { error: 'uint128', ok: 'uint128' } } },
      } as TypedAbiFunction<[amount: number | bigint], Response<bigint, bigint>>,
      escrowSwap: {
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
          { name: 'prev-blocks', type: { list: { length: 10, type: { buffer: { length: 80 } } } } },
          { name: 'tx', type: { buffer: { length: 1024 } } },
          {
            name: 'proof',
            type: {
              tuple: [
                {
                  name: 'hashes',
                  type: { list: { length: 12, type: { buffer: { length: 32 } } } },
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
        name: 'escrow-swap',
        outputs: {
          type: {
            response: {
              error: 'uint128',
              ok: {
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
          { name: 'prev-blocks', type: { list: { length: 10, type: { buffer: { length: 80 } } } } },
          { name: 'tx', type: { buffer: { length: 1024 } } },
          {
            name: 'proof',
            type: {
              tuple: [
                {
                  name: 'hashes',
                  type: { list: { length: 12, type: { buffer: { length: 32 } } } },
                },
                { name: 'tree-depth', type: 'uint128' },
                { name: 'tx-index', type: 'uint128' },
              ],
            },
          },
          { name: 'output-index', type: 'uint128' },
          { name: 'swap-id', type: 'uint128' },
        ],
        name: 'finalize-outbound-swap',
        outputs: { type: { response: { error: 'uint128', ok: 'bool' } } },
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
        access: 'public',
        args: [
          { name: 'txid', type: { buffer: { length: 32 } } },
          { name: 'preimage', type: { buffer: { length: 128 } } },
        ],
        name: 'finalize-swap',
        outputs: {
          type: {
            response: {
              error: 'uint128',
              ok: {
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
        access: 'public',
        args: [],
        name: 'initialize-swapper',
        outputs: { type: { response: { error: 'uint128', ok: 'uint128' } } },
      } as TypedAbiFunction<[], Response<bigint, bigint>>,
      initiateOutboundSwap: {
        access: 'public',
        args: [
          { name: 'xbtc', type: 'uint128' },
          { name: 'btc-version', type: { buffer: { length: 1 } } },
          { name: 'btc-hash', type: { buffer: { length: 20 } } },
          { name: 'supplier-id', type: 'uint128' },
        ],
        name: 'initiate-outbound-swap',
        outputs: { type: { response: { error: 'uint128', ok: 'uint128' } } },
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
        access: 'public',
        args: [
          { name: 'public-key', type: { buffer: { length: 33 } } },
          { name: 'inbound-fee', type: { optional: 'int128' } },
          { name: 'outbound-fee', type: { optional: 'int128' } },
          { name: 'outbound-base-fee', type: 'int128' },
          { name: 'inbound-base-fee', type: 'int128' },
          { name: 'name', type: { 'string-ascii': { length: 18 } } },
          { name: 'funds', type: 'uint128' },
        ],
        name: 'register-supplier',
        outputs: { type: { response: { error: 'uint128', ok: 'uint128' } } },
      } as TypedAbiFunction<
        [
          publicKey: Uint8Array,
          inboundFee: bigint | null,
          outboundFee: bigint | null,
          outboundBaseFee: number | bigint,
          inboundBaseFee: number | bigint,
          name: string,
          funds: number | bigint
        ],
        Response<bigint, bigint>
      >,
      removeFunds: {
        access: 'public',
        args: [{ name: 'amount', type: 'uint128' }],
        name: 'remove-funds',
        outputs: { type: { response: { error: 'uint128', ok: 'uint128' } } },
      } as TypedAbiFunction<[amount: number | bigint], Response<bigint, bigint>>,
      revokeExpiredInbound: {
        access: 'public',
        args: [{ name: 'txid', type: { buffer: { length: 32 } } }],
        name: 'revoke-expired-inbound',
        outputs: {
          type: {
            response: {
              error: 'uint128',
              ok: {
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
        access: 'public',
        args: [{ name: 'swap-id', type: 'uint128' }],
        name: 'revoke-expired-outbound',
        outputs: {
          type: {
            response: {
              error: 'uint128',
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
        access: 'public',
        args: [
          { name: 'inbound-fee', type: { optional: 'int128' } },
          { name: 'outbound-fee', type: { optional: 'int128' } },
          { name: 'outbound-base-fee', type: 'int128' },
          { name: 'inbound-base-fee', type: 'int128' },
        ],
        name: 'update-supplier-fees',
        outputs: {
          type: {
            response: {
              error: 'uint128',
              ok: {
                tuple: [
                  { name: 'controller', type: 'principal' },
                  { name: 'inbound-base-fee', type: 'int128' },
                  { name: 'inbound-fee', type: { optional: 'int128' } },
                  { name: 'name', type: { 'string-ascii': { length: 18 } } },
                  { name: 'outbound-base-fee', type: 'int128' },
                  { name: 'outbound-fee', type: { optional: 'int128' } },
                  { name: 'public-key', type: { buffer: { length: 33 } } },
                ],
              },
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
            name: string;
            'outbound-base-fee': bigint;
            'outbound-fee': bigint | null;
            'public-key': Uint8Array;
          },
          bigint
        >
      >,
      updateSupplierName: {
        access: 'public',
        args: [{ name: 'name', type: { 'string-ascii': { length: 18 } } }],
        name: 'update-supplier-name',
        outputs: {
          type: {
            response: {
              error: 'uint128',
              ok: {
                tuple: [
                  { name: 'controller', type: 'principal' },
                  { name: 'inbound-base-fee', type: 'int128' },
                  { name: 'inbound-fee', type: { optional: 'int128' } },
                  { name: 'name', type: { 'string-ascii': { length: 18 } } },
                  { name: 'outbound-base-fee', type: 'int128' },
                  { name: 'outbound-fee', type: { optional: 'int128' } },
                  { name: 'public-key', type: { buffer: { length: 33 } } },
                ],
              },
            },
          },
        },
      } as TypedAbiFunction<
        [name: string],
        Response<
          {
            controller: string;
            'inbound-base-fee': bigint;
            'inbound-fee': bigint | null;
            name: string;
            'outbound-base-fee': bigint;
            'outbound-fee': bigint | null;
            'public-key': Uint8Array;
          },
          bigint
        >
      >,
      updateSupplierPublicKey: {
        access: 'public',
        args: [{ name: 'public-key', type: { buffer: { length: 33 } } }],
        name: 'update-supplier-public-key',
        outputs: {
          type: {
            response: {
              error: 'uint128',
              ok: {
                tuple: [
                  { name: 'controller', type: 'principal' },
                  { name: 'inbound-base-fee', type: 'int128' },
                  { name: 'inbound-fee', type: { optional: 'int128' } },
                  { name: 'name', type: { 'string-ascii': { length: 18 } } },
                  { name: 'outbound-base-fee', type: 'int128' },
                  { name: 'outbound-fee', type: { optional: 'int128' } },
                  { name: 'public-key', type: { buffer: { length: 33 } } },
                ],
              },
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
            name: string;
            'outbound-base-fee': bigint;
            'outbound-fee': bigint | null;
            'public-key': Uint8Array;
          },
          bigint
        >
      >,
      buffToU8: {
        access: 'read_only',
        args: [{ name: 'byte', type: { buffer: { length: 1 } } }],
        name: 'buff-to-u8',
        outputs: { type: 'uint128' },
      } as TypedAbiFunction<[byte: Uint8Array], bigint>,
      bytesLen: {
        access: 'read_only',
        args: [{ name: 'bytes', type: { buffer: { length: 4 } } }],
        name: 'bytes-len',
        outputs: { type: { buffer: { length: 1 } } },
      } as TypedAbiFunction<[bytes: Uint8Array], Uint8Array>,
      concatBuffs: {
        access: 'read_only',
        args: [{ name: 'buffs', type: { list: { length: 6, type: { buffer: { length: 32 } } } } }],
        name: 'concat-buffs',
        outputs: { type: { buffer: { length: 192 } } },
      } as TypedAbiFunction<[buffs: Uint8Array[]], Uint8Array>,
      generateHtlcScript: {
        access: 'read_only',
        args: [
          { name: 'sender', type: { buffer: { length: 33 } } },
          { name: 'recipient', type: { buffer: { length: 33 } } },
          { name: 'expiration', type: { buffer: { length: 4 } } },
          { name: 'hash', type: { buffer: { length: 32 } } },
          { name: 'swapper', type: { buffer: { length: 4 } } },
        ],
        name: 'generate-htlc-script',
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
        access: 'read_only',
        args: [
          { name: 'sender', type: { buffer: { length: 33 } } },
          { name: 'recipient', type: { buffer: { length: 33 } } },
          { name: 'expiration', type: { buffer: { length: 4 } } },
          { name: 'hash', type: { buffer: { length: 32 } } },
          { name: 'swapper', type: { buffer: { length: 4 } } },
        ],
        name: 'generate-htlc-script-hash',
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
        access: 'read_only',
        args: [
          { name: 'version', type: { buffer: { length: 1 } } },
          { name: 'hash', type: { buffer: { length: 20 } } },
        ],
        name: 'generate-output',
        outputs: { type: { buffer: { length: 25 } } },
      } as TypedAbiFunction<[version: Uint8Array, hash: Uint8Array], Uint8Array>,
      generateP2pkhOutput: {
        access: 'read_only',
        args: [{ name: 'hash', type: { buffer: { length: 20 } } }],
        name: 'generate-p2pkh-output',
        outputs: { type: { buffer: { length: 25 } } },
      } as TypedAbiFunction<[hash: Uint8Array], Uint8Array>,
      generateP2shOutput: {
        access: 'read_only',
        args: [{ name: 'hash', type: { buffer: { length: 20 } } }],
        name: 'generate-p2sh-output',
        outputs: { type: { buffer: { length: 23 } } },
      } as TypedAbiFunction<[hash: Uint8Array], Uint8Array>,
      generateScriptHash: {
        access: 'read_only',
        args: [{ name: 'script', type: { buffer: { length: 120 } } }],
        name: 'generate-script-hash',
        outputs: { type: { buffer: { length: 23 } } },
      } as TypedAbiFunction<[script: Uint8Array], Uint8Array>,
      getAmountWithFeeRate: {
        access: 'read_only',
        args: [
          { name: 'amount', type: 'uint128' },
          { name: 'fee-rate', type: 'int128' },
        ],
        name: 'get-amount-with-fee-rate',
        outputs: { type: 'int128' },
      } as TypedAbiFunction<[amount: number | bigint, feeRate: number | bigint], bigint>,
      getCompletedOutboundSwapByTxid: {
        access: 'read_only',
        args: [{ name: 'txid', type: { buffer: { length: 32 } } }],
        name: 'get-completed-outbound-swap-by-txid',
        outputs: { type: { optional: 'uint128' } },
      } as TypedAbiFunction<[txid: Uint8Array], bigint | null>,
      getCompletedOutboundSwapTxid: {
        access: 'read_only',
        args: [{ name: 'id', type: 'uint128' }],
        name: 'get-completed-outbound-swap-txid',
        outputs: { type: { optional: { buffer: { length: 32 } } } },
      } as TypedAbiFunction<[id: number | bigint], Uint8Array | null>,
      getEscrow: {
        access: 'read_only',
        args: [{ name: 'id', type: 'uint128' }],
        name: 'get-escrow',
        outputs: { type: { optional: 'uint128' } },
      } as TypedAbiFunction<[id: number | bigint], bigint | null>,
      getFullInbound: {
        access: 'read_only',
        args: [{ name: 'txid', type: { buffer: { length: 32 } } }],
        name: 'get-full-inbound',
        outputs: {
          type: {
            response: {
              error: 'uint128',
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
        access: 'read_only',
        args: [{ name: 'id', type: 'uint128' }],
        name: 'get-full-supplier',
        outputs: {
          type: {
            response: {
              error: 'uint128',
              ok: {
                tuple: [
                  { name: 'controller', type: 'principal' },
                  { name: 'escrow', type: 'uint128' },
                  { name: 'funds', type: 'uint128' },
                  { name: 'inbound-base-fee', type: 'int128' },
                  { name: 'inbound-fee', type: { optional: 'int128' } },
                  { name: 'name', type: { 'string-ascii': { length: 18 } } },
                  { name: 'outbound-base-fee', type: 'int128' },
                  { name: 'outbound-fee', type: { optional: 'int128' } },
                  { name: 'public-key', type: { buffer: { length: 33 } } },
                ],
              },
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
            name: string;
            'outbound-base-fee': bigint;
            'outbound-fee': bigint | null;
            'public-key': Uint8Array;
          },
          bigint
        >
      >,
      getFunds: {
        access: 'read_only',
        args: [{ name: 'id', type: 'uint128' }],
        name: 'get-funds',
        outputs: { type: 'uint128' },
      } as TypedAbiFunction<[id: number | bigint], bigint>,
      getInboundMeta: {
        access: 'read_only',
        args: [{ name: 'txid', type: { buffer: { length: 32 } } }],
        name: 'get-inbound-meta',
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
        access: 'read_only',
        args: [{ name: 'txid', type: { buffer: { length: 32 } } }],
        name: 'get-inbound-swap',
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
        access: 'read_only',
        args: [],
        name: 'get-next-outbound-id',
        outputs: { type: 'uint128' },
      } as TypedAbiFunction<[], bigint>,
      getNextSupplierId: {
        access: 'read_only',
        args: [],
        name: 'get-next-supplier-id',
        outputs: { type: 'uint128' },
      } as TypedAbiFunction<[], bigint>,
      getNextSwapperId: {
        access: 'read_only',
        args: [],
        name: 'get-next-swapper-id',
        outputs: { type: 'uint128' },
      } as TypedAbiFunction<[], bigint>,
      getOutboundSwap: {
        access: 'read_only',
        args: [{ name: 'id', type: 'uint128' }],
        name: 'get-outbound-swap',
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
        access: 'read_only',
        args: [{ name: 'txid', type: { buffer: { length: 32 } } }],
        name: 'get-preimage',
        outputs: { type: { optional: { buffer: { length: 128 } } } },
      } as TypedAbiFunction<[txid: Uint8Array], Uint8Array | null>,
      getSupplier: {
        access: 'read_only',
        args: [{ name: 'id', type: 'uint128' }],
        name: 'get-supplier',
        outputs: {
          type: {
            optional: {
              tuple: [
                { name: 'controller', type: 'principal' },
                { name: 'inbound-base-fee', type: 'int128' },
                { name: 'inbound-fee', type: { optional: 'int128' } },
                { name: 'name', type: { 'string-ascii': { length: 18 } } },
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
          name: string;
          'outbound-base-fee': bigint;
          'outbound-fee': bigint | null;
          'public-key': Uint8Array;
        } | null
      >,
      getSupplierByName: {
        access: 'read_only',
        args: [{ name: 'name', type: { 'string-ascii': { length: 18 } } }],
        name: 'get-supplier-by-name',
        outputs: { type: { optional: 'uint128' } },
      } as TypedAbiFunction<[name: string], bigint | null>,
      getSupplierIdByController: {
        access: 'read_only',
        args: [{ name: 'controller', type: 'principal' }],
        name: 'get-supplier-id-by-controller',
        outputs: { type: { optional: 'uint128' } },
      } as TypedAbiFunction<[controller: string], bigint | null>,
      getSupplierIdByPublicKey: {
        access: 'read_only',
        args: [{ name: 'public-key', type: { buffer: { length: 33 } } }],
        name: 'get-supplier-id-by-public-key',
        outputs: { type: { optional: 'uint128' } },
      } as TypedAbiFunction<[publicKey: Uint8Array], bigint | null>,
      getSwapAmount: {
        access: 'read_only',
        args: [
          { name: 'amount', type: 'uint128' },
          { name: 'fee-rate', type: 'int128' },
          { name: 'base-fee', type: 'int128' },
        ],
        name: 'get-swap-amount',
        outputs: { type: { response: { error: 'uint128', ok: 'uint128' } } },
      } as TypedAbiFunction<
        [amount: number | bigint, feeRate: number | bigint, baseFee: number | bigint],
        Response<bigint, bigint>
      >,
      getSwapperId: {
        access: 'read_only',
        args: [{ name: 'swapper', type: 'principal' }],
        name: 'get-swapper-id',
        outputs: { type: { optional: 'uint128' } },
      } as TypedAbiFunction<[swapper: string], bigint | null>,
      getSwapperPrincipal: {
        access: 'read_only',
        args: [{ name: 'id', type: 'uint128' }],
        name: 'get-swapper-principal',
        outputs: { type: { optional: 'principal' } },
      } as TypedAbiFunction<[id: number | bigint], string | null>,
      getTotalInboundVolume: {
        access: 'read_only',
        args: [],
        name: 'get-total-inbound-volume',
        outputs: { type: 'uint128' },
      } as TypedAbiFunction<[], bigint>,
      getTotalOutboundVolume: {
        access: 'read_only',
        args: [],
        name: 'get-total-outbound-volume',
        outputs: { type: 'uint128' },
      } as TypedAbiFunction<[], bigint>,
      getTotalVolume: {
        access: 'read_only',
        args: [],
        name: 'get-total-volume',
        outputs: { type: 'uint128' },
      } as TypedAbiFunction<[], bigint>,
      getUserInboundVolume: {
        access: 'read_only',
        args: [{ name: 'user', type: 'principal' }],
        name: 'get-user-inbound-volume',
        outputs: { type: 'uint128' },
      } as TypedAbiFunction<[user: string], bigint>,
      getUserOutboundVolume: {
        access: 'read_only',
        args: [{ name: 'user', type: 'principal' }],
        name: 'get-user-outbound-volume',
        outputs: { type: 'uint128' },
      } as TypedAbiFunction<[user: string], bigint>,
      getUserTotalVolume: {
        access: 'read_only',
        args: [{ name: 'user', type: 'principal' }],
        name: 'get-user-total-volume',
        outputs: { type: 'uint128' },
      } as TypedAbiFunction<[user: string], bigint>,
      readUint32: {
        access: 'read_only',
        args: [
          { name: 'num', type: { buffer: { length: 4 } } },
          { name: 'length', type: 'uint128' },
        ],
        name: 'read-uint32',
        outputs: { type: { response: { error: 'uint128', ok: 'uint128' } } },
      } as TypedAbiFunction<[num: Uint8Array, length: number | bigint], Response<bigint, bigint>>,
      validateBtcAddr: {
        access: 'read_only',
        args: [
          { name: 'version', type: { buffer: { length: 1 } } },
          { name: 'hash', type: { buffer: { length: 20 } } },
        ],
        name: 'validate-btc-addr',
        outputs: { type: { response: { error: 'uint128', ok: 'bool' } } },
      } as TypedAbiFunction<[version: Uint8Array, hash: Uint8Array], Response<boolean, bigint>>,
      validateExpiration: {
        access: 'read_only',
        args: [
          { name: 'expiration', type: 'uint128' },
          { name: 'mined-height', type: 'uint128' },
        ],
        name: 'validate-expiration',
        outputs: { type: { response: { error: 'uint128', ok: 'bool' } } },
      } as TypedAbiFunction<
        [expiration: number | bigint, minedHeight: number | bigint],
        Response<boolean, bigint>
      >,
      validateFee: {
        access: 'read_only',
        args: [{ name: 'fee-opt', type: { optional: 'int128' } }],
        name: 'validate-fee',
        outputs: { type: { response: { error: 'uint128', ok: 'bool' } } },
      } as TypedAbiFunction<[feeOpt: bigint | null], Response<boolean, bigint>>,
      validateOutboundRevocable: {
        access: 'read_only',
        args: [{ name: 'swap-id', type: 'uint128' }],
        name: 'validate-outbound-revocable',
        outputs: {
          type: {
            response: {
              error: 'uint128',
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
    variables: {
      BUFF_TO_BYTE: {
        access: 'constant',
        name: 'BUFF_TO_BYTE',
        type: {
          list: { length: 256, type: { buffer: { length: 1 } } },
        },
        defaultValue: [
          Uint8Array.from([0]),
          Uint8Array.from([1]),
          Uint8Array.from([2]),
          Uint8Array.from([3]),
          Uint8Array.from([4]),
          Uint8Array.from([5]),
          Uint8Array.from([6]),
          Uint8Array.from([7]),
          Uint8Array.from([8]),
          Uint8Array.from([9]),
          Uint8Array.from([10]),
          Uint8Array.from([11]),
          Uint8Array.from([12]),
          Uint8Array.from([13]),
          Uint8Array.from([14]),
          Uint8Array.from([15]),
          Uint8Array.from([16]),
          Uint8Array.from([17]),
          Uint8Array.from([18]),
          Uint8Array.from([19]),
          Uint8Array.from([20]),
          Uint8Array.from([21]),
          Uint8Array.from([22]),
          Uint8Array.from([23]),
          Uint8Array.from([24]),
          Uint8Array.from([25]),
          Uint8Array.from([26]),
          Uint8Array.from([27]),
          Uint8Array.from([28]),
          Uint8Array.from([29]),
          Uint8Array.from([30]),
          Uint8Array.from([31]),
          Uint8Array.from([32]),
          Uint8Array.from([33]),
          Uint8Array.from([34]),
          Uint8Array.from([35]),
          Uint8Array.from([36]),
          Uint8Array.from([37]),
          Uint8Array.from([38]),
          Uint8Array.from([39]),
          Uint8Array.from([40]),
          Uint8Array.from([41]),
          Uint8Array.from([42]),
          Uint8Array.from([43]),
          Uint8Array.from([44]),
          Uint8Array.from([45]),
          Uint8Array.from([46]),
          Uint8Array.from([47]),
          Uint8Array.from([48]),
          Uint8Array.from([49]),
          Uint8Array.from([50]),
          Uint8Array.from([51]),
          Uint8Array.from([52]),
          Uint8Array.from([53]),
          Uint8Array.from([54]),
          Uint8Array.from([55]),
          Uint8Array.from([56]),
          Uint8Array.from([57]),
          Uint8Array.from([58]),
          Uint8Array.from([59]),
          Uint8Array.from([60]),
          Uint8Array.from([61]),
          Uint8Array.from([62]),
          Uint8Array.from([63]),
          Uint8Array.from([64]),
          Uint8Array.from([65]),
          Uint8Array.from([66]),
          Uint8Array.from([67]),
          Uint8Array.from([68]),
          Uint8Array.from([69]),
          Uint8Array.from([70]),
          Uint8Array.from([71]),
          Uint8Array.from([72]),
          Uint8Array.from([73]),
          Uint8Array.from([74]),
          Uint8Array.from([75]),
          Uint8Array.from([76]),
          Uint8Array.from([77]),
          Uint8Array.from([78]),
          Uint8Array.from([79]),
          Uint8Array.from([80]),
          Uint8Array.from([81]),
          Uint8Array.from([82]),
          Uint8Array.from([83]),
          Uint8Array.from([84]),
          Uint8Array.from([85]),
          Uint8Array.from([86]),
          Uint8Array.from([87]),
          Uint8Array.from([88]),
          Uint8Array.from([89]),
          Uint8Array.from([90]),
          Uint8Array.from([91]),
          Uint8Array.from([92]),
          Uint8Array.from([93]),
          Uint8Array.from([94]),
          Uint8Array.from([95]),
          Uint8Array.from([96]),
          Uint8Array.from([97]),
          Uint8Array.from([98]),
          Uint8Array.from([99]),
          Uint8Array.from([100]),
          Uint8Array.from([101]),
          Uint8Array.from([102]),
          Uint8Array.from([103]),
          Uint8Array.from([104]),
          Uint8Array.from([105]),
          Uint8Array.from([106]),
          Uint8Array.from([107]),
          Uint8Array.from([108]),
          Uint8Array.from([109]),
          Uint8Array.from([110]),
          Uint8Array.from([111]),
          Uint8Array.from([112]),
          Uint8Array.from([113]),
          Uint8Array.from([114]),
          Uint8Array.from([115]),
          Uint8Array.from([116]),
          Uint8Array.from([117]),
          Uint8Array.from([118]),
          Uint8Array.from([119]),
          Uint8Array.from([120]),
          Uint8Array.from([121]),
          Uint8Array.from([122]),
          Uint8Array.from([123]),
          Uint8Array.from([124]),
          Uint8Array.from([125]),
          Uint8Array.from([126]),
          Uint8Array.from([127]),
          Uint8Array.from([128]),
          Uint8Array.from([129]),
          Uint8Array.from([130]),
          Uint8Array.from([131]),
          Uint8Array.from([132]),
          Uint8Array.from([133]),
          Uint8Array.from([134]),
          Uint8Array.from([135]),
          Uint8Array.from([136]),
          Uint8Array.from([137]),
          Uint8Array.from([138]),
          Uint8Array.from([139]),
          Uint8Array.from([140]),
          Uint8Array.from([141]),
          Uint8Array.from([142]),
          Uint8Array.from([143]),
          Uint8Array.from([144]),
          Uint8Array.from([145]),
          Uint8Array.from([146]),
          Uint8Array.from([147]),
          Uint8Array.from([148]),
          Uint8Array.from([149]),
          Uint8Array.from([150]),
          Uint8Array.from([151]),
          Uint8Array.from([152]),
          Uint8Array.from([153]),
          Uint8Array.from([154]),
          Uint8Array.from([155]),
          Uint8Array.from([156]),
          Uint8Array.from([157]),
          Uint8Array.from([158]),
          Uint8Array.from([159]),
          Uint8Array.from([160]),
          Uint8Array.from([161]),
          Uint8Array.from([162]),
          Uint8Array.from([163]),
          Uint8Array.from([164]),
          Uint8Array.from([165]),
          Uint8Array.from([166]),
          Uint8Array.from([167]),
          Uint8Array.from([168]),
          Uint8Array.from([169]),
          Uint8Array.from([170]),
          Uint8Array.from([171]),
          Uint8Array.from([172]),
          Uint8Array.from([173]),
          Uint8Array.from([174]),
          Uint8Array.from([175]),
          Uint8Array.from([176]),
          Uint8Array.from([177]),
          Uint8Array.from([178]),
          Uint8Array.from([179]),
          Uint8Array.from([180]),
          Uint8Array.from([181]),
          Uint8Array.from([182]),
          Uint8Array.from([183]),
          Uint8Array.from([184]),
          Uint8Array.from([185]),
          Uint8Array.from([186]),
          Uint8Array.from([187]),
          Uint8Array.from([188]),
          Uint8Array.from([189]),
          Uint8Array.from([190]),
          Uint8Array.from([191]),
          Uint8Array.from([192]),
          Uint8Array.from([193]),
          Uint8Array.from([194]),
          Uint8Array.from([195]),
          Uint8Array.from([196]),
          Uint8Array.from([197]),
          Uint8Array.from([198]),
          Uint8Array.from([199]),
          Uint8Array.from([200]),
          Uint8Array.from([201]),
          Uint8Array.from([202]),
          Uint8Array.from([203]),
          Uint8Array.from([204]),
          Uint8Array.from([205]),
          Uint8Array.from([206]),
          Uint8Array.from([207]),
          Uint8Array.from([208]),
          Uint8Array.from([209]),
          Uint8Array.from([210]),
          Uint8Array.from([211]),
          Uint8Array.from([212]),
          Uint8Array.from([213]),
          Uint8Array.from([214]),
          Uint8Array.from([215]),
          Uint8Array.from([216]),
          Uint8Array.from([217]),
          Uint8Array.from([218]),
          Uint8Array.from([219]),
          Uint8Array.from([220]),
          Uint8Array.from([221]),
          Uint8Array.from([222]),
          Uint8Array.from([223]),
          Uint8Array.from([224]),
          Uint8Array.from([225]),
          Uint8Array.from([226]),
          Uint8Array.from([227]),
          Uint8Array.from([228]),
          Uint8Array.from([229]),
          Uint8Array.from([230]),
          Uint8Array.from([231]),
          Uint8Array.from([232]),
          Uint8Array.from([233]),
          Uint8Array.from([234]),
          Uint8Array.from([235]),
          Uint8Array.from([236]),
          Uint8Array.from([237]),
          Uint8Array.from([238]),
          Uint8Array.from([239]),
          Uint8Array.from([240]),
          Uint8Array.from([241]),
          Uint8Array.from([242]),
          Uint8Array.from([243]),
          Uint8Array.from([244]),
          Uint8Array.from([245]),
          Uint8Array.from([246]),
          Uint8Array.from([247]),
          Uint8Array.from([248]),
          Uint8Array.from([249]),
          Uint8Array.from([250]),
          Uint8Array.from([251]),
          Uint8Array.from([252]),
          Uint8Array.from([253]),
          Uint8Array.from([254]),
          Uint8Array.from([255]),
        ],
      } as TypedAbiVariable<Uint8Array[]>,
      ERR_ADD_FUNDS: {
        access: 'constant',
        name: 'ERR_ADD_FUNDS',
        type: { response: { error: 'uint128', ok: 'none' } },
        defaultValue: { isOk: false, value: 4n },
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_ALREADY_FINALIZED: {
        access: 'constant',
        name: 'ERR_ALREADY_FINALIZED',
        type: { response: { error: 'uint128', ok: 'none' } },
        defaultValue: { isOk: false, value: 17n },
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_ESCROW_EXPIRED: {
        access: 'constant',
        name: 'ERR_ESCROW_EXPIRED',
        type: { response: { error: 'uint128', ok: 'none' } },
        defaultValue: { isOk: false, value: 20n },
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_FEE_INVALID: {
        access: 'constant',
        name: 'ERR_FEE_INVALID',
        type: { response: { error: 'uint128', ok: 'none' } },
        defaultValue: { isOk: false, value: 8n },
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_INCONSISTENT_FEES: {
        access: 'constant',
        name: 'ERR_INCONSISTENT_FEES',
        type: { response: { error: 'uint128', ok: 'none' } },
        defaultValue: { isOk: false, value: 27n },
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_INSUFFICIENT_AMOUNT: {
        access: 'constant',
        name: 'ERR_INSUFFICIENT_AMOUNT',
        type: { response: { error: 'uint128', ok: 'none' } },
        defaultValue: { isOk: false, value: 24n },
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_INSUFFICIENT_FUNDS: {
        access: 'constant',
        name: 'ERR_INSUFFICIENT_FUNDS',
        type: { response: { error: 'uint128', ok: 'none' } },
        defaultValue: { isOk: false, value: 14n },
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_INVALID_BTC_ADDR: {
        access: 'constant',
        name: 'ERR_INVALID_BTC_ADDR',
        type: { response: { error: 'uint128', ok: 'none' } },
        defaultValue: { isOk: false, value: 22n },
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_INVALID_ESCROW: {
        access: 'constant',
        name: 'ERR_INVALID_ESCROW',
        type: { response: { error: 'uint128', ok: 'none' } },
        defaultValue: { isOk: false, value: 18n },
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_INVALID_EXPIRATION: {
        access: 'constant',
        name: 'ERR_INVALID_EXPIRATION',
        type: { response: { error: 'uint128', ok: 'none' } },
        defaultValue: { isOk: false, value: 15n },
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_INVALID_HASH: {
        access: 'constant',
        name: 'ERR_INVALID_HASH',
        type: { response: { error: 'uint128', ok: 'none' } },
        defaultValue: { isOk: false, value: 12n },
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_INVALID_OUTPUT: {
        access: 'constant',
        name: 'ERR_INVALID_OUTPUT',
        type: { response: { error: 'uint128', ok: 'none' } },
        defaultValue: { isOk: false, value: 11n },
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_INVALID_PREIMAGE: {
        access: 'constant',
        name: 'ERR_INVALID_PREIMAGE',
        type: { response: { error: 'uint128', ok: 'none' } },
        defaultValue: { isOk: false, value: 19n },
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_INVALID_SUPPLIER: {
        access: 'constant',
        name: 'ERR_INVALID_SUPPLIER',
        type: { response: { error: 'uint128', ok: 'none' } },
        defaultValue: { isOk: false, value: 13n },
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_INVALID_TX: {
        access: 'constant',
        name: 'ERR_INVALID_TX',
        type: { response: { error: 'uint128', ok: 'none' } },
        defaultValue: { isOk: false, value: 10n },
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_PANIC: {
        access: 'constant',
        name: 'ERR_PANIC',
        type: { response: { error: 'uint128', ok: 'none' } },
        defaultValue: { isOk: false, value: 1n },
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_READ_UINT: {
        access: 'constant',
        name: 'ERR_READ_UINT',
        type: { response: { error: 'uint128', ok: 'none' } },
        defaultValue: { isOk: false, value: 100n },
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_REVOKE_INBOUND_IS_FINALIZED: {
        access: 'constant',
        name: 'ERR_REVOKE_INBOUND_IS_FINALIZED',
        type: { response: { error: 'uint128', ok: 'none' } },
        defaultValue: { isOk: false, value: 29n },
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_REVOKE_INBOUND_NOT_EXPIRED: {
        access: 'constant',
        name: 'ERR_REVOKE_INBOUND_NOT_EXPIRED',
        type: { response: { error: 'uint128', ok: 'none' } },
        defaultValue: { isOk: false, value: 28n },
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_REVOKE_OUTBOUND_IS_FINALIZED: {
        access: 'constant',
        name: 'ERR_REVOKE_OUTBOUND_IS_FINALIZED',
        type: { response: { error: 'uint128', ok: 'none' } },
        defaultValue: { isOk: false, value: 26n },
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_REVOKE_OUTBOUND_NOT_EXPIRED: {
        access: 'constant',
        name: 'ERR_REVOKE_OUTBOUND_NOT_EXPIRED',
        type: { response: { error: 'uint128', ok: 'none' } },
        defaultValue: { isOk: false, value: 25n },
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_SUPPLIER_EXISTS: {
        access: 'constant',
        name: 'ERR_SUPPLIER_EXISTS',
        type: { response: { error: 'uint128', ok: 'none' } },
        defaultValue: { isOk: false, value: 2n },
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_SUPPLIER_NOT_FOUND: {
        access: 'constant',
        name: 'ERR_SUPPLIER_NOT_FOUND',
        type: { response: { error: 'uint128', ok: 'none' } },
        defaultValue: { isOk: false, value: 6n },
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_SWAPPER_EXISTS: {
        access: 'constant',
        name: 'ERR_SWAPPER_EXISTS',
        type: { response: { error: 'uint128', ok: 'none' } },
        defaultValue: { isOk: false, value: 9n },
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_SWAPPER_NOT_FOUND: {
        access: 'constant',
        name: 'ERR_SWAPPER_NOT_FOUND',
        type: { response: { error: 'uint128', ok: 'none' } },
        defaultValue: { isOk: false, value: 7n },
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_SWAP_NOT_FOUND: {
        access: 'constant',
        name: 'ERR_SWAP_NOT_FOUND',
        type: { response: { error: 'uint128', ok: 'none' } },
        defaultValue: { isOk: false, value: 23n },
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_TRANSFER: {
        access: 'constant',
        name: 'ERR_TRANSFER',
        type: { response: { error: 'uint128', ok: 'none' } },
        defaultValue: { isOk: false, value: 5n },
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_TXID_USED: {
        access: 'constant',
        name: 'ERR_TXID_USED',
        type: { response: { error: 'uint128', ok: 'none' } },
        defaultValue: { isOk: false, value: 16n },
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_TX_NOT_MINED: {
        access: 'constant',
        name: 'ERR_TX_NOT_MINED',
        type: { response: { error: 'uint128', ok: 'none' } },
        defaultValue: { isOk: false, value: 21n },
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_UNAUTHORIZED: {
        access: 'constant',
        name: 'ERR_UNAUTHORIZED',
        type: { response: { error: 'uint128', ok: 'none' } },
        defaultValue: { isOk: false, value: 3n },
      } as TypedAbiVariable<Response<null, bigint>>,
      ESCROW_EXPIRATION: {
        access: 'constant',
        name: 'ESCROW_EXPIRATION',
        type: 'uint128',
        defaultValue: 200n,
      } as TypedAbiVariable<bigint>,
      MIN_EXPIRATION: {
        access: 'constant',
        name: 'MIN_EXPIRATION',
        type: 'uint128',
        defaultValue: 250n,
      } as TypedAbiVariable<bigint>,
      OUTBOUND_EXPIRATION: {
        access: 'constant',
        name: 'OUTBOUND_EXPIRATION',
        type: 'uint128',
        defaultValue: 200n,
      } as TypedAbiVariable<bigint>,
      P2PKH_VERSION: {
        access: 'constant',
        name: 'P2PKH_VERSION',
        type: { buffer: { length: 1 } },
        defaultValue: Uint8Array.from([0]),
      } as TypedAbiVariable<Uint8Array>,
      P2SH_VERSION: {
        access: 'constant',
        name: 'P2SH_VERSION',
        type: { buffer: { length: 1 } },
        defaultValue: Uint8Array.from([5]),
      } as TypedAbiVariable<Uint8Array>,
      REVOKED_INBOUND_PREIMAGE: {
        access: 'constant',
        name: 'REVOKED_INBOUND_PREIMAGE',
        type: { buffer: { length: 1 } },
        defaultValue: Uint8Array.from([0]),
      } as TypedAbiVariable<Uint8Array>,
      REVOKED_OUTBOUND_TXID: {
        access: 'constant',
        name: 'REVOKED_OUTBOUND_TXID',
        type: { buffer: { length: 1 } },
        defaultValue: Uint8Array.from([0]),
      } as TypedAbiVariable<Uint8Array>,
      nextOutboundId: {
        access: 'variable',
        name: 'next-outbound-id',
        type: 'uint128',
        defaultValue: 0n,
      } as TypedAbiVariable<bigint>,
      nextSupplierId: {
        access: 'variable',
        name: 'next-supplier-id',
        type: 'uint128',
        defaultValue: 0n,
      } as TypedAbiVariable<bigint>,
      nextSwapperId: {
        access: 'variable',
        name: 'next-swapper-id',
        type: 'uint128',
        defaultValue: 0n,
      } as TypedAbiVariable<bigint>,
      totalInboundVolumeVar: {
        access: 'variable',
        name: 'total-inbound-volume-var',
        type: 'uint128',
        defaultValue: 0n,
      } as TypedAbiVariable<bigint>,
      totalOutboundVolumeVar: {
        access: 'variable',
        name: 'total-outbound-volume-var',
        type: 'uint128',
        defaultValue: 0n,
      } as TypedAbiVariable<bigint>,
    },
    maps: {
      completedOutboundSwapTxids: {
        key: { buffer: { length: 32 } },
        name: 'completed-outbound-swap-txids',
        value: 'uint128',
      } as TypedAbiMap<Uint8Array, bigint>,
      completedOutboundSwaps: {
        key: 'uint128',
        name: 'completed-outbound-swaps',
        value: { buffer: { length: 32 } },
      } as TypedAbiMap<bigint, Uint8Array>,
      inboundMeta: {
        key: { buffer: { length: 32 } },
        name: 'inbound-meta',
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
        key: { buffer: { length: 32 } },
        name: 'inbound-preimages',
        value: { buffer: { length: 128 } },
      } as TypedAbiMap<Uint8Array, Uint8Array>,
      inboundSwaps: {
        key: { buffer: { length: 32 } },
        name: 'inbound-swaps',
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
        key: 'uint128',
        name: 'outbound-swaps',
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
        key: 'principal',
        name: 'supplier-by-controller',
        value: 'uint128',
      } as TypedAbiMap<string, bigint>,
      supplierById: {
        key: 'uint128',
        name: 'supplier-by-id',
        value: {
          tuple: [
            { name: 'controller', type: 'principal' },
            { name: 'inbound-base-fee', type: 'int128' },
            { name: 'inbound-fee', type: { optional: 'int128' } },
            { name: 'name', type: { 'string-ascii': { length: 18 } } },
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
          name: string;
          'outbound-base-fee': bigint;
          'outbound-fee': bigint | null;
          'public-key': Uint8Array;
        }
      >,
      supplierByName: {
        key: { 'string-ascii': { length: 18 } },
        name: 'supplier-by-name',
        value: 'uint128',
      } as TypedAbiMap<string, bigint>,
      supplierByPublicKey: {
        key: { buffer: { length: 33 } },
        name: 'supplier-by-public-key',
        value: 'uint128',
      } as TypedAbiMap<Uint8Array, bigint>,
      supplierEscrow: { key: 'uint128', name: 'supplier-escrow', value: 'uint128' } as TypedAbiMap<
        bigint,
        bigint
      >,
      supplierFunds: { key: 'uint128', name: 'supplier-funds', value: 'uint128' } as TypedAbiMap<
        bigint,
        bigint
      >,
      swapperById: { key: 'uint128', name: 'swapper-by-id', value: 'principal' } as TypedAbiMap<
        bigint,
        string
      >,
      swapperByPrincipal: {
        key: 'principal',
        name: 'swapper-by-principal',
        value: 'uint128',
      } as TypedAbiMap<string, bigint>,
      userInboundVolumeMap: {
        key: 'principal',
        name: 'user-inbound-volume-map',
        value: 'uint128',
      } as TypedAbiMap<string, bigint>,
      userOutboundVolumeMap: {
        key: 'principal',
        name: 'user-outbound-volume-map',
        value: 'uint128',
      } as TypedAbiMap<string, bigint>,
    },
    constants: {
      BUFF_TO_BYTE: [
        Uint8Array.from([0]),
        Uint8Array.from([1]),
        Uint8Array.from([2]),
        Uint8Array.from([3]),
        Uint8Array.from([4]),
        Uint8Array.from([5]),
        Uint8Array.from([6]),
        Uint8Array.from([7]),
        Uint8Array.from([8]),
        Uint8Array.from([9]),
        Uint8Array.from([10]),
        Uint8Array.from([11]),
        Uint8Array.from([12]),
        Uint8Array.from([13]),
        Uint8Array.from([14]),
        Uint8Array.from([15]),
        Uint8Array.from([16]),
        Uint8Array.from([17]),
        Uint8Array.from([18]),
        Uint8Array.from([19]),
        Uint8Array.from([20]),
        Uint8Array.from([21]),
        Uint8Array.from([22]),
        Uint8Array.from([23]),
        Uint8Array.from([24]),
        Uint8Array.from([25]),
        Uint8Array.from([26]),
        Uint8Array.from([27]),
        Uint8Array.from([28]),
        Uint8Array.from([29]),
        Uint8Array.from([30]),
        Uint8Array.from([31]),
        Uint8Array.from([32]),
        Uint8Array.from([33]),
        Uint8Array.from([34]),
        Uint8Array.from([35]),
        Uint8Array.from([36]),
        Uint8Array.from([37]),
        Uint8Array.from([38]),
        Uint8Array.from([39]),
        Uint8Array.from([40]),
        Uint8Array.from([41]),
        Uint8Array.from([42]),
        Uint8Array.from([43]),
        Uint8Array.from([44]),
        Uint8Array.from([45]),
        Uint8Array.from([46]),
        Uint8Array.from([47]),
        Uint8Array.from([48]),
        Uint8Array.from([49]),
        Uint8Array.from([50]),
        Uint8Array.from([51]),
        Uint8Array.from([52]),
        Uint8Array.from([53]),
        Uint8Array.from([54]),
        Uint8Array.from([55]),
        Uint8Array.from([56]),
        Uint8Array.from([57]),
        Uint8Array.from([58]),
        Uint8Array.from([59]),
        Uint8Array.from([60]),
        Uint8Array.from([61]),
        Uint8Array.from([62]),
        Uint8Array.from([63]),
        Uint8Array.from([64]),
        Uint8Array.from([65]),
        Uint8Array.from([66]),
        Uint8Array.from([67]),
        Uint8Array.from([68]),
        Uint8Array.from([69]),
        Uint8Array.from([70]),
        Uint8Array.from([71]),
        Uint8Array.from([72]),
        Uint8Array.from([73]),
        Uint8Array.from([74]),
        Uint8Array.from([75]),
        Uint8Array.from([76]),
        Uint8Array.from([77]),
        Uint8Array.from([78]),
        Uint8Array.from([79]),
        Uint8Array.from([80]),
        Uint8Array.from([81]),
        Uint8Array.from([82]),
        Uint8Array.from([83]),
        Uint8Array.from([84]),
        Uint8Array.from([85]),
        Uint8Array.from([86]),
        Uint8Array.from([87]),
        Uint8Array.from([88]),
        Uint8Array.from([89]),
        Uint8Array.from([90]),
        Uint8Array.from([91]),
        Uint8Array.from([92]),
        Uint8Array.from([93]),
        Uint8Array.from([94]),
        Uint8Array.from([95]),
        Uint8Array.from([96]),
        Uint8Array.from([97]),
        Uint8Array.from([98]),
        Uint8Array.from([99]),
        Uint8Array.from([100]),
        Uint8Array.from([101]),
        Uint8Array.from([102]),
        Uint8Array.from([103]),
        Uint8Array.from([104]),
        Uint8Array.from([105]),
        Uint8Array.from([106]),
        Uint8Array.from([107]),
        Uint8Array.from([108]),
        Uint8Array.from([109]),
        Uint8Array.from([110]),
        Uint8Array.from([111]),
        Uint8Array.from([112]),
        Uint8Array.from([113]),
        Uint8Array.from([114]),
        Uint8Array.from([115]),
        Uint8Array.from([116]),
        Uint8Array.from([117]),
        Uint8Array.from([118]),
        Uint8Array.from([119]),
        Uint8Array.from([120]),
        Uint8Array.from([121]),
        Uint8Array.from([122]),
        Uint8Array.from([123]),
        Uint8Array.from([124]),
        Uint8Array.from([125]),
        Uint8Array.from([126]),
        Uint8Array.from([127]),
        Uint8Array.from([128]),
        Uint8Array.from([129]),
        Uint8Array.from([130]),
        Uint8Array.from([131]),
        Uint8Array.from([132]),
        Uint8Array.from([133]),
        Uint8Array.from([134]),
        Uint8Array.from([135]),
        Uint8Array.from([136]),
        Uint8Array.from([137]),
        Uint8Array.from([138]),
        Uint8Array.from([139]),
        Uint8Array.from([140]),
        Uint8Array.from([141]),
        Uint8Array.from([142]),
        Uint8Array.from([143]),
        Uint8Array.from([144]),
        Uint8Array.from([145]),
        Uint8Array.from([146]),
        Uint8Array.from([147]),
        Uint8Array.from([148]),
        Uint8Array.from([149]),
        Uint8Array.from([150]),
        Uint8Array.from([151]),
        Uint8Array.from([152]),
        Uint8Array.from([153]),
        Uint8Array.from([154]),
        Uint8Array.from([155]),
        Uint8Array.from([156]),
        Uint8Array.from([157]),
        Uint8Array.from([158]),
        Uint8Array.from([159]),
        Uint8Array.from([160]),
        Uint8Array.from([161]),
        Uint8Array.from([162]),
        Uint8Array.from([163]),
        Uint8Array.from([164]),
        Uint8Array.from([165]),
        Uint8Array.from([166]),
        Uint8Array.from([167]),
        Uint8Array.from([168]),
        Uint8Array.from([169]),
        Uint8Array.from([170]),
        Uint8Array.from([171]),
        Uint8Array.from([172]),
        Uint8Array.from([173]),
        Uint8Array.from([174]),
        Uint8Array.from([175]),
        Uint8Array.from([176]),
        Uint8Array.from([177]),
        Uint8Array.from([178]),
        Uint8Array.from([179]),
        Uint8Array.from([180]),
        Uint8Array.from([181]),
        Uint8Array.from([182]),
        Uint8Array.from([183]),
        Uint8Array.from([184]),
        Uint8Array.from([185]),
        Uint8Array.from([186]),
        Uint8Array.from([187]),
        Uint8Array.from([188]),
        Uint8Array.from([189]),
        Uint8Array.from([190]),
        Uint8Array.from([191]),
        Uint8Array.from([192]),
        Uint8Array.from([193]),
        Uint8Array.from([194]),
        Uint8Array.from([195]),
        Uint8Array.from([196]),
        Uint8Array.from([197]),
        Uint8Array.from([198]),
        Uint8Array.from([199]),
        Uint8Array.from([200]),
        Uint8Array.from([201]),
        Uint8Array.from([202]),
        Uint8Array.from([203]),
        Uint8Array.from([204]),
        Uint8Array.from([205]),
        Uint8Array.from([206]),
        Uint8Array.from([207]),
        Uint8Array.from([208]),
        Uint8Array.from([209]),
        Uint8Array.from([210]),
        Uint8Array.from([211]),
        Uint8Array.from([212]),
        Uint8Array.from([213]),
        Uint8Array.from([214]),
        Uint8Array.from([215]),
        Uint8Array.from([216]),
        Uint8Array.from([217]),
        Uint8Array.from([218]),
        Uint8Array.from([219]),
        Uint8Array.from([220]),
        Uint8Array.from([221]),
        Uint8Array.from([222]),
        Uint8Array.from([223]),
        Uint8Array.from([224]),
        Uint8Array.from([225]),
        Uint8Array.from([226]),
        Uint8Array.from([227]),
        Uint8Array.from([228]),
        Uint8Array.from([229]),
        Uint8Array.from([230]),
        Uint8Array.from([231]),
        Uint8Array.from([232]),
        Uint8Array.from([233]),
        Uint8Array.from([234]),
        Uint8Array.from([235]),
        Uint8Array.from([236]),
        Uint8Array.from([237]),
        Uint8Array.from([238]),
        Uint8Array.from([239]),
        Uint8Array.from([240]),
        Uint8Array.from([241]),
        Uint8Array.from([242]),
        Uint8Array.from([243]),
        Uint8Array.from([244]),
        Uint8Array.from([245]),
        Uint8Array.from([246]),
        Uint8Array.from([247]),
        Uint8Array.from([248]),
        Uint8Array.from([249]),
        Uint8Array.from([250]),
        Uint8Array.from([251]),
        Uint8Array.from([252]),
        Uint8Array.from([253]),
        Uint8Array.from([254]),
        Uint8Array.from([255]),
      ],
      ERR_ADD_FUNDS: { isOk: false, value: 4n },
      ERR_ALREADY_FINALIZED: { isOk: false, value: 17n },
      ERR_ESCROW_EXPIRED: { isOk: false, value: 20n },
      ERR_FEE_INVALID: { isOk: false, value: 8n },
      ERR_INCONSISTENT_FEES: { isOk: false, value: 27n },
      ERR_INSUFFICIENT_AMOUNT: { isOk: false, value: 24n },
      ERR_INSUFFICIENT_FUNDS: { isOk: false, value: 14n },
      ERR_INVALID_BTC_ADDR: { isOk: false, value: 22n },
      ERR_INVALID_ESCROW: { isOk: false, value: 18n },
      ERR_INVALID_EXPIRATION: { isOk: false, value: 15n },
      ERR_INVALID_HASH: { isOk: false, value: 12n },
      ERR_INVALID_OUTPUT: { isOk: false, value: 11n },
      ERR_INVALID_PREIMAGE: { isOk: false, value: 19n },
      ERR_INVALID_SUPPLIER: { isOk: false, value: 13n },
      ERR_INVALID_TX: { isOk: false, value: 10n },
      ERR_PANIC: { isOk: false, value: 1n },
      ERR_READ_UINT: { isOk: false, value: 100n },
      ERR_REVOKE_INBOUND_IS_FINALIZED: { isOk: false, value: 29n },
      ERR_REVOKE_INBOUND_NOT_EXPIRED: { isOk: false, value: 28n },
      ERR_REVOKE_OUTBOUND_IS_FINALIZED: { isOk: false, value: 26n },
      ERR_REVOKE_OUTBOUND_NOT_EXPIRED: { isOk: false, value: 25n },
      ERR_SUPPLIER_EXISTS: { isOk: false, value: 2n },
      ERR_SUPPLIER_NOT_FOUND: { isOk: false, value: 6n },
      ERR_SWAPPER_EXISTS: { isOk: false, value: 9n },
      ERR_SWAPPER_NOT_FOUND: { isOk: false, value: 7n },
      ERR_SWAP_NOT_FOUND: { isOk: false, value: 23n },
      ERR_TRANSFER: { isOk: false, value: 5n },
      ERR_TXID_USED: { isOk: false, value: 16n },
      ERR_TX_NOT_MINED: { isOk: false, value: 21n },
      ERR_UNAUTHORIZED: { isOk: false, value: 3n },
      ESCROW_EXPIRATION: 200n,
      MIN_EXPIRATION: 250n,
      OUTBOUND_EXPIRATION: 200n,
      P2PKH_VERSION: Uint8Array.from([0]),
      P2SH_VERSION: Uint8Array.from([5]),
      REVOKED_INBOUND_PREIMAGE: Uint8Array.from([0]),
      REVOKED_OUTBOUND_TXID: Uint8Array.from([0]),
    },
    fungible_tokens: [],
    non_fungible_tokens: [],
    contractName: 'bridge',
    contractFile: 'contracts/bridge.clar',
  },
  supplierWrapper: {
    functions: {
      withdrawFunds: {
        access: 'private',
        args: [{ name: 'amount', type: 'uint128' }],
        name: 'withdraw-funds',
        outputs: { type: { response: { error: 'uint128', ok: 'uint128' } } },
      } as TypedAbiFunction<[amount: number | bigint], Response<bigint, bigint>>,
      addFunds: {
        access: 'public',
        args: [{ name: 'amount', type: 'uint128' }],
        name: 'add-funds',
        outputs: { type: { response: { error: 'uint128', ok: 'uint128' } } },
      } as TypedAbiFunction<[amount: number | bigint], Response<bigint, bigint>>,
      finalizeSwap: {
        access: 'public',
        args: [
          { name: 'txid', type: { buffer: { length: 32 } } },
          { name: 'preimage', type: { buffer: { length: 128 } } },
        ],
        name: 'finalize-swap',
        outputs: {
          type: {
            response: {
              error: 'uint128',
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
        access: 'public',
        args: [
          { name: 'public-key', type: { buffer: { length: 33 } } },
          { name: 'inbound-fee', type: { optional: 'int128' } },
          { name: 'outbound-fee', type: { optional: 'int128' } },
          { name: 'outbound-base-fee', type: 'int128' },
          { name: 'inbound-base-fee', type: 'int128' },
          { name: 'name', type: { 'string-ascii': { length: 18 } } },
          { name: 'funds', type: 'uint128' },
        ],
        name: 'register-supplier',
        outputs: { type: { response: { error: 'uint128', ok: 'uint128' } } },
      } as TypedAbiFunction<
        [
          publicKey: Uint8Array,
          inboundFee: bigint | null,
          outboundFee: bigint | null,
          outboundBaseFee: number | bigint,
          inboundBaseFee: number | bigint,
          name: string,
          funds: number | bigint
        ],
        Response<bigint, bigint>
      >,
      removeFunds: {
        access: 'public',
        args: [{ name: 'amount', type: 'uint128' }],
        name: 'remove-funds',
        outputs: { type: { response: { error: 'uint128', ok: 'uint128' } } },
      } as TypedAbiFunction<[amount: number | bigint], Response<bigint, bigint>>,
      transferOwner: {
        access: 'public',
        args: [{ name: 'new-owner', type: 'principal' }],
        name: 'transfer-owner',
        outputs: { type: { response: { error: 'uint128', ok: 'principal' } } },
      } as TypedAbiFunction<[newOwner: string], Response<string, bigint>>,
      updateSupplier: {
        access: 'public',
        args: [
          { name: 'public-key', type: { buffer: { length: 33 } } },
          { name: 'inbound-fee', type: { optional: 'int128' } },
          { name: 'outbound-fee', type: { optional: 'int128' } },
          { name: 'outbound-base-fee', type: 'int128' },
          { name: 'inbound-base-fee', type: 'int128' },
          { name: 'name', type: { 'string-ascii': { length: 18 } } },
        ],
        name: 'update-supplier',
        outputs: {
          type: {
            response: {
              error: 'uint128',
              ok: {
                tuple: [
                  { name: 'controller', type: 'principal' },
                  { name: 'inbound-base-fee', type: 'int128' },
                  { name: 'inbound-fee', type: { optional: 'int128' } },
                  { name: 'name', type: { 'string-ascii': { length: 18 } } },
                  { name: 'outbound-base-fee', type: 'int128' },
                  { name: 'outbound-fee', type: { optional: 'int128' } },
                  { name: 'public-key', type: { buffer: { length: 33 } } },
                ],
              },
            },
          },
        },
      } as TypedAbiFunction<
        [
          publicKey: Uint8Array,
          inboundFee: bigint | null,
          outboundFee: bigint | null,
          outboundBaseFee: number | bigint,
          inboundBaseFee: number | bigint,
          name: string
        ],
        Response<
          {
            controller: string;
            'inbound-base-fee': bigint;
            'inbound-fee': bigint | null;
            name: string;
            'outbound-base-fee': bigint;
            'outbound-fee': bigint | null;
            'public-key': Uint8Array;
          },
          bigint
        >
      >,
      getOwner: {
        access: 'read_only',
        args: [],
        name: 'get-owner',
        outputs: { type: 'principal' },
      } as TypedAbiFunction<[], string>,
      validateOwner: {
        access: 'read_only',
        args: [],
        name: 'validate-owner',
        outputs: { type: { response: { error: 'uint128', ok: 'bool' } } },
      } as TypedAbiFunction<[], Response<boolean, bigint>>,
    },
    variables: {
      ERR_PANIC: {
        access: 'constant',
        name: 'ERR_PANIC',
        type: { response: { error: 'uint128', ok: 'none' } },
        defaultValue: { isOk: false, value: 202n },
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_UNAUTHORIZED: {
        access: 'constant',
        name: 'ERR_UNAUTHORIZED',
        type: { response: { error: 'uint128', ok: 'none' } },
        defaultValue: { isOk: false, value: 201n },
      } as TypedAbiVariable<Response<null, bigint>>,
      owner: {
        access: 'variable',
        name: 'owner',
        type: 'principal',
        defaultValue: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      } as TypedAbiVariable<string>,
    },
    maps: {},
    constants: {
      ERR_PANIC: { isOk: false, value: 202n },
      ERR_UNAUTHORIZED: { isOk: false, value: 201n },
    },
    fungible_tokens: [],
    non_fungible_tokens: [],
    contractName: 'supplier-wrapper',
    contractFile: 'contracts/supplier-wrapper.clar',
  },
} as const;

export const accounts = {
  deployer: {
    mnemonic:
      'twice kind fence tip hidden tilt action fragile skin nothing glory cousin green tomorrow spring wrist shed math olympic multiply hip blue scout claw',
    balance: 100000000000000n,
    address: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  },
  operator: {
    mnemonic:
      'sell invite acquire kitten bamboo drastic jelly vivid peace spawn twice guilt pave pen trash pretty park cube fragile unaware remain midnight betray rebuild',
    balance: 100000000000000n,
    address: 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5',
  },
  swapper: {
    mnemonic:
      'hold excess usual excess ring elephant install account glad dry fragile donkey gaze humble truck breeze nation gasp vacuum limb head keep delay hospital',
    balance: 100000000000000n,
    address: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
  },
  wallet_3: {
    mnemonic:
      'cycle puppy glare enroll cost improve round trend wrist mushroom scorpion tower claim oppose clever elephant dinosaur eight problem before frozen dune wagon high',
    balance: 100000000000000n,
    address: 'ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC',
  },
  wallet_4: {
    mnemonic:
      'board list obtain sugar hour worth raven scout denial thunder horse logic fury scorpion fold genuine phrase wealth news aim below celery when cabin',
    balance: 100000000000000n,
    address: 'ST2NEB84ASENDXKYGJPQW86YXQCEFEX2ZQPG87ND',
  },
  wallet_5: {
    mnemonic:
      'hurry aunt blame peanut heavy update captain human rice crime juice adult scale device promote vast project quiz unit note reform update climb purchase',
    balance: 100000000000000n,
    address: 'ST2REHHS5J3CERCRBEPMGH7921Q6PYKAADT7JP2VB',
  },
  wallet_6: {
    mnemonic:
      'area desk dutch sign gold cricket dawn toward giggle vibrant indoor bench warfare wagon number tiny universe sand talk dilemma pottery bone trap buddy',
    balance: 100000000000000n,
    address: 'ST3AM1A56AK2C1XAFJ4115ZSV26EB49BVQ10MGCS0',
  },
  wallet_7: {
    mnemonic:
      'prevent gallery kind limb income control noise together echo rival record wedding sense uncover school version force bleak nuclear include danger skirt enact arrow',
    balance: 100000000000000n,
    address: 'ST3PF13W7Z0RRM42A8VZRVFQ75SV1K26RXEP8YGKJ',
  },
  wallet_8: {
    mnemonic:
      'female adjust gallery certain visit token during great side clown fitness like hurt clip knife warm bench start reunion globe detail dream depend fortune',
    balance: 100000000000000n,
    address: 'ST3NBRSFKX28FQ2ZJ1MAKX58HKHSDGNV5N7R21XCP',
  },
  wallet_9: {
    mnemonic:
      'shadow private easily thought say logic fault paddle word top book during ignore notable orange flight clock image wealth health outside kitten belt reform',
    balance: 100000000000000n,
    address: 'STNHKEPYEPJ8ET55ZZ0M5A34J0R3N5FM2CMMMAZ6',
  },
} as const;
