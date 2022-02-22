import React, { useMemo } from 'react';
import { Box, Stack, Flex, BoxProps, StackProps } from '@nelson-ui/react';
export * from './rows';

interface CenterBoxProps {
  topExtra?: React.ReactNode;
  boxProps?: StackProps;
  noPadding?: boolean;
}

export const CenterBox: React.FC<CenterBoxProps> = ({
  children,
  topExtra,
  boxProps = {},
  noPadding,
}) => {
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
    <Flex alignItems="center" width="100%" justifyContent="center" position="relative">
      {topExtra === undefined ? null : topExtra}
      <Stack
        spacing="$6"
        maxWidth="100%"
        width="460px"
        borderColor="$color-border-subdued"
        borderRadius="$medium"
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
