import React, { useRef, useCallback } from 'react';
import { useHover } from 'usehooks-ts';
import { Box } from '@nelson-ui/react';
import { useAtomCallback } from 'jotai/utils';
import { outputTokenState, inputTokenState } from '../../common/store/swap-form';
import { FlipIcon } from '../icons/flip';
import { ReverseIcon } from '../icons/reverse';

export const SwapFlip: React.FC = () => {
  const switchDirection = useAtomCallback(
    useCallback((get, set) => {
      const outputToken = get(outputTokenState);
      set(inputTokenState, outputToken);
    }, [])
  );
  const hoverRef = useRef(null);
  const isHoverFlip = useHover(hoverRef);
  return (
    <Box position="relative" width="100%">
      <Box ref={hoverRef} size={36} mx="auto">
        {isHoverFlip ? (
          <ReverseIcon onClick={switchDirection} mx="auto" cursor="pointer" zIndex="2" />
        ) : (
          <FlipIcon
            mx="auto"
            width="36px"
            height="36px"
            onClick={switchDirection}
            cursor="pointer"
            zIndex="2"
          />
        )}
      </Box>
      <Box
        width="100%"
        position="absolute"
        top="18px"
        border="1px solid $onSurface-border-subdued"
        borderWidth="1px 0 0 0"
        zIndex="-1"
      />
    </Box>
  );
};
