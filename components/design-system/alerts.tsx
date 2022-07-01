import React from 'react';
import { Alert, AlertHeader, AlertText } from '../alert';
import { Stack, Box } from '@nelson-ui/react';
import { StatusButton } from '../button';

export const Alerts: React.FC = () => {
  return (
    <Alert>
      <Stack spacing="20px">
        <AlertHeader>Something is wrong</AlertHeader>
        <Stack spacing="8px">
          <AlertText>
            Something is wrong with the supplier. They may add funds momentarily or you may need to
            cancel and recover.{' '}
          </AlertText>
          <AlertText>
            Your funds are safely escrowed, but for security you can only remove them 200 blocks
            from now (32 hours).
          </AlertText>
          <AlertText>
            You can return to this swap anytime from your history page to check the countdown.
          </AlertText>
        </Stack>
        <Box>
          <StatusButton status="error" showIcon={false} disabled>
            Wait 200 blocks
          </StatusButton>
        </Box>
      </Stack>
    </Alert>
  );
};
