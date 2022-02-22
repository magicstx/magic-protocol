import React, { useEffect } from 'react';
import { useAtomValue } from 'jotai/utils';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { queryClientAtom } from 'jotai-query-toolkit';
import { CONTRACT_ADDRESS, coreUrl, LOCAL_URL, NETWORK_CONFIG } from '../common/constants';

export const DevtoolsPanel = () => {
  const queryClient = useAtomValue(queryClientAtom);
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};

export const Devtools: React.FC = () => {
  useEffect(() => {
    console.debug('CORE_URL', coreUrl);
    console.debug('LOCAL_URL', LOCAL_URL);
    console.debug('NETWORK_CONFIG', NETWORK_CONFIG);
    console.debug('CONTRACT_ADDRESS', CONTRACT_ADDRESS);
  }, []);
  return process.env.NODE_ENV === 'production' ? null : <DevtoolsPanel />;
};
