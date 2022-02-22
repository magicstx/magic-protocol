import React, { useMemo } from 'react';
import { getBtcTxUrl, getTxUrl } from '../../common/utils';
import { ExternalLinkIcon } from './external-link';

export const ExternalTx: React.FC<{ txId?: string; btcTxId?: string }> = ({
  txId = '',
  btcTxId,
}) => {
  const url = useMemo(() => {
    if (txId) return getTxUrl(txId);
    if (btcTxId) return getBtcTxUrl(btcTxId);
    return undefined;
  }, [txId, btcTxId]);
  if (typeof url === 'undefined') return null;
  return <ExternalLinkIcon cursor="pointer" onClick={() => window.open(url, '_blank')} />;
};
