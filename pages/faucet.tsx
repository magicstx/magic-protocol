import React from 'react';
import type { NextPage } from 'next';
import { useAtom } from 'jotai';
import { btcAddressState } from '../common/store';
import { Input } from '../components/form';
import { Box } from '@nelson-ui/react';
import { Text } from '../components/text';
import { Button } from '../components/button';
import { useState } from 'react';
import { withMicroStacks } from '../common/utils';
import { useAuth } from '@micro-stacks/react';
import { Layout } from '../components/layout';
import { CenterBox } from '../components/center-box';

const Faucet: NextPage = () => {
  const { session } = useAuth();
  const stxAddress = session?.addresses?.testnet;
  const [btcAddress, setBtcAddress] = useAtom(btcAddressState);
  const [btcTx, setBtcTx] = useState('');
  const [stxTx, setStxTx] = useState('');
  const submitTx = React.useCallback(async () => {
    if (!stxAddress) return;
    const url = `/api/faucet?stxAddress=${stxAddress}&btcAddress=${btcAddress}`;
    const res = await fetch(url);
    const data = (await res.json()) as { stxTxid: string; btcTxid: string };
    setBtcTx(data.btcTxid);
    setStxTx(data.stxTxid);
  }, [btcAddress, stxAddress, setBtcTx, setStxTx]);
  return (
    <Layout>
      <CenterBox>
        <Text variant="Heading05">Faucet</Text>
        <Text variant="Label01">BTC Address:</Text>
        <Input value={btcAddress} onChange={e => setBtcAddress(e.currentTarget.value)} />
        {stxTx ? (
          <Box as="a" href={`http://localhost:3999/extended/v1/tx/${stxTx}`} target="_blank">
            <Text>STX Transaction</Text>
          </Box>
        ) : null}
        {btcTx ? <Text>BTC Transaction: {btcTx}</Text> : null}
      </CenterBox>
      <Button size="big" onClick={submitTx}>
        Submit
      </Button>
    </Layout>
  );
};

export default withMicroStacks(Faucet);
