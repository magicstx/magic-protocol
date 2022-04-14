import { ClarityTypes, ContractCalls } from '@clarigen/core';

// prettier-ignore
export interface ClarityBitcoinContract {
  buffToU8: (byte: Uint8Array) => ContractCalls.ReadOnly<bigint>;
  getReversedTxid: (tx: Uint8Array) => ContractCalls.ReadOnly<Uint8Array>;
  getTxid: (tx: Uint8Array) => ContractCalls.ReadOnly<Uint8Array>;
  innerBuff32Permutation: (targetIndex: number | bigint, state: {
  "hash-input": Uint8Array;
  "hash-output": Uint8Array
    }) => ContractCalls.ReadOnly<{
  "hash-input": Uint8Array;
  "hash-output": Uint8Array
    }>;
  innerMerkleProofVerify: (ctr: number | bigint, state: {
  "cur-hash": Uint8Array;
  "path": bigint;
  "proof-hashes": Uint8Array[];
  "root-hash": Uint8Array;
  "tree-depth": bigint;
  "verified": boolean
    }) => ContractCalls.ReadOnly<{
  "cur-hash": Uint8Array;
  "path": bigint;
  "proof-hashes": Uint8Array[];
  "root-hash": Uint8Array;
  "tree-depth": bigint;
  "verified": boolean
    }>;
  innerReadSlice: (chunk_size: number | bigint, input: {
  "acc": Uint8Array;
  "buffer": Uint8Array;
  "index": bigint;
  "remaining": bigint
    }) => ContractCalls.ReadOnly<{
  "acc": Uint8Array;
  "buffer": Uint8Array;
  "index": bigint;
  "remaining": bigint
    }>;
  innerReadSlice1024: (ignored: boolean, input: {
  "acc": Uint8Array;
  "data": Uint8Array;
  "index": bigint
    }) => ContractCalls.ReadOnly<{
  "acc": Uint8Array;
  "data": Uint8Array;
  "index": bigint
    }>;
  isBitSet: (val: number | bigint, bit: number | bigint) => ContractCalls.ReadOnly<boolean>;
  parseBlockHeader: (headerbuff: Uint8Array) => ContractCalls.ReadOnly<ClarityTypes.Response<{
  "merkle-root": Uint8Array;
  "nbits": bigint;
  "nonce": bigint;
  "parent": Uint8Array;
  "timestamp": bigint;
  "version": bigint
    }, bigint>>;
  parseTx: (tx: Uint8Array) => ContractCalls.ReadOnly<ClarityTypes.Response<{
  "ins": {
  "outpoint": {
  "hash": Uint8Array;
  "index": bigint
    };
  "scriptSig": Uint8Array;
  "sequence": bigint
    }[];
  "locktime": bigint;
  "outs": {
  "scriptPubKey": Uint8Array;
  "value": bigint
    }[];
  "version": bigint
    }, bigint>>;
  readHashslice: (oldCtx: {
  "index": bigint;
  "txbuff": Uint8Array
    }) => ContractCalls.ReadOnly<ClarityTypes.Response<{
  "ctx": {
  "index": bigint;
  "txbuff": Uint8Array
    };
  "hashslice": Uint8Array
    }, bigint>>;
  readNextTxin: (ignored: boolean, stateRes: ClarityTypes.Response<{
  "ctx": {
  "index": bigint;
  "txbuff": Uint8Array
    };
  "remaining": bigint;
  "txins": {
  "outpoint": {
  "hash": Uint8Array;
  "index": bigint
    };
  "scriptSig": Uint8Array;
  "sequence": bigint
    }[]
    }, bigint>) => ContractCalls.ReadOnly<ClarityTypes.Response<{
  "ctx": {
  "index": bigint;
  "txbuff": Uint8Array
    };
  "remaining": bigint;
  "txins": {
  "outpoint": {
  "hash": Uint8Array;
  "index": bigint
    };
  "scriptSig": Uint8Array;
  "sequence": bigint
    }[]
    }, bigint>>;
  readNextTxout: (ignored: boolean, stateRes: ClarityTypes.Response<{
  "ctx": {
  "index": bigint;
  "txbuff": Uint8Array
    };
  "remaining": bigint;
  "txouts": {
  "scriptPubKey": Uint8Array;
  "value": bigint
    }[]
    }, bigint>) => ContractCalls.ReadOnly<ClarityTypes.Response<{
  "ctx": {
  "index": bigint;
  "txbuff": Uint8Array
    };
  "remaining": bigint;
  "txouts": {
  "scriptPubKey": Uint8Array;
  "value": bigint
    }[]
    }, bigint>>;
  readSlice: (data: Uint8Array, offset: number | bigint, size: number | bigint) => ContractCalls.ReadOnly<ClarityTypes.Response<Uint8Array, bigint>>;
  readSlice1: (input: {
  "data": Uint8Array;
  "index": bigint
    }) => ContractCalls.ReadOnly<Uint8Array>;
  readSlice128: (input: {
  "data": Uint8Array;
  "index": bigint
    }) => ContractCalls.ReadOnly<Uint8Array>;
  readSlice16: (input: {
  "data": Uint8Array;
  "index": bigint
    }) => ContractCalls.ReadOnly<Uint8Array>;
  readSlice2: (input: {
  "data": Uint8Array;
  "index": bigint
    }) => ContractCalls.ReadOnly<Uint8Array>;
  readSlice256: (input: {
  "data": Uint8Array;
  "index": bigint
    }) => ContractCalls.ReadOnly<Uint8Array>;
  readSlice32: (input: {
  "data": Uint8Array;
  "index": bigint
    }) => ContractCalls.ReadOnly<Uint8Array>;
  readSlice4: (input: {
  "data": Uint8Array;
  "index": bigint
    }) => ContractCalls.ReadOnly<Uint8Array>;
  readSlice512: (input: {
  "data": Uint8Array;
  "index": bigint
    }) => ContractCalls.ReadOnly<Uint8Array>;
  readSlice64: (input: {
  "data": Uint8Array;
  "index": bigint
    }) => ContractCalls.ReadOnly<Uint8Array>;
  readSlice8: (input: {
  "data": Uint8Array;
  "index": bigint
    }) => ContractCalls.ReadOnly<Uint8Array>;
  readTxins: (ctx: {
  "index": bigint;
  "txbuff": Uint8Array
    }) => ContractCalls.ReadOnly<ClarityTypes.Response<{
  "ctx": {
  "index": bigint;
  "txbuff": Uint8Array
    };
  "remaining": bigint;
  "txins": {
  "outpoint": {
  "hash": Uint8Array;
  "index": bigint
    };
  "scriptSig": Uint8Array;
  "sequence": bigint
    }[]
    }, bigint>>;
  readTxouts: (ctx: {
  "index": bigint;
  "txbuff": Uint8Array
    }) => ContractCalls.ReadOnly<ClarityTypes.Response<{
  "ctx": {
  "index": bigint;
  "txbuff": Uint8Array
    };
  "remaining": bigint;
  "txouts": {
  "scriptPubKey": Uint8Array;
  "value": bigint
    }[]
    }, bigint>>;
  readUint16: (ctx: {
  "index": bigint;
  "txbuff": Uint8Array
    }) => ContractCalls.ReadOnly<ClarityTypes.Response<{
  "ctx": {
  "index": bigint;
  "txbuff": Uint8Array
    };
  "uint16": bigint
    }, bigint>>;
  readUint32: (ctx: {
  "index": bigint;
  "txbuff": Uint8Array
    }) => ContractCalls.ReadOnly<ClarityTypes.Response<{
  "ctx": {
  "index": bigint;
  "txbuff": Uint8Array
    };
  "uint32": bigint
    }, bigint>>;
  readUint64: (ctx: {
  "index": bigint;
  "txbuff": Uint8Array
    }) => ContractCalls.ReadOnly<ClarityTypes.Response<{
  "ctx": {
  "index": bigint;
  "txbuff": Uint8Array
    };
  "uint64": bigint
    }, bigint>>;
  readVarint: (ctx: {
  "index": bigint;
  "txbuff": Uint8Array
    }) => ContractCalls.ReadOnly<ClarityTypes.Response<{
  "ctx": {
  "index": bigint;
  "txbuff": Uint8Array
    };
  "varint": bigint
    }, bigint>>;
  readVarslice: (oldCtx: {
  "index": bigint;
  "txbuff": Uint8Array
    }) => ContractCalls.ReadOnly<ClarityTypes.Response<{
  "ctx": {
  "index": bigint;
  "txbuff": Uint8Array
    };
  "varslice": Uint8Array
    }, bigint>>;
  reverseBuff32: (input: Uint8Array) => ContractCalls.ReadOnly<Uint8Array>;
  verifyBlockHeader: (headerbuff: Uint8Array, expectedBlockHeight: number | bigint) => ContractCalls.ReadOnly<boolean>;
  verifyMerkleProof: (reversedTxid: Uint8Array, merkleRoot: Uint8Array, proof: {
  "hashes": Uint8Array[];
  "tree-depth": bigint;
  "tx-index": bigint
    }) => ContractCalls.ReadOnly<ClarityTypes.Response<boolean, bigint>>;
  verifyPrevBlock: (block: Uint8Array, parent: Uint8Array) => ContractCalls.ReadOnly<ClarityTypes.Response<boolean, bigint>>;
  verifyPrevBlocks: (block: Uint8Array, prevBlocks: Uint8Array[]) => ContractCalls.ReadOnly<ClarityTypes.Response<Uint8Array, bigint>>;
  verifyPrevBlocksFold: (parent: Uint8Array, nextResp: ClarityTypes.Response<Uint8Array, bigint>) => ContractCalls.ReadOnly<ClarityTypes.Response<Uint8Array, bigint>>;
  wasTxMinedPrev: (block: {
  "header": Uint8Array;
  "height": bigint
    }, prevBlocks: Uint8Array[], tx: Uint8Array, proof: {
  "hashes": Uint8Array[];
  "tree-depth": bigint;
  "tx-index": bigint
    }) => ContractCalls.ReadOnly<ClarityTypes.Response<boolean, bigint>>;
  wasTxMined: (block: {
  "header": Uint8Array;
  "height": bigint
    }, tx: Uint8Array, proof: {
  "hashes": Uint8Array[];
  "tree-depth": bigint;
  "tx-index": bigint
    }) => ContractCalls.ReadOnly<ClarityTypes.Response<boolean, bigint>>;
}
