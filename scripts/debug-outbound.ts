import 'cross-fetch/polyfill';
import { ContractCallTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';
import { fetchTransaction } from 'micro-stacks/api';
import { hexToCV, UIntCV } from 'micro-stacks/clarity';
// import { network } from '../common/constants';
import { StacksTestnet } from 'micro-stacks/network';
import { cvToValue } from '@clarigen/core';
import { BridgeContract } from '../common/clarigen';
import { getOutboundAddress } from '../common/utils';
import { OPERATOR_KEY, setupScript } from './helpers';
import { bytesToHex } from 'micro-stacks/common';
import { base58checkEncode } from 'micro-stacks/crypto';
import { address as bAddress } from 'bitcoinjs-lib';
import { btcNetwork } from '../common/constants';

const network = new StacksTestnet();

const [txid] = process.argv.slice(2);

type InitArgs = Parameters<BridgeContract['initiateOutboundSwap']>;

async function run() {
  const tx = (await fetchTransaction({
    txid,
    url: network.getCoreApiUrl(),
  })) as ContractCallTransaction;

  const { provider, bridge, contracts } = await setupScript(OPERATOR_KEY);
  const clarityBtc = contracts.clarityBitcoin.contract;

  const swapId = cvToValue<number>(hexToCV<UIntCV>(tx.tx_result.hex));

  const nativeArgs: InitArgs = tx.contract_call.function_args!.map(arg => {
    const cv = hexToCV(arg.hex);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return cvToValue(cv);
  }) as InitArgs;

  const [amount, version, hash, operator] = nativeArgs;

  console.log('version', bytesToHex(version));
  console.log('hash', bytesToHex(hash));

  const address = getOutboundAddress(hash, version);

  const _address = base58checkEncode(hash, 111);
  console.log('_address', _address);

  const contractScriptHash = await provider.ro(bridge.generateP2pkhOutput(hash));
  console.log(bAddress.fromOutputScript(Buffer.from(contractScriptHash), btcNetwork));

  console.log('address', address);

  console.log('swapId', swapId);

  const finalizeTxid = await provider.ro(bridge.getCompletedOutboundSwapTxid(swapId));

  if (finalizeTxid) {
    const txid = bytesToHex(finalizeTxid);
    console.log('BTC tx:', txid);
  } else {
    console.log('No finalized tx yet.');
  }
}

run()
  .catch(console.error)
  .finally(() => {
    process.exit();
  });
