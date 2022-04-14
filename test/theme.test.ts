import { makeColors } from '@nelson-ui/core';
import { colors } from '@nelson-ui/theme';
import { generatedTheme, baseTheme, makeTheme } from '../common/theme';

test.skip('can make theme', () => {
  const theme = makeTheme();
  // console.log('theme', theme);

  // console.log(baseTheme.colors);
  // console.log(generatedTheme.textStyles);
  // console.log(baseTheme.lineHeights);
});
