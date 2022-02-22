/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  borderRadius,
  boxShadow,
  colors,
  fonts,
  fontSizes,
  lineHeights,
  sizes,
} from '@nelson-ui/theme';
import { makeColors, createTheme, getCssText as nelsonCss } from '@nelson-ui/core';
import figma from './theme/figma';
import { PropertyValue, createStitches } from '@stitches/react';

function transformProps(props: Record<string, { value: string }>, suffix = '') {
  return Object.fromEntries(
    Object.entries(props).map(([key, val]) => {
      return [key, `${val.value}${suffix}`];
    })
  );
}

export function makeTheme() {
  const {
    Primary,
    Surface,
    Brand,
    Slate,
    fontFamilies,
    lineHeights,
    fontSize,
    letterSpacing,
    paragraphSpacing,
    Label,
    Caption,
    Body,
    Display,
    Heading,
    textCase,
    textDecoration,
    fontWeights,
    Annotate,
    ...BaseColors
  } = figma;
  const colors: Record<string, string> = {};
  const textStyles: Record<string, any> = {};
  [Label, Caption, Body, Display, Heading].forEach(dict => {
    Object.entries(dict).forEach(([variant, styles]) => {
      const css: Record<string, string> = {};
      Object.entries(styles.value).forEach(([key, val]) => {
        if (key === 'text-decoration') return;
        const [_, ...rest] = val.split('.');
        css[key] = `$${rest.join('-')}`;
      });
      textStyles[variant] = css;
    });
  });
  [BaseColors, Primary, Surface, Brand, Slate].forEach(dict => {
    Object.entries(dict).forEach(([key, v]) => {
      try {
        colors[key.toLowerCase().replace(/–/g, '-')] = v.value;
      } catch (error) {
        console.error(error);
        console.log(key, v.value);
      }
    });
  });
  return {
    colors: {
      ...colors,
      background: colors['color-background'],
      'color-base-black': colors['color-background'],
      text: '$color-slate-90',
    },
    textStyles,
    fontFamilies: transformProps(fontFamilies),
    fontWeights: transformProps(fontWeights),
    fontSizes,
  };
}

export const generatedTheme = makeTheme();

export const baseTheme = {
  colors: {
    ...colors.foundation,
    ...makeColors('dark'),
    ...generatedTheme.colors,
  },
  space: {
    ...sizes,
    'row-x': '30px',
    'row-y': '30px',
  },
  // fontSizes,
  fontSizes: generatedTheme.fontSizes,
  fonts: {
    ...fonts,
    ...transformProps(figma.fontFamilies),
  },
  fontFamilies: generatedTheme.fontFamilies,
  fontWeights: {
    light: 300,
    base: 400,
    semibold: 500,
    bold: 600,
    extrabold: 700,
    ...generatedTheme.fontWeights,
  },
  lineHeights: transformProps(figma.lineHeights, 'px'),
  letterSpacings: transformProps(figma.letterSpacing),
  paragraphSpacing: transformProps(figma.paragraphSpacing, 'px'),
  sizes: {},
  borderWidths: {
    base: '1px',
    medium: '2px',
    thick: '3px',
  },
  borderStyles: {
    base: 'solid',
  },
  radii: borderRadius,
  shadows: boxShadow,
  zIndices: {
    base: 10,
    mid: 50,
    high: 100,
    highest: 99,
  },
  transitions: {
    slow: 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)',
    base: 'all 0.25s cubic-bezier(0.23, 1, 0.32, 1)',
    fast: 'all 0.125s cubic-bezier(0.23, 1, 0.32, 1)',
  },
};

export const { styled, getCssText } = createStitches({
  theme: baseTheme,
  media: {
    bp1: '(min-width: 640px)',
    bp2: '(min-width: 768px)',
    bp3: '(min-width: 1024px)',
  },
  utils: {
    m: (value: PropertyValue<'margin'>) => ({
      margin: value,
    }),
    mt: (value: PropertyValue<'margin'>) => ({
      marginTop: value,
    }),
    mr: (value: PropertyValue<'margin'>) => ({
      marginRight: value,
    }),
    mb: (value: PropertyValue<'margin'>) => ({
      marginBottom: value,
    }),
    ml: (value: PropertyValue<'margin'>) => ({
      marginLeft: value,
    }),
    mx: (value: PropertyValue<'margin'>) => ({
      marginLeft: value,
      marginRight: value,
    }),
    my: (value: PropertyValue<'margin'>) => ({
      marginTop: value,
      marginBottom: value,
    }),
    p: (value: PropertyValue<'padding'>) => ({
      padding: value,
    }),
    pt: (value: PropertyValue<'padding'>) => ({
      paddingTop: value,
    }),
    pr: (value: PropertyValue<'padding'>) => ({
      paddingRight: value,
    }),
    pb: (value: PropertyValue<'padding'>) => ({
      paddingBottom: value,
    }),
    pl: (value: PropertyValue<'padding'>) => ({
      paddingLeft: value,
    }),
    px: (value: PropertyValue<'padding'>) => ({
      paddingLeft: value,
      paddingRight: value,
    }),
    py: (value: PropertyValue<'padding'>) => ({
      paddingTop: value,
      paddingBottom: value,
    }),
    size: (value: PropertyValue<'width'>) => ({
      width: value,
      height: value,
    }),
    w: (value: PropertyValue<'width'>) => ({
      width: value,
    }),
  },
});

export const darkMode = createTheme('dark-mode', baseTheme);

export function allCss() {
  return `${nelsonCss()}\n${getCssText()}`;
}
// console.log(theme.colors.background);
