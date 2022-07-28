import { bpsToPercent, pubKeyToBtcAddress, satsToBtc } from '../common/utils';
import { fetchAllSuppliers } from '../pages/api/suppliers';

async function run() {
  const suppliers = await fetchAllSuppliers();
  for (const supplier of suppliers) {
    console.log('----------');
    console.log(`#${supplier.id}`);
    console.log(`BTC Address: ${supplier.btcAddress}`);
    console.log(`STX Address: ${supplier.controller}`);
    console.log(`BTC Funds: ${satsToBtc(supplier.btc)}`);
    console.log(`xBTC Funds: ${satsToBtc(supplier.funds)}`);
    console.log(`Inbound fees: ${bpsToPercent(supplier.inboundFee)}% + ${supplier.inboundBaseFee}`);
    console.log(
      `Outbound fees: ${bpsToPercent(supplier.outboundFee)}% + ${supplier.outboundBaseFee}`
    );
  }
}

run()
  .catch(console.error)
  .finally(() => {
    process.exit();
  });
