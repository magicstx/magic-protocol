import React from 'react';
import { Button, ButtonComp, StatusButton } from '../button';
import { Box, SpaceBetween, Stack, Grid } from '@nelson-ui/react';
import { Text } from '../text';

export const StatusButtons: React.FC = () => {
  return (
    <Grid
      gridTemplateColumns="0.5fr 1fr 1fr 1fr 1fr"
      gridColumnGap="$3"
      gridRowGap="$4"
      width="100%"
      alignItems="center"
    >
      <Box />
      <Text>Success</Text>
      <Text>Pending</Text>
      <Text>Pending Error</Text>
      <Text>Canceled</Text>
      <Box />
      <Box>
        <StatusButton status="success">Successful</StatusButton>
      </Box>
      <Box>
        <StatusButton status="pending">Pending</StatusButton>
      </Box>
      <Box>
        <StatusButton status="error">Pending</StatusButton>
      </Box>
      <Box>
        <StatusButton status="canceled">Canceled</StatusButton>
      </Box>
      <Text>Disabled</Text>
      <Box>
        <StatusButton disabled status="success">
          Successful
        </StatusButton>
      </Box>
      <Box>
        <StatusButton disabled status="pending">
          Pending
        </StatusButton>
      </Box>
      <Box>
        <StatusButton disabled status="error">
          Pending
        </StatusButton>
      </Box>
      <Box>
        <StatusButton disabled status="canceled">
          Canceled
        </StatusButton>
      </Box>
    </Grid>
  );
};

export const Buttons: React.FC = () => {
  return (
    <Grid
      gridTemplateColumns="1fr 1fr 1fr 1fr"
      gridColumnGap="$3"
      gridRowGap="$4"
      width="100%"
      alignItems="center"
    >
      <Text variant="Label01"></Text>
      <Text variant="Label01">Big</Text>
      <Text variant="Label01">Normal</Text>
      <Text variant="Label01">Connected</Text>
      <Box />
      <Box>
        <Button size="big">Swap</Button>
      </Box>
      <Box>
        <Button>Swap</Button>
      </Box>
      <Box>
        <Button connected>Swap</Button>
      </Box>
      <Text variant="Label01">Magic</Text>
      <Box>
        <Button size="big" magic>
          Swap
        </Button>
      </Box>
      <Box>
        <Button magic>Swap</Button>
      </Box>
      <Box />
      <Text variant="Label01">Disabled</Text>
      <Box>
        <Button size="big" disabled>
          Swap
        </Button>
      </Box>
      <Box>
        <Button disabled>Swap</Button>
      </Box>
    </Grid>
  );
};
