import type { ReactElement } from 'react';
import React, { useEffect } from 'react';
import { useAtomValue } from 'jotai/utils';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { queryClientAtom } from 'jotai-query-toolkit';
import { APP_VERSION, coreUrl, LOCAL_URL, NETWORK_CONFIG } from '../common/constants';
import { bridgeContract } from '../common/contracts';
import { persistQueryClient } from 'react-query/persistQueryClient-experimental';
import { createWebStoragePersistor } from 'react-query/createWebStoragePersistor-experimental';
import { useAtomsDebugValue } from 'jotai/devtools';

export const DevtoolsPanel = () => {
  // useAtomsDebugValue();
  const queryClient = useAtomValue(queryClientAtom);
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};

export const DebugAtoms: React.FC = () => {
  useAtomsDebugValue();
  return null;
};

export const AtomDevTools: React.FC<{ children: ReactElement }> = ({ children }) => {
  return children;
  // todo: doesnt work with bigint
  // useAtomsDevtools('bridge');
  // return children;
};

export const Devtools: React.FC = () => {
  const queryClient = useAtomValue(queryClientAtom);

  useEffect(() => {
    // toggle to enable persistence
    const PERSIST_QUERIES = false;
    if (!PERSIST_QUERIES) return;
    const key = `REACT_QUERY_${NETWORK_CONFIG}_${APP_VERSION}`;
    const persistor = createWebStoragePersistor({
      storage: window.localStorage,
      key,
    });
    void persistQueryClient({
      queryClient,
      persistor,
      buster: key,
    });
  }, [queryClient]);

  useEffect(() => {
    console.debug('CORE_URL', coreUrl);
    console.debug('LOCAL_URL', LOCAL_URL);
    console.debug('NETWORK_CONFIG', NETWORK_CONFIG);
    console.debug('CONTRACT_ADDRESS', bridgeContract().identifier);
  }, []);
  return process.env.NODE_ENV === 'production' ? null : (
    <>
      <DebugAtoms />
      <DevtoolsPanel />
    </>
  );
};
