import React from 'react';
import { Text } from './text';
import { Box } from '@nelson-ui/react';

export const Alert: React.FC = ({ children }) => {
  return (
    <Box
      border="1px solid $surface-error-border-subdued"
      backgroundColor="$color-surface-error"
      p="30px"
      color="$color-alert-red"
      maxWidth="100%"
      width="470px"
      borderRadius="$extra-large"
    >
      {children}
    </Box>
  );
};
