import React, { useMemo } from 'react';
import type { StackProps } from '@nelson-ui/react';
import { Stack, Flex } from '@nelson-ui/react';
import { Text } from '../text';
import { useSwapId } from '../../common/store/swaps';
import { CopyTooltip } from '../copy-tooltip';
import { truncateMiddle } from '../../common/utils';
export * from './rows';

interface CenterBoxProps {
  topExtra?: React.ReactNode;
  boxProps?: StackProps;
  noPadding?: boolean;
  showSwapId?: boolean;
}

export const CenterBox: React.FC<CenterBoxProps> = ({
  children,
  topExtra,
  boxProps = {},
  noPadding,
  showSwapId,
}) => {
  const [swapId] = useSwapId();
  const stackProps = useMemo(() => {
    if (noPadding) {
      return {
        p: '0',
        py: '$row-y',
        spacing: '$row-y',
        ...boxProps,
      };
    } else {
      return boxProps;
    }
  }, [noPadding, boxProps]);
  return (
    <Flex
      alignItems="center"
      width="100%"
      justifyContent="center"
      position="relative"
      flexDirection="row"
      flexWrap="wrap"
    >
      {typeof swapId === 'string' ? (
        <CopyTooltip copyText={swapId} width="100%" mb="$4" textAlign="center">
          <Text
            variant="Caption02"
            color="$text-onsurface-very-dim"
            _hover={{ color: '$onSurface-text-dim' }}
          >
            {truncateMiddle(swapId.replace('0x', ''), 15)}
          </Text>
        </CopyTooltip>
      ) : null}
      {topExtra === undefined ? null : topExtra}
      <Stack
        spacing="$6"
        maxWidth="100%"
        width="460px"
        borderColor="$onSurface-border-subdued"
        borderRadius="$extra-large"
        borderWidth="1px"
        borderStyle="solid"
        p="$row-y"
        {...stackProps}
      >
        {children}
      </Stack>
    </Flex>
  );
};
