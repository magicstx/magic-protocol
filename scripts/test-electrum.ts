import 'cross-fetch/polyfill';
import { getTxData } from '../common/api/electrum';

async function run() {
  const [txid] = process.argv.slice(2);
  const data = await getTxData(txid, '');
  console.log('data', data);
}

run()
  .catch(console.error)
  .finally(() => {
    process.exit();
  });
