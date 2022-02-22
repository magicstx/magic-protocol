import { cvToValue } from '@clarigen/core';
import { ContractCallTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';
import { address as bAddress } from 'bitcoinjs-lib';
import 'cross-fetch/polyfill';
import { fetchTransaction } from 'micro-stacks/api';
import { hexToCV } from 'micro-stacks/clarity';
import { bytesToHex, hexToBytes } from 'micro-stacks/common';
import { getTxData } from '../common/api/electrum';
import { BridgeContract } from '../common/clarigen';
import { btcNetwork, network } from '../common/constants';
import { getBtcTxUrl } from '../common/utils';
import { OPERATOR_KEY, setupScript } from './helpers';
// import { StacksTestnet } from 'micro-stacks/network';

// const network = new StacksTestnet();

type EscrowArgs = Parameters<BridgeContract['escrowSwap']>;

const [txid] = process.argv.slice(2);

async function run() {
  const tx = (await fetchTransaction({
    txid,
    url: network.getCoreApiUrl(),
  })) as ContractCallTransaction;

  // if (tx.tx_status === 'pending') throw new Error('Not confirmed');

  const { provider, bridge, contracts } = await setupScript(OPERATOR_KEY);
  const clarityBtc = contracts.clarityBitcoin.contract;

  const args = tx.contract_call.function_args!;

  const nativeArgs: EscrowArgs = args.map(arg => {
    const cv = hexToCV(arg.hex);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return cvToValue(cv);
  }) as EscrowArgs;

  const [
    block,
    txHex,
    proof,
    outputIndex,
    sender,
    recipient,
    expirationBuff,
    hash,
    swapperBuff,
    operatorId,
  ] = nativeArgs;

  const txId = bytesToHex(await provider.ro(clarityBtc.getTxid(txHex)));
  console.log('txId:', txId);
  const url = getBtcTxUrl(txId);
  console.log('tx:', url);

  // correct output?
  const scriptHash = await provider.ro(
    bridge.generateHtlcScriptHash(sender, recipient, expirationBuff, hash, swapperBuff)
  );
  console.log('scriptHash', bytesToHex(scriptHash));

  const contractAddress = bAddress.fromOutputScript(Buffer.from(scriptHash), btcNetwork);
  console.log('address', contractAddress);

  const txData = await getTxData(txId, contractAddress);

  const txAddress = txData.tx.vout[Number(outputIndex)].scriptPubKey.addresses[0];
  console.log('txAddress', txAddress);
  const correctAddress = txAddress === contractAddress;
  if (!correctAddress) {
    console.error(`Invalid address. Contract address: ${contractAddress}, txAddress: ${txAddress}`);
  }

  // console.log('args[0]', args[0]);

  // console.log('tx', tx);
}

run()
  .catch(console.error)
  .finally(() => {
    process.exit();
  });
