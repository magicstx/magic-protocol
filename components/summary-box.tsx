import React from 'react';
import { Stack, BoxProps } from '@nelson-ui/react';

export const SummaryBox: React.FC<BoxProps> = ({ children, ...props }) => {
  return (
    <Stack
      spacing="$2"
      // backgroundColor="$background-subdued"
      textAlign="center"
      py="$6"
      {...props}
      alignItems="center"
    >
      {children}
    </Stack>
  );
};
