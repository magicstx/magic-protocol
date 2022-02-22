import { useCallback } from 'react';
import { useCopyToClipboard } from 'usehooks-ts';
import { toast } from 'react-toastify';

export function useClipboard() {
  const [_, copyToClipboard] = useCopyToClipboard();

  const copy = useCallback(
    async (text: string) => {
      const copied = await copyToClipboard(text);
      if (copied) {
        toast('Copied to clipboard', { autoClose: 2000, pauseOnFocusLoss: false });
      } else {
        toast('Unable to copy to clipboard', { type: 'error' });
      }
    },
    [copyToClipboard]
  );

  return { copy };
}
