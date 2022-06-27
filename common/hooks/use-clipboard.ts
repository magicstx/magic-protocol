import { useCallback } from 'react';
import { useCopyToClipboard } from 'usehooks-ts';

export function useClipboard() {
  const [_, copyToClipboard] = useCopyToClipboard();

  const copy = useCallback(
    async (text: string) => {
      await copyToClipboard(text);
    },
    [copyToClipboard]
  );

  return { copy };
}
