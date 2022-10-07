import React from 'react';
import { makeGetServerSideProps } from '@micro-stacks/nextjs';
import type { NextPage } from 'next';
import { Layout } from '../../components/layout';
import { withMicroStacks } from '../../common/with-micro-stacks';
import { suppliersQuery } from '../../common/store';
import { InboundSwap } from '../../components/inbound';

const InboundSwapPage: NextPage = () => {
  return (
    <Layout>
      <InboundSwap />
    </Layout>
  );
};

export const getServerSideProps = makeGetServerSideProps([
  () => {
    return [suppliersQuery];
  },
]);

export default withMicroStacks(InboundSwapPage);
