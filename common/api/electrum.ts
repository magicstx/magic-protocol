import ElectrumClient from 'electrum-client-sl';
import { reverseBuffer } from '../htlc';
import { confirmationsToHeight, findStacksBlockAtHeight, getStacksBlock } from './stacks';
import { BridgeContract } from '../clarigen';
import { NETWORK_CONFIG } from '../constants';
import { Transaction } from 'bitcoinjs-lib';
import { bytesToHex } from 'micro-stacks/common';

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
    default:
      return {
        host: process.env.ELECTRUM_HOST || 'localhost',
        port: parseInt(process.env.ELECTRUM_PORT || '50001', 10),
        protocol: process.env.ELECTRUM_PROTOCOL || 'ssl',
      };
  }
}

const electrumConfig = getElectrumConfig();

export const electrumClient = new ElectrumClient(
  electrumConfig.host,
  electrumConfig.port,
  electrumConfig.protocol
);

export async function withElectrumClient<T = void>(
  cb: (client: ElectrumClient) => Promise<T>
): Promise<T> {
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

type MintParams = Parameters<BridgeContract['escrowSwap']>;
type BlocksParam = MintParams[1];
type BlockParam = MintParams[0];
type ProofParam = MintParams[3];

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
  try {
    await electrumClient.close();
  } catch (error) {}
  try {
    await electrumClient.connect();
  } catch (error) {}
  try {
    const tx = await electrumClient.blockchain_transaction_get(txid, true);
    const burnHeight = await confirmationsToHeight(tx.confirmations);
    const { header, stacksHeight, prevBlocks } = await findStacksBlockAtHeight(burnHeight, []);

    const merkle = await electrumClient.blockchain_transaction_getMerkle(txid, burnHeight);
    const hashes = merkle.merkle.map(hash => {
      return reverseBuffer(Buffer.from(hash, 'hex'));
    });

    const outputIndex = tx.vout.findIndex(vout => {
      const addressesMatch = vout.scriptPubKey.addresses?.[0] === address;
      const addressMatch = vout.scriptPubKey.address === address;
      return addressMatch || addressesMatch;
    });

    const blockArg = {
      header: header,
      height: stacksHeight,
    };

    const txHex = getTxHex(tx.hex);

    const proofArg = {
      hashes: hashes.map(h => bytesToHex(h)),
      'tx-index': merkle.pos,
      'tree-depth': hashes.length,
    };

    return {
      txHex: txHex,
      proof: proofArg,
      block: blockArg,
      prevBlocks,
      tx,
      outputIndex,
    };
  } catch (error) {
    console.error(error);
    await electrumClient.close();
    throw error;
  }
}
