import React, { useMemo } from 'react';
import type { BoxProps } from '@nelson-ui/react';
import { Box, Stack } from '@nelson-ui/react';
import { keyframes } from '@nelson-ui/core';
import type { VariantProps } from '@stitches/react';
import { styled } from '@stitches/react';
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
  backgroundColor: '$color-grey-100',
  color: '$surface-surface',
  '&:hover': {
    backgroundColor: '$color-slate-300',
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
        backgroundColor: '$primary-action-subdued',
        color: '$onSurface-text-subdued',
        '&:hover': {
          backgroundColor: '$primary-action-subdued',
          color: '$onSurface-text-subdued',
        },
        pointerEvents: 'none',
      },
    },
    connected: {
      true: {
        background: '$onSurface-very-subdued',
        border: '1px solid $onSurface-border',
        '.button-text': {
          color: '$text',
        },
        '&:hover': {
          background: '$surface-surface--pressed',
          borderColor: '$onSurface-border',
        },
      },
    },
    magicBg: {
      true: {
        minWidth: '234px',
        backgroundColor: '$grey-100',
        // backgroundImage: '$color-primary-magic-hover',
        // backgroundSize: '150% 150%',
        // animation: `${magicBg()} 5s ease infinite`,
        '&:hover': {
          backgroundColor: '$color-grey-300',
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
        padding="3px"
        maxWidth="244px"
        backgroundImage="$foil"
        backgroundSize="150% 150%"
        mx="auto"
        animation={`${magicBg()} 5s ease infinite`}
        {...props}
      >
        <ButtonComp size={size} connected={connected} disabled={disabled} magicBg>
          <Text
            className="button-text"
            variant={size === 'big' ? 'Label01' : 'Label02'}
            color="inherit"
          >
            {children}
          </Text>
        </ButtonComp>
      </Box>
    );
  }
  return (
    <ButtonComp disabled={disabled} {...props} size={size} connected={connected}>
      <Text
        className="button-text"
        variant={size === 'big' ? 'Label01' : 'Label02'}
        color="inherit"
      >
        {children}
      </Text>
    </ButtonComp>
  );
};

const StatusButtonComp = styled(Box, {
  padding: '14px 19px 14px 17px',
  borderRadius: '10px',
  cursor: 'pointer',
  '&[disabled]': {
    opacity: '0.6',
    pointerEvents: 'none',
  },
  variants: {
    status: {
      success: {
        border: '1px solid $dark-success-border-subdued',
        backgroundColor: '$surface-success-subdued',
        color: '$green-500',
      },
      pending: {
        border: '1px solid $dark-border-warning-subdued',
        backgroundColor: '$dark-surface-warning',
        color: '$warning-action-warning',
      },
      error: {
        border: '1px solid $surface-error-border-subdued',
        color: '$text-alert-red',
      },
      canceled: {
        border: '1px solid $border-subdued',
        color: '$light-onSurface-text-dim',
        backgroundColor: '$surface-very-subdued',
      },
    },
  },
});

export type ButtonStatus = VariantProps<typeof StatusButtonComp>['status'];

export const StatusButton: React.FC<
  BoxProps & VariantProps<typeof StatusButtonComp> & { showIcon?: boolean }
> = ({ status, children, showIcon = true, ...props }) => {
  const icon = useMemo(() => {
    if (!showIcon) return null;
    if (status === 'success') {
      return <CheckIcon color="var(--colors-green-500)" />;
    } else if (status === 'pending') {
      return <PendingIcon color="var(--colors-dark-warning-action-warning)" />;
    } else if (status === 'error') {
      return <PendingIcon color="var(--colors-text-alert-red)" />;
    } else if (status === 'canceled') {
      return <CheckIcon color="var(--colors-light-onSurface-text-dim" />;
    }
    return null;
  }, [status, showIcon]);
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
