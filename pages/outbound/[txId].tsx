import React from 'react';
import { makeGetServerSideProps, stacksNetworkFromCtx } from '@micro-stacks/nextjs';
import { NextPage } from 'next';
import { Layout } from '../../components/layout';
import { withMicroStacks } from '../../common/utils';
import { operatorsQuery } from '../../common/store';
import { OutboundSwap } from '../../components/outbound';

const OutboundSwapPage: NextPage = () => {
  return (
    <Layout>
      <OutboundSwap />
    </Layout>
  );
};

export const getServerSideProps = makeGetServerSideProps([
  () => {
    return [operatorsQuery];
  },
]);

export default withMicroStacks(OutboundSwapPage);
