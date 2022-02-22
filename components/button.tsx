import React, { useMemo } from 'react';
import { Box, BoxProps, Stack } from '@nelson-ui/react';
import { keyframes } from '@nelson-ui/core';
import { styled, VariantProps } from '@stitches/react';
import { Text } from './text';
import { CheckIcon } from './icons/check';
import { PendingIcon } from './icons/pending';

const magicBg = keyframes({
  '0%': { backgroundPosition: '10% 0%' },
  '50%': { backgroundPosition: '91% 100%' },
  '100%': { backgroundPosition: '10% 0%' },
});

export const ButtonComp = styled(Box, {
  padding: '14px 24px',
  borderRadius: '50px',
  textAlign: 'center',
  cursor: 'pointer',
  backgroundColor: '$color-primary',
  color: '$color-base-white',
  '&:hover': {
    backgroundColor: '$color-primary-text',
  },
  variants: {
    size: {
      big: {
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: '20px 24px',
        minWidth: '240px',
        borderRadius: '50px',
      },
    },
    disabled: {
      true: {
        backgroundColor: '$color-primary-disabled',
        '&:hover': {
          background: '$color-primary-disabled',
          cursor: 'default',
        },
      },
    },
    connected: {
      true: {
        background: '$color-surface',
        border: '1px solid $color-primary',
        '.button-text': {
          color: '$color-primary-text',
        },
        '&:hover': {
          background: '$color-surface-200',
          borderColor: '$color-primary-text',
        },
      },
    },
    magicBg: {
      true: {
        // backgroundImage: '$color-primary-magic-hover',
        // backgroundSize: '150% 150%',
        // animation: `${magicBg()} 5s ease infinite`,
        '&:hover': {
          backgroundImage: '$color-primary-magic-hover',
          // animation: `${magicBg()} 5s ease infinite`,
        },
      },
    },
  },
});

export const Button: React.FC<
  BoxProps &
    VariantProps<typeof ButtonComp> & {
      magic?: boolean;
    }
> = ({ children, size, connected, disabled, magic, ...props }) => {
  if (magic) {
    return (
      <Box
        borderRadius="50px"
        padding="2px"
        maxWidth="244px"
        background="$color-primary-magic-hover"
        // backgroundSize="150% 150%"
        mx="auto"
        // animation={`${magicBg()} 5s ease infinite`}
        {...props}
      >
        <ButtonComp size={size} connected={connected} disabled={disabled} magicBg>
          <Text className="button-text" variant={size === 'big' ? 'Label01' : 'Label02'}>
            {children}
          </Text>
        </ButtonComp>
      </Box>
    );
  }
  return (
    <ButtonComp disabled={disabled} {...props} size={size} connected={connected}>
      <Text className="button-text" variant={size === 'big' ? 'Label01' : 'Label02'}>
        {children}
      </Text>
    </ButtonComp>
  );
};

const StatusButtonComp = styled(Box, {
  padding: '14px 19px 14px 17px',
  borderRadius: '10px',
  cursor: 'pointer',
  variants: {
    status: {
      success: {
        border: '1px solid $color-primary',
        backgroundColor: '$color-surface-200',
        color: '$color-primary-text',
      },
      pending: {
        border: '1px solid #86550B',
        backgroundColor: '#21180A',
        color: '$color-warning',
      },
    },
  },
});

export const StatusButton: React.FC<BoxProps & VariantProps<typeof StatusButtonComp>> = ({
  status,
  children,
  ...props
}) => {
  const icon = useMemo(() => {
    if (status === 'success') {
      return <CheckIcon color="var(--colors-color-primary-text)" />;
    } else if (status === 'pending') {
      return <PendingIcon color="var(--colors-color-warning)" />;
    }
    return null;
  }, [status]);
  return (
    <StatusButtonComp status={status} display="inline-block" {...props}>
      <Stack isInline alignItems="center" spacing="8px">
        {icon}
        <Box>
          <Text variant="Label02" color="inherit">
            {children}
          </Text>
        </Box>
      </Stack>
    </StatusButtonComp>
  );
};
