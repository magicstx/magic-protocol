/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { config } from 'dotenv';
config({
  path: '.env.local',
});
import { logTxid, OPERATOR_KEY, setupScript, SWAPPER_KEY } from './helpers';
import { fetchTxData } from '../common/api';
import { reverseBuffer } from '../common/htlc';
import { bytesToHex } from 'micro-stacks/common';

async function run() {
  const [txid] = process.argv.slice(2);
  console.log('txid', txid);
  const { clarityBitcoin, provider } = await setupScript(
    process.env.SCRIPT_OPERATOR_KEY || OPERATOR_KEY
  );
  const data = await fetchTxData(txid, '');
  const wasMined = await provider.roOk(
    clarityBitcoin.wasTxMined(data.block, data.txHex, data.proof)
  );
  console.log('wasMined', wasMined);
  if (!wasMined) {
    // console.log('data', data);
    // data.proof.hashes.forEach(hash => {
    //   console.log('hash', hash.toString('hex'));
    // });
    console.log('txHex', bytesToHex(data.txHex));
    const reversedTxid = bytesToHex(reverseBuffer(Buffer.from(txid, 'hex')));
    const reversedTxidContract = await provider.ro(clarityBitcoin.getReversedTxid(data.txHex));
    console.log('TxID match?', bytesToHex(reverseBuffer(reversedTxidContract)) === reversedTxid);
    console.log('reversedTxid', reversedTxid);
    console.log('reversedTxidContract', bytesToHex(reverseBuffer(reversedTxidContract)));
    const headerValid = await provider.ro(
      clarityBitcoin.verifyBlockHeader(data.block.header, data.block.height)
    );
    console.log('headerValid', headerValid);
    const parsedHeader = await provider.roOk(clarityBitcoin.parseBlockHeader(data.block.header));
    // console.log('parsedHeader', parsedHeader);
    const reversedMerkle = reverseBuffer(parsedHeader['merkle-root']);
    console.log('merkle', bytesToHex(reversedMerkle));
    const merkleValid = await provider.roOk(
      clarityBitcoin.verifyMerkleProof(
        reverseBuffer(Buffer.from(txid, 'hex')),
        reversedMerkle,
        data.proof
      )
    );
    console.log('merkleValid', merkleValid);
  }
}

run()
  .catch(console.error)
  .finally(() => {
    process.exit();
  });
