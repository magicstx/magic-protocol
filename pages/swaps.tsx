import React from 'react';
import { NextPage } from 'next';
import { Layout } from '../components/layout';
import { withMicroStacks } from '../common/with-micro-stacks';
import { SwapsList } from '../components/swaps-list';

const SwapsListPage: NextPage = () => {
  return (
    <Layout>
      <SwapsList />
    </Layout>
  );
};

export default withMicroStacks(SwapsListPage);
