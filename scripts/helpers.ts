import { fetch } from 'cross-fetch';
import { accounts } from '../common/clarigen';
import { StacksMocknet } from 'micro-stacks/network';
import { NodeProvider } from '@clarigen/node';
import { publicKeys } from '../test/mocks';
import { WebTransactionReceipt } from '@clarigen/core';
import { hashSha256 } from 'micro-stacks/crypto-sha';
import { hexToBytes } from 'micro-stacks/common';
import { getPublicKey } from 'noble-secp256k1';
import { CONTRACT_ADDRESS, network, contracts } from '../common/constants';

export const OPERATOR_KEY =
  process.env.SCRIPT_OPERATOR_KEY ||
  '7287ba251d44a4d3fd9276c88ce34c5c52a038955511cccaf77e61068649c17801';
export const SWAPPER_KEY = '530d9f61984c888536871c6573073bdfc0058896dc1adfe9a6a10dfacadc209101';

export const OPERATOR_PUBLIC = getPublicKey(OPERATOR_KEY.slice(0, 64), true);
export const SWAPPER_PUBLIC = publicKeys[0];

export const preImage = 'aaaa';
export const preImageBuff = Buffer.from(preImage, 'hex');
export const hash = hashSha256(hexToBytes(preImage));
export const hashBuff = Buffer.from(hash);

export async function getNonce(address: string) {
  const url = `${network.getCoreApiUrl()}/v2/accounts/${address}?unanchored=true&proof=0`;
  const res = await fetch(url);
  const data = (await res.json()) as { nonce: number };
  return data.nonce;
}

export function logTxid(receipt: { txId: string }) {
  console.log(`${network.getCoreApiUrl()}/extended/v1/tx/0x${receipt.txId}?unanchored=true`);
}

export async function setupScript(senderKey: string) {
  const clarigenConfig = {
    privateKey: senderKey,
    network,
    deployerAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || CONTRACT_ADDRESS,
  };

  const provider = NodeProvider(clarigenConfig);

  const nonce = await getNonce(accounts.operator.address);

  return {
    contracts,
    bridge: contracts.bridge.contract,
    clarityBitcoin: contracts.clarityBitcoin.contract,
    nonce,
    network,
    provider,
  };
}

// async function run() {
//   const operatorPrivate = 'ba82a22eb5bad6b2e0558d919905fde0c139e67bcc5e8c2339f29cff6604f4ec';
//   const operatorPublic = getPublicKey(operatorPrivate, true);
//   const publicKey = Buffer.from(operatorPublic, 'hex');
//   const nonce = await getNonce(accounts.operator.address);
//   const registerResult = await tx(bridge.registerOperator(publicKey, 50n, 50n, 0n), {
//     nonce,
//   });
// }
