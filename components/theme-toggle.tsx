import type { BoxProps } from '@nelson-ui/react';
import { Box, useThemeEffect } from '@nelson-ui/react';
import React, { useState } from 'react';
import type { SwitchProps } from '@radix-ui/react-switch';
import * as SwitchPrimitive from '@radix-ui/react-switch';

const StyledSwitch = {
  all: 'unset',
  width: 42,
  height: 24,
  backgroundColor: '$border',
  borderRadius: '9999px',
  position: 'relative',
  WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
  '&[data-state="checked"]': { backgroundColor: 'rgba(255,255,255,0.25)' },
};

const StyledThumb = {
  display: 'block',
  width: 18,
  height: 18,
  backgroundColor: 'white',
  borderRadius: '9999px',
  transition: 'transform 100ms',
  transform: 'translateX(4px)',
  willChange: 'transform',
  '&[data-state="checked"]': { transform: 'translateX(20px)' },
};

const Switch = (props: BoxProps & SwitchProps) => (
  <Box as={SwitchPrimitive.Root} css={StyledSwitch} {...props} />
);
const SwitchThumb = (props: BoxProps) => (
  <Box as={SwitchPrimitive.Thumb} css={StyledThumb} {...props} />
);

export function DarkModeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  useThemeEffect(theme);
  const toggleTheme = (value: boolean) => {
    setTheme(s => (value ? 'dark' : 'light'));
  };
  return (
    <Switch onCheckedChange={toggleTheme}>
      <SwitchThumb />
    </Switch>
  );
}
