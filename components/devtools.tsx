import React, { useEffect } from 'react';
import { useAtomValue } from 'jotai/utils';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { queryClientAtom } from 'jotai-query-toolkit';
import { coreUrl, LOCAL_URL, NETWORK_CONFIG } from '../common/constants';
import { bridgeContract } from '../common/contracts';
import { persistQueryClient } from 'react-query/persistQueryClient-experimental';
import { createWebStoragePersistor } from 'react-query/createWebStoragePersistor-experimental';

export const DevtoolsPanel = () => {
  const queryClient = useAtomValue(queryClientAtom);
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};

export const Devtools: React.FC = () => {
  const queryClient = useAtomValue(queryClientAtom);

  useEffect(() => {
    const persistor = createWebStoragePersistor({
      storage: window.localStorage,
    });
    void persistQueryClient({
      queryClient,
      persistor,
    });
  }, [queryClient]);

  useEffect(() => {
    console.debug('CORE_URL', coreUrl);
    console.debug('LOCAL_URL', LOCAL_URL);
    console.debug('NETWORK_CONFIG', NETWORK_CONFIG);
    console.debug('CONTRACT_ADDRESS', bridgeContract().identifier);
  }, []);
  return process.env.NODE_ENV === 'production' ? null : <DevtoolsPanel />;
};
