import React, { useMemo } from 'react';
import { NextPage } from 'next';
import { Layout } from '../components/layout';
import { withMicroStacks } from '../common/with-micro-stacks';
import { Button, ButtonComp, StatusButton } from '../components/button';
import { Box, SpaceBetween, Stack, Grid } from '@nelson-ui/react';
import { Text } from '../components/text';
import { keyframes } from '@nelson-ui/core';
import { baseTheme } from '../common/theme';
import { Buttons, StatusButtons } from '../components/design-system/design-buttons';

const magicBg = keyframes({
  '0%': { backgroundPosition: '10% 0%' },
  '50%': { backgroundPosition: '91% 100%' },
  '100%': { backgroundPosition: '10% 0%' },
});

const UiPage: NextPage = () => {
  const colorRows = useMemo(() => {
    // console.log(theme.colors);
    return Object.entries(baseTheme.colors).map(([key, color]) => {
      return (
        <SpaceBetween key={key}>
          <Text variant="Label02">{key}</Text>
          <Box size="15px" borderRadius="50%" background={color}></Box>
        </SpaceBetween>
      );
    });
  }, []);
  return (
    <Layout>
      <Buttons />
      <StatusButtons />
      <Stack spacing="$row-y">{colorRows}</Stack>
      <Stack spacing="$row-y">
        <Text variant="Label01">Current:</Text>
        <Button magic size="big">
          ✨ Swap ✨
        </Button>

        <Text variant="Label01">CSS gradient:</Text>
        <Box
          borderRadius="50px"
          padding="2px"
          maxWidth="244px"
          background="$color-primary-magic-hover"
          backgroundSize="150% 150%"
          mx="auto"
          animation={`${magicBg()} 5s ease infinite`}
        >
          <ButtonComp
            size={'big'}
            backgroundImage={'$color-primary-magic-hover'}
            backgroundSize={'150% 150%'}
            animation={`${magicBg()} 5s ease infinite`}
            _hover={{
              backgroundImage: '$color-primary-magic-hover',
              backgroundSize: '150% 150%',
              animation: `${magicBg()} 5s ease infinite`,
              background: 'none',
            }}
          >
            <Text className="button-text" variant={'Label01'}>
              ✨ Swap ✨
            </Text>
          </ButtonComp>
        </Box>

        <Text variant="Label01">GIF:</Text>
        <Button
          size="big"
          backgroundImage="url(/miami-beach_loader1.gif)"
          backgroundSize="cover"
          _hover={{
            background: 'url(/miami-beach_loader1.gif)',
            backgroundSize: 'cover',
          }}
        >
          ✨ Swap ✨
        </Button>
      </Stack>
    </Layout>
  );
};

export default withMicroStacks(UiPage);
