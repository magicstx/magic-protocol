import React from 'react';
import { Box, Stack } from '@nelson-ui/react';
import { Text } from './text';

export const Footer: React.FC = () => {
  return (
    <Box width="100%" textAlign="center" pb="42px">
      <Stack spacing="6px">
        {/* UNCOMMENT IF YOU WANT TO LINK TO DOCS
          <Box>
          <Text
            variant="Caption02"
            display="inline-block"
            textDecoration="underline !important"
            color="$text-dim"
            href="https://docs.magic.fun"
            target="_blank"
            as="a"
          >
            Need help?
          </Text>
        </Box> */}
      </Stack>
    </Box>
  );
};
