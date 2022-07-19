import ElectrumClient from 'electrum-client-sl';
import { getScriptHash, reverseBuffer } from '../htlc';
import { confirmationsToHeight, findStacksBlockAtHeight } from './stacks';
import { btcNetwork, NETWORK_CONFIG } from '../constants';
import { Transaction, address as bAddress } from 'bitcoinjs-lib';
import { bytesToHex, hexToBytes } from 'micro-stacks/common';
import { btcToSats, pubKeyToBtcAddress } from '../utils';
import type { SupplierWithCapacity } from '../store/api';
import { fetchSupplierWithContract } from '../store';

export function getElectrumConfig() {
  const defaultHost = process.env.ELECTRUM_HOST;
  const defaultPort = process.env.ELECTRUM_PORT
    ? parseInt(process.env.ELECTRUM_PORT, 10)
    : undefined;
  const defaultProtocol = process.env.ELECTRUM_PROTOCOL;
  switch (NETWORK_CONFIG) {
    case 'testnet':
      return {
        host: defaultHost || 'blackie.c3-soft.com',
        port: defaultPort === undefined ? 57006 : defaultPort,
        protocol: defaultProtocol || 'ssl',
      };
    case 'mocknet':
      return {
        host: 'localhost',
        port: 50001,
        protocol: 'tcp',
      };
    case 'mainnet':
      return {
        host: 'fortress.qtornado.com',
        port: 443,
        protocol: 'ssl',
      };
    default:
      return {
        host: process.env.ELECTRUM_HOST || 'localhost',
        port: parseInt(process.env.ELECTRUM_PORT || '50001', 10),
        protocol: process.env.ELECTRUM_PROTOCOL || 'ssl',
      };
  }
}

export function getElectrumClient() {
  const electrumConfig = getElectrumConfig();
  return new ElectrumClient(electrumConfig.host, electrumConfig.port, electrumConfig.protocol);
}

export async function withElectrumClient<T = void>(
  cb: (client: ElectrumClient) => Promise<T>
): Promise<T> {
  const electrumClient = getElectrumClient();
  const client = electrumClient;
  await client.connect();
  try {
    const res = await cb(client);
    await client.close();
    return res;
  } catch (error) {
    console.error(`Error from withElectrumConfig`, error);
    await client.close();
    throw error;
  }
}

export type TxData = Awaited<ReturnType<typeof getTxData>>;

// Get the tx hex that is used to transform into a txid
// This strips out witness data
export function getTxHex(txHex: string) {
  const tx = Transaction.fromHex(txHex);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const hash = tx.__toBuffer(undefined, undefined, false) as Buffer;
  return hash.toString('hex');
}

export async function getTxData(txid: string, address: string) {
  return withElectrumClient(async electrumClient => {
    const tx = await electrumClient.blockchain_transaction_get(txid, true);
    const burnHeight = await confirmationsToHeight(tx.confirmations);
    const { header, stacksHeight, prevBlocks } = await findStacksBlockAtHeight(
      burnHeight,
      [],
      electrumClient
    );

    const merkle = await electrumClient.blockchain_transaction_getMerkle(txid, burnHeight);
    const hashes = merkle.merkle.map(hash => {
      return reverseBuffer(Buffer.from(hash, 'hex'));
    });

    const outputIndex = tx.vout.findIndex(vout => {
      const addressesMatch = vout.scriptPubKey.addresses?.[0] === address;
      const addressMatch = vout.scriptPubKey.address === address;
      return addressMatch || addressesMatch;
    });

    const amount = btcToSats(tx.vout[outputIndex].value);
    const blockArg = {
      header: header,
      height: stacksHeight,
    };

    const txHex = getTxHex(tx.hex);

    const proofArg = {
      hashes: hashes.map(h => bytesToHex(h)),
      txIndex: merkle.pos,
      treeDepth: hashes.length,
    };

    return {
      txHex: txHex,
      proof: proofArg,
      block: blockArg,
      prevBlocks,
      tx,
      outputIndex,
      amount,
      burnHeight,
    };
  });
}

export async function listUnspent(scriptHash: Uint8Array) {
  return withElectrumClient(async electrumClient => {
    return electrumClient.blockchain_scripthash_listunspent(bytesToHex(scriptHash));
  });
}

export async function fetchBtcBalanceForPublicKey(publicKey: Uint8Array) {
  const address = pubKeyToBtcAddress(publicKey);
  return fetchBtcBalance(address);
}

export async function fetchBtcBalance(address: string) {
  return await withElectrumClient(async client => {
    const output = bAddress.toOutputScript(address, btcNetwork);
    const scriptHash = getScriptHash(output);
    const balances = await client.blockchain_scripthash_getBalance(bytesToHex(scriptHash));
    const balance = BigInt(balances.unconfirmed) + BigInt(balances.confirmed);
    return balance;
  });
}

export async function fetchSupplierWithCapacity(id: number): Promise<SupplierWithCapacity> {
  const supplier = await fetchSupplierWithContract(id);
  const publicKey = hexToBytes(supplier.publicKey);
  const btc = await fetchBtcBalanceForPublicKey(publicKey);
  return {
    ...supplier,
    btc: btc.toString(),
  };
}
