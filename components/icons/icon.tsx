import React from 'react';
import { BoxProps, Box } from '@nelson-ui/react';

export const Icon: React.FC<BoxProps> = ({ children, ...props }) => {
  return <Box {...props}>{children}</Box>;
};
