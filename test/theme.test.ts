import { makeColors } from '@nelson-ui/core';
import { colors } from '@nelson-ui/theme';
import { generatedTheme, baseTheme, makeTheme, makeNewTheme, newFsColors } from '../common/theme';

test('can make theme', () => {
  const theme = makeTheme();
  // console.log('theme', theme);

  console.log(baseTheme.colors);
  // console.log(newFsColors());
  // console.log(generatedTheme.textStyles);
  // console.log(baseTheme.lineHeights);
});

// test('new theme', () => {
//   const theme = makeNewTheme();

// });
