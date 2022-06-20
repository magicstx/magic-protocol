import React from 'react';
import type { NextPage } from 'next';
import { Layout } from '../components/layout';
import { withMicroStacks } from '../common/with-micro-stacks';
import { SwapContainer } from '../components/swap-container';

const Home: NextPage = () => {
  return (
    <Layout>
      <SwapContainer />
    </Layout>
  );
};

export default withMicroStacks(Home, undefined, []);
