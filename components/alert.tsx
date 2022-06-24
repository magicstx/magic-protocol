import React from 'react';
import { Text } from './text';
import { Box, Flex } from '@nelson-ui/react';
import { ErrorIcon } from './icons/error';

export const AlertHeader: React.FC = ({ children }) => {
  return (
    <Flex alignItems="center">
      <ErrorIcon />
      <Text
        variant="Label02"
        display="inline-block"
        ml="$2"
        color="$color-alert-red"
        fontWeight="500 !important"
      >
        {children}
      </Text>
    </Flex>
  );
};

export const AlertText: React.FC = ({ children }) => {
  return (
    <Text color="$color-alert-red" variant="Body02">
      {children}
    </Text>
  );
};

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
