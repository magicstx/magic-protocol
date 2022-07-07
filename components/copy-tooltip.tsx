import React, { useState, useCallback } from 'react';
import { useClipboard } from '../common/hooks/use-clipboard';
import { TooltipTippy } from './tooltip';
import { Text } from './text';
import type { BoxProps } from '@nelson-ui/react';
import { Box } from '@nelson-ui/react';

export const CopyTooltip: React.FC<BoxProps & { copyText: string }> = ({
  children,
  copyText,
  ...props
}) => {
  const { copy } = useClipboard();
  const [showCopied, setShowCopied] = useState(false);
  const unshowCopied = useCallback(() => {
    setShowCopied(false);
  }, [setShowCopied]);
  const onClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      setShowCopied(true);
      void copy(copyText);
    },
    [copy, copyText]
  );

  return (
    <TooltipTippy
      tippyProps={{
        trigger: 'mouseenter focus',
        followCursor: true,
        placement: 'bottom',
        hideOnClick: false,
        onHidden: unshowCopied,
      }}
      render={
        <Text variant="Caption01" color="$text">
          {showCopied ? 'Copied' : 'Copy'}
        </Text>
      }
      containerProps={{
        padding: '12px 16px',
      }}
    >
      <Box onClick={onClick} cursor="pointer" {...props}>
        {children}
      </Box>
    </TooltipTippy>
  );
};
