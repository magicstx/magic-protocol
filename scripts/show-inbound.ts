import { bytesToHex, hexToBytes } from 'micro-stacks/common';
import { nodeContracts } from '../common/api-constants';
import { bridgeContract } from '../common/contracts';
import { pubKeyToBtcAddress } from '../common/utils';

const [btcTxid] = process.argv.slice(2);
async function run() {
  const provider = nodeContracts();
  const bridge = bridgeContract();
  const swap = await provider.roOk(bridge.getFullInbound(hexToBytes(btcTxid)));
  console.log(swap);
  const supplier = (await provider.ro(bridge.getSupplier(swap.supplier)))!;
  console.log('Supplier public key:', bytesToHex(supplier.publicKey));
  const supplierBtc = pubKeyToBtcAddress(supplier.publicKey);
  console.log('Supplier Address:', supplierBtc);
}

run()
  .catch(console.error)
  .finally(() => {
    process.exit();
  });
