import React from 'react';
import { Box, BoxProps } from '@nelson-ui/react';
import { generatedTheme, baseTheme } from '../common/theme';
import figma from '../common/theme/figma';
import clsx from 'clsx';

const { textStyles } = generatedTheme;
const { colors } = baseTheme;

const getDefaultColor = (type?: keyof typeof textStyles): string => {
  switch (type) {
    case 'Body01':
    case 'Body02':
      return '$text';
    case 'Caption01':
    case 'Caption02':
      return '$text-subdued';
    case 'Display01':
    case 'Display02':
    case 'Heading01':
    case 'Heading02':
    case 'Heading03':
    case 'Heading04':
    case 'Heading05':
      return '$text';
    case 'Label01':
    case 'Label02':
    case 'Label03':
      return '$text';
  }
  return '$text';
};

export type TextVariant =
  | keyof typeof figma['Body']
  | keyof typeof figma['Caption']
  | keyof typeof figma['Heading']
  | keyof typeof figma['Label']
  | keyof typeof figma['Display'];

export type TextProps = BoxProps & { variant?: TextVariant };

export const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ variant, className, css = {}, ...props }, ref) => {
    const color = getDefaultColor(variant);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const styles = variant ? textStyles[variant] : {};
    return (
      <Box
        className={clsx([className])}
        ref={ref}
        color={color}
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        css={{
          ...styles,
          ...css,
        }}
        {...props}
      />
    );
  }
);
