import React from 'react';
import type { NextPage } from 'next';
import { Layout } from '../components/layout';
import { withMicroStacks } from '../common/with-micro-stacks';
import { SwapContainer } from '../components/swap-container';
import { makeGetServerSideProps } from '@micro-stacks/nextjs';
import { suppliersQuery } from '../common/store';
import { Activity } from '../components/activity';

const ActivityPage: NextPage = () => {
  return (
    <Layout>
      <Activity />
    </Layout>
  );
};

export const getServerSideProps = makeGetServerSideProps([
  () => {
    return [suppliersQuery];
  },
]);

export default withMicroStacks(ActivityPage);
