import { useMemo } from 'react';

export function useWaitTime(waitBlocks: number) {
  const waitTime = useMemo(() => {
    if (waitBlocks > 144) {
      return `${(waitBlocks / 144).toFixed(1)} days`;
    } else if (waitBlocks > 6) {
      return `${(waitBlocks / 6).toFixed(1)} hours`;
    }
    return `${waitBlocks * 10} minutes`;
  }, [waitBlocks]);

  return waitTime;
}
